# UYAP Hızlı Giriş ve Duyuru Kapatma

### [⬇ Chrome Web Mağazası'ndan ekle](https://chromewebstore.google.com/detail/lnafoihbnaonnghgjnbmlnpeehojinie)

UYAP Avukat Portal'a girişi hızlandıran ve her açılışta çıkan duyuru pencerelerini kendiliğinden kapatan bir
**Chrome eklentisi**.

Bir avukat tarafından, kendisi gibi sabırsız ve UYAP'a tahammülü düşük meslektaşları için açık kaynak olarak yazıldı.
Resmî bir UYAP ürünü değildir.

Eklenti yalnızca `avukat.uyap.gov.tr` adresinde çalışır. İnternete hiçbir istek yapmaz. Kapattığı duyurunun metni
dışında sayfadan hiçbir şey okumaz, kaydetmez, göndermez.

## Kurulum

Bilgisayarınızda Google Chrome olması yeter. Eklenti üyelik, e-posta ya da ücret istemez, kurulumdan sonra yapılacak bir
ayar da yoktur.

### Chrome Web Mağazası'ndan

1. Yukarıdaki bağlantıya tıklayın, açılan sayfada **Chrome'a ekle**'ye basın.
2. Çıkan küçük pencerede **Uzantı ekle**'ye basın.
3. Kurulum bitince eklenti kendi karşılama sayfasını açar. Orada anlatıldığı gibi, adres çubuğunun sağındaki **yapboz
   parçası** simgesine tıklayıp listede eklentinin yanındaki **raptiye** simgesine basın. Simge araç çubuğuna
   sabitlenir. Sabitlemeseniz de eklenti arka planda çalışır, ama rozeti ve duyuru listesini görmek için sabitlemek
   gerekir.

### Kaynak koddan

1. Bu depoyu indirin: Sağ üstteki **Code › Download ZIP**'e basın, sonra dosyayı kalıcı bir klasöre çıkarın. Chrome
   eklentiyi bu klasörden çalıştırır, klasör silinirse eklenti durur.
2. Chrome'da adres çubuğuna `chrome://extensions` yazıp Enter'a basın.
3. Sağ üstteki **Geliştirici modu** anahtarını açın.
4. **Paketlenmemiş öğe yükle**'ye basıp çıkardığınız klasörü seçin. Windows zip'i iç içe iki klasöre çıkardıysa içinde
   `manifest.json` dosyası olan içteki klasörü seçin.

## Öne çıkanlar

- **Duyuru kapatma:** Giriş sayfasında ve ana sayfada açılan duyuru pencerelerini kendiliğinden kapatır, **Tekrar
  Gösterme** dediğiniz hâlde yeniden çıkanlar da dâhil.
- **Rozet ve ses:** Kapattığı her duyuruyu simgedeki kırmızı rozette sayar, isterseniz kısa bir sesle bildirir.
- **Duyuru listesi:** Simgeye tıklayınca kapatılan son 20 duyurunun metni ve saati listelenir.
- **Hızlı giriş:** Giriş sayfasında **Adalet E-imza ile Giriş** düğmesine kendisi tıklar ve imleci **Pin Kodu** alanına
  getirir. Sayfa açılır açılmaz Pin yazmaya hazır olursunuz.
- **Menü gizleme:** İsterseniz portalın sol menüsünü her sayfada kendiliğinden daraltır.
- **Ayrı anahtarlar:** Her özellik ayrı ayrı, eklentinin tamamı da tek anahtarla açılıp kapatılabilir.

## Ne yapar

### Duyuru kapatma

Eklenti giriş sayfasında ve ana sayfada açılan duyuru pencerelerini, penceredeki kırmızı **Kapat** düğmesine kendisi
basarak kapatır. **Tekrar Gösterme** dediğiniz hâlde yeniden çıkan duyurular da kapatılır. Kapatılan her duyuru
simgedeki kırmızı rozette sayılır, metni ve saati eklenti penceresindeki listeye eklenir.

**Bildirim Sesi** açıksa duyuru kapatıldığında kısa bir ses çalar. Ses, eklentinin kendi arka plan sayfasından çalınır:
UYAP sekmesi arkada olsa da, başka bir sekmedeyken de duyulur. Aynı duyuru defalarca çıkıyorsa **Duyuru Bildirim
Sesi Sıklığı** ile sesin her kapatmada mı, yoksa 2, 5 ya da 10 kapatmada bir mi çalacağı seçilir. Varsayılan 5'tir.
Sayım bütün Chrome pencereleri kapanınca sıfırlanır.

> **Dikkat:** Duyurular UYAP'ın size ulaşma yoludur. Rozeti ve sesi fark edip simgeye tıklamayacaksanız ya da duyurular
> sizin için önemliyse **Duyuru Kapatma**'yı kapalı tutun. Hızlı Giriş tek başına da çalışır.

### Hızlı giriş

Giriş sayfasında **Adalet E-imza ile Giriş** düğmesine kendisi tıklar ve imleci **Pin Kodu** alanına getirir. Sayfa
açılır açılmaz Pin yazmaya hazır olursunuz. Pin kodunu siz yazarsınız.

### Menü gizleme

İsterseniz portalın sol menüsünü her sayfada kendiliğinden daraltır. Bu özellik kapalı başlar, eklenti penceresinden
açılır.

### Eklenti penceresi

Araç çubuğundaki simgeye tıklayınca açılır. Sağ üstteki büyük anahtar eklentinin tamamını kapatır. Kapalıyken simge gri
görünür.

| Anahtar | Ne yapar |
| --- | --- |
| **Hızlı Giriş** | Adalet E-imza girişine tıklar, Pin alanına odaklanır |
| **Duyuru Kapatma** | Açılan duyuru pencerelerini otomatik kapatır |
| **Bildirim Sesi** | Duyuru kapatıldığında kısa bir ses çalar (Duyuru Kapatma'nın altındadır) |
| **Duyuru Bildirim Sesi Sıklığı** | Aynı duyuru için her kapatmada, 2, 5 ya da 10 kapatmada bir ses çalar. Varsayılan 5 |
| **Menü Gizleme** | Sol menüyü tüm sayfalarda otomatik daraltır ya da kapatır |

İlk kurulumda Hızlı Giriş, Duyuru Kapatma ve Bildirim Sesi açık, Menü Gizleme kapalı başlar.

Altta **Son Kapatılan Duyurular** listesi durur: En yeni üstte, başında kapatıldığı saat. Pencereyi açmak rozetteki
sayıyı sıfırlar, liste durur.

En alt satırda solda sürüm numarası, ortada **güneş / ay** düğmesi, sağda geliştirici bağlantısı vardır. Pencere koyu
temayla açılır. Güneşe basınca açık temaya geçer, ay ile geri döner. Seçim saklanır.

Üç özelliğin hepsini kapatırsanız büyük anahtar da kapanır. Büyük anahtarı yeniden açmak Hızlı Giriş ile Duyuru
Kapatma'yı açar. Menü Gizleme kapalı kalır, isterseniz ayrıca açarsınız. Değişiklikler sayfayı yenilemeden anında
uygulanır.

### Bilinen sınırlar

- Duyuru kapatma yalnızca giriş sayfasında ve ana sayfada (`avukat.uyap.gov.tr/`) çalışır. Portalın iç sayfalarında
  açılan pencerelere dokunmaz.
- Eklenti sayfada **Kapat** ve **Adalet E-imza** yazılarını arar. Portal bu adları değiştirirse yeni sürüm gerekir.
- Hızlı Giriş, Pin alanına siz yazmaya başladıktan sonra imleci bir daha zorlamaz.

## Güncelleme

Mağazadan kurduysanız Chrome yeni sürümü kendisi yükler. Kaynak koddan kurduysanız yeni dosyaları aynı klasöre alıp
`chrome://extensions` sayfasında eklentinin kartındaki **yenile** okuna basın.

## Veri gizliliği

Eklenti hiçbir veri toplamaz, telemetri içermez, internete hiçbir istek yapmaz, hiçbir sunucuyla konuşmaz.

- Eklentinin istediği izinler: `storage` (ayarlar), `offscreen` (ses) ve yalnızca `avukat.uyap.gov.tr` sayfalarında
  çalışma. Başka hiçbir siteye erişimi yoktur.
- Ayarlar (anahtarların durumu, ses sıklığı, tema) Chrome'un eklenti deposunda, bilgisayarınızda durur. Eklenti
  kaldırılınca ayarlar da silinir.
- Kapatılan duyuru metinleri, saatleri, rozet sayacı ve sesin sayımı yalnızca oturum belleğinde tutulur. Diske
  yazılmaz, bütün Chrome pencerelerini kapattığınızda silinir.
- Eklentinin kendi pencereleri bir güvenlik kuralıyla kilitlidir: Dışarıdan resim, stil ya da betik yükleyemez.

## Üçüncü taraf bileşenler

Eklenti hiçbir üçüncü taraf pakete ya da harici kütüphaneye bağlı değildir. Kaynak kodun tamamı, simgeler dâhil, bu
depodadır. İsteyen inceleyip değiştirebilir.

## Otomatik denetimler

[![CodeQL Advanced](https://github.com/SCgrS/UYAP-Hizli-Giris-ve-Duyuru-Kapatma/actions/workflows/codeql.yml/badge.svg?branch=main)](https://github.com/SCgrS/UYAP-Hizli-Giris-ve-Duyuru-Kapatma/actions/workflows/codeql.yml)\
[![Dependency Review](https://github.com/SCgrS/UYAP-Hizli-Giris-ve-Duyuru-Kapatma/actions/workflows/dependency-review.yml/badge.svg?branch=main)](https://github.com/SCgrS/UYAP-Hizli-Giris-ve-Duyuru-Kapatma/actions/workflows/dependency-review.yml)

---

Soru ve geri bildirimler için: [x.com/CgrShn](https://x.com/CgrShn)

Lisans: AGPL-3.0. Ayrıntılar için [LICENSE](LICENSE) dosyasına bakınız.
