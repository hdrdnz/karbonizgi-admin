const ComingSoon = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #E8F5E9 0%, #A5D6A7 100%)',
    borderRadius: '1rem',
    boxShadow: '0 2px 8px rgba(44, 62, 80, 0.07)',
    padding: '3rem 1rem',
  }}>
    <div style={{
      background: '#F3F7F3',
      borderRadius: '50%',
      width: '260px',
      height: '260px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '2rem',
      boxShadow: '0 2px 8px rgba(44, 62, 80, 0.07)',
      overflow: 'hidden',
    }}>
      <img
        src="/carbon-footprint-earth.png"
        alt="Karbon Ayak İzi Dünya"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>
    <h1 style={{
      color: '#2D3B2D',
      fontSize: '2.5rem',
      fontWeight: 700,
      marginBottom: '1rem',
      letterSpacing: '0.02em',
      textAlign: 'center',
    }}>
      Yakında!
    </h1>
    <p style={{
      color: '#3E513E',
      fontSize: '1.25rem',
      maxWidth: '500px',
      textAlign: 'center',
      marginBottom: '2rem',
    }}>
      
    </p>
  </div>
);

export default ComingSoon; 