

const Privacy = () => {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '2rem', color: '#2D3B2D' }}>
      Gizlilik Politikası
      </h1>
      <div style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#3E513E' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>
          1. Toplanan Veriler
        </h2>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
          Zorunlu Kayıt Verileri:
        </h3>
        <ul style={{ listStyleType: 'disc', marginLeft: '2rem', marginBottom: '1rem' }}>
          <li>E‑posta adresi</li>
          <li>Kullanıcı adı</li>
          <li>Şifre (şifrelenmiş olarak saklanır)</li>
        </ul>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
          Performans Verileri:
        </h3>
        <ul style={{ listStyleType: 'disc', marginLeft: '2rem', marginBottom: '1rem' }}>
          <li>Karbon ayak izi skoru</li>
          <li>Skorun hesaplandığı tarih</li>
          <li>Kullanıcının yaptığı test sonuçları</li>
          <li>Kullanıcının oluşturduğu aksiyonlar ve notlar</li>
        </ul>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
          Geçici Veriler:
        </h3>
        <ul style={{ listStyleType: 'disc', marginLeft: '2rem', marginBottom: '1rem' }}>
          <li>Sohbet geçmişi (en fazla 5 dakika süreyle geçici olarak saklanır – Redis)</li>
          <li>Sertifika veya PDF oluşturma işlemlerine ilişkin geçici bilgiler</li>
        </ul>

        <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>
          2. Verilerin Kullanım Amaçları
        </h2>
        <ul style={{ listStyleType: 'disc', marginLeft: '2rem', marginBottom: '1rem' }}>
          <li>Kullanıcı hesabı oluşturma ve kimlik doğrulama</li>
          <li>Karbon ayak izi testlerinin hesaplanması ve takip edilmesi</li>
          <li>Kullanıcının oluşturduğu aksiyonların listelenmesi</li>
          <li>Sohbet tabanlı öneri sisteminin çalıştırılması (OpenAI API üzerinden)</li>
          <li>Kullanıcıya özel PDF raporları ve sertifikaların oluşturulması</li>
        </ul>

        <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>
          3. Veri Paylaşımı ve İşleme
        </h2>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
          OpenAI API:
        </h3>
        <p style={{ marginBottom: '1rem' }}>
          Sohbet oturumu sırasında kullanıcı girdileri OpenAI sunucularına gönderilir. Sohbet kayıtları uygulama veritabanında saklanmaz, sadece Redis içinde maksimum 5 dakika tutulur ve sonra otomatik olarak silinir.
        </p>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
          Üçüncü Taraf Servisler:
        </h3>
        <p style={{ marginBottom: '1rem' }}>
          Performans ve hata takibi için anonimleştirilmiş veriler (örn. Sentry) kullanılabilir.
        </p>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
          Reklam ve Pazarlama:
        </h3>
        <p style={{ marginBottom: '1rem' }}>
          Veriler reklam veya pazarlama amacıyla hiçbir üçüncü tarafla paylaşılmaz.
        </p>

        <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>
          4. Veri Güvenliği
        </h2>
        <ul style={{ listStyleType: 'disc', marginLeft: '2rem', marginBottom: '1rem' }}>
          <li>HTTPS ile veri iletimi</li>
          <li>Şifrelenmiş şifreler (bcrypt veya benzeri)</li>
          <li>Veritabanı yedekleri AES‑256 ile şifrelenir</li>
          <li>Rol tabanlı erişim kontrolü</li>
        </ul>

        <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>
          5. Saklama Süresi ve Silme
        </h2>
        <p style={{ marginBottom: '1rem' }}>
          Hesap silindiğinde tüm kişisel ve performans verileri 30 gün içinde kalıcı olarak silinir. Kullanıcı dilerse, gizlilik@karbonizgi.com adresine başvurarak verilerinin silinmesini talep edebilir.
        </p>

        <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>
          6. Kullanıcı Hakları (KVKK / GDPR)
        </h2>
        <ul style={{ listStyleType: 'disc', marginLeft: '2rem', marginBottom: '1rem' }}>
          <li>Verilere erişim hakkı</li>
          <li>Düzeltme hakkı</li>
          <li>Silinme hakkı</li>
          <li>İşlemeye itiraz hakkı</li>
          <li>Veri taşınabilirliği hakkı</li>
        </ul>

        <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>
          7. Çocukların Gizliliği
        </h2>
        <p style={{ marginBottom: '1rem' }}>
          13 yaş altındaki kullanıcılardan bilerek veri toplanmaz. Böyle bir durum tespit edilirse, veri derhal silinir.
        </p>

        <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>
          8. Politikadaki Değişiklikler
        </h2>
        <p style={{ marginBottom: '1rem' }}>
          Gizlilik politikası güncellemeleri bu sayfadan duyurulur. Önemli değişiklikler kayıtlı e‑posta adresine bildirilir.
        </p>

        <p style={{ marginTop: '2rem', fontStyle: 'italic' }}>
          Son güncelleme: 06 Mayıs 2025
        </p>
      </div>
    </div>
  );
};

export default Privacy; 