const Home = () => {
  const stats = [
    { label: 'Toplam Test', value: '156', icon: '📋' },
    { label: 'Aktif Kullanıcı', value: '50', icon: '👥' },
    { label: 'Toplam Makale', value: '20', icon: '📚' },
  ];

  const recentActivities = [
    { type: 'test', text: 'Yeni karbon ayak izi testi eklendi', time: '2 saat önce' },
    { type: 'user', text: 'Yeni kullanıcı kaydı: Ahmet Yılmaz', time: '4 saat önce' },
    { type: 'article', text: 'Yeni makale yayınlandı: Sürdürülebilir Yaşam', time: '6 saat önce' },
  ];

  return (
    <div>
      {}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {stats.map((stat, index) => (
          <div
            key={index}
            style={{
              backgroundColor: '#F3F7F3',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}
          >
            <span style={{ fontSize: '2rem' }}>{stat.icon}</span>
            <div>
              <p style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#2D3B2D',
                marginBottom: '0.25rem'
              }}>
                {stat.value}
              </p>
              <p style={{ color: '#4B5563', fontSize: '0.875rem' }}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activities */}
      <div>
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          color: '#2D3B2D',
          marginBottom: '1rem'
        }}>
          Son Aktiviteler
        </h3>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {recentActivities.map((activity, index) => (
            <div
              key={index}
              style={{
                padding: '1rem',
                backgroundColor: '#F3F7F3',
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.25rem' }}>
                  {activity.type === 'test' ? '📋' : activity.type === 'user' ? '👤' : '📚'}
                </span>
                <p style={{ color: '#4B5563' }}>{activity.text}</p>
              </div>
              <span style={{ color: '#6B7280', fontSize: '0.875rem' }}>{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home; 