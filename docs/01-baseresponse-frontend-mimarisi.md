# 01 — Frontend BaseResponse Mimarisi

## Bağlam

Backend (Lab.Auth) tarafında tüm endpoint'ler artık `BaseResponse<T>` zarfı içinde cevap dönüyor:

```json
// Başarı
{
  "isSuccess": true,
  "data": { ... },
  "errors": null,
  "errorType": "None"
}

// Hata
{
  "isSuccess": false,
  "data": null,
  "errors": ["Kitap bulunamadı."],
  "errorType": "NotFound"
}
```

Bu zarfı frontend tarafında **doğru** karşılamak için bir mimari katman gerekiyor.

Önemli kısıt (kullanıcı tarafından belirtildi): Backend'e ileride **global exception handler** eklenecek. Bu, beklenmedik tüm hataların da `BaseResponse` formatında dönmesini garantileyecek. Frontend tarafında o noktada **hiçbir değişiklik gerekmemeli** — sadece response'u "okuyup" doğru davranabilmeli.

---

## Karar: 3 Katmanlı Yaklaşım

### Katman 1 — Tip Tanımları (Contract)

`core/http/error-type.ts` ve `core/http/base-response.model.ts`:

- Backend'in döndüğü JSON yapısını bire bir TypeScript'e çevirir.
- `ErrorType`, string literal union (`'NotFound' | 'Validation' | ...`). Backend `JsonStringEnumConverter` ile string döndüğü için bu eşleşir.
- `BaseResponse<T>` interface'i `readonly` — değişmez veri.

### Katman 2 — HTTP Wrapper (`ApiHttpService`)

`core/http/api-http.service.ts`:

- `HttpClient`'ın üstüne ince bir katman.
- 4 metod: `get`, `post`, `put`, `delete`. Hepsi generic.
- Tüm response'ları `BaseResponse<T>` olarak bekler.
- **Başarı durumunda zarfı açıp `data` alanını döner.** Servisler/componentler bu sayede zarfı hiç görmez, sadece "ham" domain modelleriyle çalışır.
- URL prefix yönetimini de o yapar (`environment.apiBaseUrl` ile).

### Katman 3 — Global Hata Yakalayıcı (`apiErrorInterceptor`)

`core/http/api-error.interceptor.ts`:

- Functional `HttpInterceptorFn` (modern Angular).
- 4xx/5xx hatalarda devreye girer.
- Backend `errors: [...]` alanı dolu mu kontrol eder → varsa kullanıcıya o mesajı toast olarak gösterir.
- Yok ise fallback mesajlar:
  - `status === 0` → "Sunucuya ulaşılamıyor."
  - Diğer → "Beklenmedik bir hata oluştu."
- Hatayı yine de zincirde fırlatır (`throwError`) — component özel davranış göstermek isterse yakalayabilir, ama mesajı tekrar göstermesine gerek kalmaz.

---

## Neden Bu Yaklaşım?

### Neden Servis BaseResponse'u Değil de `data`'yı Dönüyor?

**Eski yaklaşımda** servisler `Observable<BaseResponse<Book[]>>` döndürseydi, her component şunu yazardı:

```typescript
this.bookService.getList().subscribe(response => {
  if (response.isSuccess) {
    this.books = response.data;
  } else {
    // hata handling...
  }
});
```

Bu hem **boilerplate** hem de **HTTP transport detayı** her component'e sızar. Component zaten "kitap listesi geliyor" diye bekliyor, kafasını `isSuccess` ile yormasın.

Yeni yaklaşımda:

```typescript
this.bookService.getList().subscribe(books => {
  this.books = books;
});
```

Component sadece domain ile ilgilenir. Transport detayı `ApiHttpService` içinde gizli.

> **Best practice referansı:** Stripe, Twilio, GitHub gibi SDK'lar da bu "unwrap" yaklaşımını kullanır. Geliştirici `client.charges.create(...)` der; "ama acaba response başarılı mı, status code ne?" diye düşünmez. SDK halletmiş olur.

### Neden Global Interceptor?

**Eski kodda** her subscribe bloğunda `error: () => notification.error('...')` vardı. Yani:

```typescript
this.bookService.create(payload).subscribe({
  next: () => { ... },
  error: () => this.notification.error('Kayıt sırasında bir hata oluştu.'),  // ← her yerde tekrar
});
```

Üç sorun:

1. **DRY ihlali**: Aynı pattern 10+ yerde tekrar eder.
2. **Mesaj generic**: "Bir hata oluştu" — kullanıcıya yardım etmez. Oysa backend "Kitap bulunamadı." veya "ISBN zaten kayıtlı." gibi spesifik mesaj döner.
3. **Bakım maliyeti**: Yeni hata tipi gelince (örn. backend "global exception handler" eklenince) tüm component'leri güncellemek lazım.

İnterceptor'da merkezi handle ile:

- Backend mesajı doğrudan kullanıcıya gider (spesifik, anlamlı).
- Component'lerde tek bir `error: ...` callback'i yok.
- Yarın backend yeni bir hata tipi yollarsa, frontend bunu **kod değişikliği olmadan** zaten gösterir.

### Neden `withInterceptors([...])` (Functional)?

Eski stil class-based interceptor (`HTTP_INTERCEPTORS`) hâlâ çalışır ama:
- Functional interceptor daha az boilerplate.
- DI kullanımı (`inject(NotificationService)`) doğrudan yapılır.
- Modern Angular (15+) tavsiyesi.
- Tree-shake edilebilir, daha küçük bundle.

---

## Akış Diyagramı

```
Component (book-form, dashboard, vs.)
    │
    │  bookService.create(payload).subscribe(...)
    ▼
Service (BookService)
    │
    │  api.post<string, CreateBookPayload>('/api/admin/books', payload)
    ▼
ApiHttpService
    │
    │  http.post<BaseResponse<string>>(url, body).pipe(map(unwrap))
    ▼
HttpClient
    │
    │  [HTTP request]
    ▼
Backend (BaseApiController.HandleResult)
    │
    │  HTTP 200/4xx/5xx + BaseResponse JSON
    ▼
HttpClient (yanıt aldı)
    │
    ├── Başarı (2xx) ──▶ ApiHttpService unwrap ──▶ data ──▶ Service ──▶ Component
    │
    └── Hata (4xx/5xx) ──▶ apiErrorInterceptor.catchError
                                │
                                ├──▶ NotificationService.error(mesaj)
                                │
                                └──▶ throwError → Service → Component (opsiyonel handling)
```

---

## Component'lerde Önce-Sonra

### Eski

```typescript
this.bookService.update(id, payload).subscribe({
  next: () => {
    this.notification.success(`"${title}" güncellendi.`);
    this.router.navigate(['/admin/books']);
  },
  error: () => this.notification.error('Güncelleme sırasında bir hata oluştu.'),
});
```

### Yeni

```typescript
// Hata otomatik gösterilir (interceptor); biz sadece success durumunu yazıyoruz.
this.bookService.update(id, payload).subscribe(() => {
  this.notification.success(`"${title}" güncellendi.`);
  this.router.navigate(['/admin/books']);
});
```

`error` callback'i kaldırıldı. Sebep: interceptor zaten backend'in döndüğü mesajı toast olarak gösteriyor. Kullanıcı yine bilgilendiriliyor — üstelik daha **spesifik** bir mesajla.

---

## `getById` Gibi Tek Kayıt Sorgularında Özel Durum

Backend artık "kayıt yok" durumunda **404** dönüyor (`null` değil). `HttpClient` bunu Observable error olarak iletir. İnterceptor toast gösterir, ama outer Observable error state'ine geçer ve sonraki emit'leri bloklayabilir.

Bu yüzden `book-detail` ve `book-form` gibi component'lerde:

```typescript
switchMap((id) =>
  id
    ? this.bookService.getById(id).pipe(catchError(() => of(null)))
    : of(null),
),
```

`catchError(() => of(null))` ile observable'ı null'a düşürüyoruz. UI bu null'ı görür ve "bulunamadı" ekranını render eder.

Toast da gösterilir + UI inline mesaj da gösterilir. İki bilgi farklı katmanlarda, çakışmaz.

---

## Dosya Yapısı

```
src/app/core/http/
  base-response.model.ts        # BaseResponse<T> interface
  error-type.ts                 # ErrorType string literal union
  api-http.service.ts           # HttpClient wrapper, unwrap mantığı
  api-error.interceptor.ts      # Global error handler
  index.ts                      # barrel export
```

İmport tek noktadan:

```typescript
import { ApiHttpService, BaseResponse, ErrorType, apiErrorInterceptor } from '@core/http';
```

---

## İleride Eklenebilecekler (Şu An Yok)

### 1) Interceptor'ı Atlama Mekanizması

Bazı durumlarda component özel davranmak isteyebilir (örn. validation hatasını form alanlarına yansıtmak). O zaman interceptor'ın toast'u istenmeyebilir.

**Yöntem:** `HttpContextToken` ile flag. Servis çağrısı şöyle olur:

```typescript
this.api.post(url, body, { context: skipErrorInterceptor() });
```

Şimdi gerek yok, ihtiyaç doğunca eklenir.

### 2) ErrorType'a Göre Özel Davranışlar

- `Unauthorized` → login sayfasına yönlendir
- `Forbidden` → yetki uyarısı + farklı renkte toast
- `Validation` → form alanına mapping (backend'in field-bilgisi yollaması gerekir önce)

Şu anki interceptor sadece mesajı gösteriyor. ErrorType ayrımı yapmıyor. Backend tarafında auth/yetkilendirme katmanı yazılınca eklenir.

### 3) Loading State Yönetimi

Tüm HTTP isteklerinin "yükleniyor" göstergesini merkezi yönetmek için ayrı bir interceptor + service çifti eklenebilir. Şu an her component kendi loading'ini handle ediyor.

---

## Test Senaryoları (Manual)

Backend ayakta. Frontend çalışıyor (`ng serve`).

1. **Var olmayan kitabı detay sayfasında aç:** `/books/00000000-0000-0000-0000-000000000000`
   - Beklenti: Toast'ta "Kitap bulunamadı." + sayfada "bulunamadı" görünümü.

2. **Validation hatası tetikle:** Admin → kitap ekle → ISBN'i boş bırak → submit.
   - Beklenti: Frontend zaten engelliyor; backend'e gitse bile "Title boş olamaz" gibi mesaj toast'ta görünür.

3. **Backend'i kapat, herhangi bir liste sorgusu yap.**
   - Beklenti: "Sunucuya ulaşılamıyor." toast'ı.

4. **Başarılı bir kitap silme:** Admin → kitap listesi → sil → onayla.
   - Beklenti: "X silindi." başarı toast'ı. Liste güncellenir.

---

## Özet Tablo

| Eski | Yeni |
|------|------|
| Service `Observable<RawDto>` döner | Service `Observable<DomainModel>` döner (Unwrap zarftan) |
| Component'te `error: () => notification.error('...')` | İnterceptor halleder, component temiz |
| Generic "bir hata oluştu" mesajı | Backend'in döndüğü spesifik mesaj |
| 404 → `null` döndürülürdü | 404 → Observable error → interceptor + catchError |
| 4 ayrı service'te `inject(HttpClient)` | 4 ayrı service'te `inject(ApiHttpService)` |
| Hiçbir tek noktada response shape kontratı | `BaseResponse<T>` interface ile tip güvenli kontrat |
