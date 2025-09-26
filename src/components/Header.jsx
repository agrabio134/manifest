import React from 'react';

const Header = () => {
  return (
    <header className="header" id="home">
      <div className="video-background">
  <iframe 
    src="https://www.youtube.com/embed/FQf2J-1dGjo?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playlist=FQf2J-1dGjo"
    frameBorder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
  ></iframe>
</div>   
      <div className="logo-container">
        <img 
          src="/logo.png" 
          alt="MANIFEST Logo" 
          className="header-logo"
          style={{
            width: '120px',
            height: '120px',
            marginBottom: '20px',
            borderRadius: '50%',
            boxShadow: '0 0 30px rgba(255, 215, 0, 0.5)',
            animation: 'logoGlow 2s ease-in-out infinite alternate',
            objectFit: 'cover',
            zIndex: 999
          }}
        />
      </div>
      <h1 >Manifest Power, Elevate your Life</h1>
      <p>The Power of Manifest Elevates Life</p>
      <a href="https://app.nexa.xyz/trade/0xc466c28d87b3d5cd34f3d5c088751532d71a38d93a8aae4551dd56272cfb4355::manifest::MANIFEST" target="_blank" rel="noopener noreferrer" className="join-btn">
        Join the Movement
      </a>
      
      <style jsx>{`
        @keyframes logoGlow {
          from {
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
            transform: scale(1);
          }
          to {
            box-shadow: 0 0 40px rgba(255, 215, 0, 0.8);
            transform: scale(1.05);
          }
        }
          
        
        .logo-container {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 10px;
        }
        
        .header-logo:hover {
          transform: scale(1.1) !important;
          transition: transform 0.3s ease;
        }
      `}</style>
    </header>
  );
};

export default Header;