# UYAP Hızlı Giriş ve Duyuru Kapatma

UYAP Avukat Portal'a girişi hızlandıran ve her açılışta çıkan duyuru pencerelerini
kendiliğinden kapatan Chrome eklentisi. Bir avukat tarafından, kendisi gibi sabırsız ve UYAP'a
tahammülü düşük meslektaşları için açık kaynak olarak yazıldı; resmî bir UYAP ürünü değildir.

Eklenti yalnızca `avukat.uyap.gov.tr` adresinde çalışır. İnternete hiçbir istek yapmaz;
kapattığı duyurunun metni dışında sayfadan hiçbir şey okumaz, kaydetmez, göndermez.

## Ne yapar

- Giriş sayfasında ve ana sayfada açılan duyuru pencerelerini kendiliğinden kapatır;
  **Tekrar Gösterme** dediğiniz hâlde yeniden çıkanlar da dahil.
- Kapattığı her duyuruyu simgedeki kırmızı rozette sayar, isterseniz kısa bir sesle bildirir.
- Kapatılan duyuruların metnini ve saatini, simgeye tıklayınca listeler (son 20 duyuru).
- Giriş sayfasında **Adalet E-imza ile Giriş** düğmesine kendisi tıklar ve imleci **Pin Kodu**
  alanına getirir; sayfa açılır açılmaz Pin yazmaya hazır olursunuz.
- İsterseniz portalın sol menüsünü her sayfada kendiliğinden daraltır.
- Her özellik ayrı ayrı, eklentinin tamamı da tek anahtarla açılıp kapatılabilir.

## Kurulum

### [Chrome Web Mağazası'ndan ekle](https://chromewebstore.google.com/detail/lnafoihbnaonnghgjnbmlnpeehojinie)

1. Bağlantıya tıklayın, açılan sayfada **Chrome'a ekle**'ye basın.
2. Çıkan küçük pencerede **Uzantı ekle**'ye basın.
3. Kurulum bitince eklenti kendi karşılama sayfasını açar. Orada anlatıldığı gibi, adres
   çubuğunun sağındaki **yapboz parçası** simgesine tıklayıp listede eklentinin yanındaki
   **raptiye** simgesine basın; simge araç çubuğuna sabitlenir. Sabitlemeseniz de eklenti
   arka planda çalışır, ama rozeti ve duyuru listesini görmek için sabitlemek gerekir.

Üyelik, e-posta ya da ücret istemez. Kurulumdan sonra yapılacak bir ayar yoktur: duyuru
kapatma, hızlı giriş ve bildirim sesi açık, menü gizleme kapalı başlar.

### Kaynak koddan

1. Bu depoyu indirin: sağ üstteki **Code > Download ZIP**, sonra dosyayı bir klasöre çıkarın.
2. Chrome'da adres çubuğuna `chrome://extensions` yazıp Enter'a basın.
3. Sağ üstteki **Geliştirici modu** anahtarını açın.
4. **Paketlenmemiş öğe yükle**'ye basıp çıkardığınız klasörü seçin.

### Güncelleme

Mağazadan kurduysanız Chrome yeni sürümü kendisi yükler. Kaynak koddan kurduysanız yeni
dosyaları aynı klasöre alıp `chrome://extensions` sayfasında eklentinin kartındaki **yenile**
okuna basın.

## Eklenti penceresi

Araç çubuğundaki simgeye tıklayınca açılır. Sağ üstteki büyük anahtar eklentinin tamamını
kapatır; kapalıyken simge gri görünür.

| Anahtar | Ne yapar |
| --- | --- |
| **Hızlı Giriş** | Adalet e-İmza girişine tıklar, Pin alanına odaklanır |
| **Duyuru Kapatma** | Açılan duyuru pencerelerini otomatik kapatır |
| **Bildirim Sesi** | Duyuru kapatıldığında kısa bir ses çalar (Duyuru Kapatma'nın altındadır) |
| **Duyuru Bildirim Sesi Sıklığı** | Aynı duyuru için her kapatmada, 2, 5 ya da 10 kapatmada bir ses çalar; varsayılan 5 |
| **Menü Gizleme** | Sol menüyü tüm sayfalarda otomatik daraltır/kapatır |

Altta **Son Kapatılan Duyurular** listesi durur: en yeni üstte, başında kapatıldığı saat.
Pencereyi açmak rozetteki sayıyı sıfırlar; liste durur.

Üç özelliğin hepsini kapatırsanız büyük anahtar da kapanır. Büyük anahtarı yeniden açmak
Hızlı Giriş ile Duyuru Kapatma'yı açar; Menü Gizleme kapalı kalır, isterseniz ayrıca açarsınız.
Değişiklikler sayfayı yenilemeden anında uygulanır.

Ses, eklentinin kendi arka plan sayfasından çalınır: UYAP sekmesi arkada olsa da, başka bir
sekmedeyken de duyulur.

## Verileriniz nerede duruyor?

- Eklentinin istediği izinler: `storage` (ayarlar), `offscreen` (ses) ve yalnızca
  `avukat.uyap.gov.tr` sayfalarında çalışma. Başka hiçbir siteye erişimi yoktur.
- Ayarlar (anahtarların durumu, ses sıklığı) Chrome'un eklenti deposunda, bilgisayarınızda durur.
- Kapatılan duyuru metinleri, saatleri ve rozet sayacı yalnızca oturum belleğinde tutulur;
  diske yazılmaz, bütün Chrome pencerelerini kapattığınızda silinir.
- Eklenti internete hiçbir istek yapmaz, harici kütüphane içermez, hiçbir sunucuyla konuşmaz.
  Kaynak kodun tamamı, simgeler dahil, bu depodadır; isteyen inceleyip değiştirebilir.

> **Dikkat:** Duyurular UYAP'ın size ulaşma yoludur. Rozeti ve sesi fark edip simgeye
> tıklamayacaksanız ya da duyurular sizin için önemliyse **Duyuru Kapatma**'yı kapalı tutun;
> Hızlı Giriş tek başına da çalışır.

## Kaldırma

`chrome://extensions` sayfasında eklentinin kartındaki **Kaldır**'a basın ya da araç
çubuğundaki simgeye sağ tıklayıp **Chrome'dan kaldır**'ı seçin. Ayarlar eklentiyle birlikte
silinir.

## Bilinen sınırlar

- Duyuru kapatma yalnızca giriş sayfasında ve ana sayfada (`avukat.uyap.gov.tr/`) çalışır;
  portalın iç sayfalarında açılan pencerelere dokunmaz.
- Eklenti sayfada **Kapat** ve **Adalet E-imza** yazılarını arar; portal bu adları
  değiştirirse yeni sürüm gerekir.
- Hızlı Giriş, Pin alanına siz yazmaya başladıktan sonra imleci bir daha zorlamaz.

İletişim: [x.com/CgrShn](https://x.com/CgrShn)

Lisans: MIT. Ayrıntılar için [LICENSE](LICENSE) dosyasına bakınız.
