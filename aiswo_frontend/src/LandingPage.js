import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: '📊',
      title: 'Real-time Monitoring',
      description: 'Live tracking of bin fill levels and weight with instant alerts',
      color: 'rgba(52, 199, 89, 0.1)'
    },
    {
      icon: '🌤️',
      title: 'Weather Integration',
      description: 'Smart alerts based on weather conditions and forecasts',
      color: 'rgba(0, 122, 255, 0.1)'
    },
    {
      icon: '🤖',
      title: 'AI Assistant',
      description: 'Environmental chatbot for guidance and waste management tips',
      color: 'rgba(255, 149, 0, 0.1)'
    }
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #34C759 50%, #52D765 75%, #D4F4DD 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-lg)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Enhanced Background Elements */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
        animation: 'float 20s ease-in-out infinite'
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '-30%',
        right: '-30%',
        width: '60%',
        height: '60%',
        background: 'radial-gradient(circle, rgba(52, 199, 89, 0.1) 0%, transparent 70%)',
        animation: 'float 15s ease-in-out infinite reverse'
      }} />

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: '4px',
            height: '4px',
            background: 'rgba(255,255,255,0.3)',
            borderRadius: '50%',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `particleFloat ${5 + Math.random() * 10}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`
          }}
        />
      ))}

      {/* Main Content */}
      <div className={`fade-in-up ${isVisible ? 'visible' : ''}`} style={{
        textAlign: 'center',
        zIndex: 10,
        maxWidth: '900px',
        margin: '0 auto',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 1s ease-out'
      }}>
        {/* Enhanced Logo with Animation */}
        <div style={{
          fontSize: 'var(--font-size-4xl)',
          marginBottom: 'var(--space-lg)',
          animation: 'logoPulse 3s ease-in-out infinite',
          filter: 'drop-shadow(0 0 20px rgba(52, 199, 89, 0.5))'
        }}>
          ♻️
        </div>

        {/* Main Heading with Gradient Text */}
        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #ffffff 0%, #e8f8ec 50%, #34C759 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 'var(--space-lg)',
          textShadow: '0 4px 20px rgba(0,0,0,0.3)',
          lineHeight: '1.1',
          letterSpacing: '-0.02em'
        }}>
          AISWO Smart Bin
        </h1>

        {/* Enhanced Subtitle */}
        <p style={{
          fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
          color: 'rgba(255,255,255,0.95)',
          marginBottom: 'var(--space-2xl)',
          lineHeight: '1.6',
          textShadow: '0 2px 10px rgba(0,0,0,0.2)',
          fontWeight: '300',
          maxWidth: '600px',
          margin: '0 auto var(--space-2xl) auto'
        }}>
          Revolutionizing waste management with intelligent monitoring, 
          weather alerts, and environmental consciousness powered by AI
        </p>

        {/* Enhanced Features Section */}
        <div style={{
          marginBottom: 'var(--space-2xl)',
          position: 'relative'
        }}>
          {/* Feature Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'var(--space-lg)',
            marginBottom: 'var(--space-lg)'
          }}>
            {features.map((feature, index) => (
              <div
                key={index}
                style={{
                  background: `linear-gradient(145deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)`,
                  backdropFilter: 'blur(20px)',
                  borderRadius: 'var(--radius-xl)',
                  padding: 'var(--space-xl)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  transform: currentFeature === index ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: currentFeature === index 
                    ? '0 20px 40px rgba(0,0,0,0.3)' 
                    : '0 8px 32px rgba(0,0,0,0.2)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.05) translateY(-8px)';
                  e.target.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = currentFeature === index ? 'scale(1.05)' : 'scale(1)';
                  e.target.style.boxShadow = currentFeature === index 
                    ? '0 20px 40px rgba(0,0,0,0.3)' 
                    : '0 8px 32px rgba(0,0,0,0.2)';
                }}
              >
                {/* Background Glow Effect */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: feature.color,
                  borderRadius: 'var(--radius-xl)',
                  opacity: currentFeature === index ? 0.3 : 0.1,
                  transition: 'opacity 0.3s ease'
                }} />
                
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <div style={{ 
                    fontSize: 'var(--font-size-3xl)', 
                    marginBottom: 'var(--space-md)',
                    filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.3))'
                  }}>
                    {feature.icon}
                  </div>
                  <h3 style={{ 
                    color: 'var(--white)', 
                    marginBottom: 'var(--space-sm)',
                    fontSize: 'var(--font-size-xl)',
                    fontWeight: '600'
                  }}>
                    {feature.title}
                  </h3>
                  <p style={{ 
                    color: 'rgba(255,255,255,0.9)', 
                    fontSize: 'var(--font-size-base)',
                    lineHeight: '1.5'
                  }}>
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Feature Indicators */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 'var(--space-sm)',
            marginTop: 'var(--space-lg)'
          }}>
            {features.map((_, index) => (
              <div
                key={index}
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: currentFeature === index 
                    ? 'var(--white)' 
                    : 'rgba(255,255,255,0.3)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onClick={() => setCurrentFeature(index)}
              />
            ))}
          </div>
        </div>

        {/* Enhanced CTA Buttons */}
        <div style={{
          display: 'flex',
          gap: 'var(--space-lg)',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: 'var(--space-2xl)'
        }}>
          <Link 
            to="/dashboard" 
            className="btn btn-primary"
            style={{
              padding: 'var(--space-lg) var(--space-2xl)',
              fontSize: 'var(--font-size-lg)',
              fontWeight: '700',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-sm)',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              color: 'var(--primary-green)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
              transform: 'translateY(0)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              border: '1px solid rgba(255,255,255,0.3)',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-6px) scale(1.02)';
              e.target.style.boxShadow = '0 20px 60px rgba(0,0,0,0.35)';
              e.target.style.background = 'linear-gradient(135deg, #ffffff 0%, #e8f8ec 100%)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = '0 12px 40px rgba(0,0,0,0.25)';
              e.target.style.background = 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)';
            }}
          >
            <span style={{ fontSize: 'var(--font-size-lg)' }}>🚀</span>
            Get Started
            <span style={{ fontSize: 'var(--font-size-lg)', transition: 'transform 0.3s ease' }}>→</span>
          </Link>

          <Link 
            to="/weather" 
            className="btn btn-secondary"
            style={{
              padding: 'var(--space-lg) var(--space-2xl)',
              fontSize: 'var(--font-size-lg)',
              fontWeight: '700',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-sm)',
              background: 'rgba(255,255,255,0.1)',
              color: 'var(--white)',
              border: '2px solid rgba(255,255,255,0.3)',
              borderRadius: 'var(--radius-xl)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
              transform: 'translateY(0)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.2)';
              e.target.style.borderColor = 'rgba(255,255,255,0.5)';
              e.target.style.transform = 'translateY(-6px) scale(1.02)';
              e.target.style.boxShadow = '0 20px 60px rgba(0,0,0,0.35)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.1)';
              e.target.style.borderColor = 'rgba(255,255,255,0.3)';
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = '0 12px 40px rgba(0,0,0,0.25)';
            }}
          >
            <span style={{ fontSize: 'var(--font-size-lg)' }}>🌤️</span>
            Weather Forecast
            <span style={{ fontSize: 'var(--font-size-lg)', transition: 'transform 0.3s ease' }}>→</span>
          </Link>
        </div>

        {/* Enhanced Stats Section */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 'var(--space-2xl)',
          flexWrap: 'wrap',
          marginTop: 'var(--space-2xl)'
        }}>
          {[
            { number: '100+', label: 'Smart Bins', icon: '🗑️' },
            { number: '24/7', label: 'Monitoring', icon: '⏰' },
            { number: '99%', label: 'Efficiency', icon: '📈' },
            { number: 'AI', label: 'Powered', icon: '🤖' }
          ].map((stat, index) => (
            <div 
              key={index}
              style={{ 
                textAlign: 'center',
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(20px)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-lg)',
                border: '1px solid rgba(255,255,255,0.2)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                minWidth: '120px'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-8px) scale(1.05)';
                e.target.style.background = 'rgba(255,255,255,0.15)';
                e.target.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.background = 'rgba(255,255,255,0.1)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <div style={{ 
                fontSize: 'var(--font-size-2xl)', 
                marginBottom: 'var(--space-sm)',
                filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.3))'
              }}>
                {stat.icon}
              </div>
              <div style={{ 
                fontSize: 'var(--font-size-3xl)', 
                fontWeight: '800', 
                color: 'var(--white)',
                textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                marginBottom: 'var(--space-xs)'
              }}>
                {stat.number}
              </div>
              <div style={{ 
                color: 'rgba(255,255,255,0.9)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: '500'
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes logoPulse {
          0%, 100% { 
            transform: scale(1);
            filter: drop-shadow(0 0 20px rgba(52, 199, 89, 0.5));
          }
          50% { 
            transform: scale(1.1);
            filter: drop-shadow(0 0 30px rgba(52, 199, 89, 0.8));
          }
        }
        
        @keyframes particleFloat {
          0% { 
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% { 
            opacity: 1;
          }
          90% { 
            opacity: 1;
          }
          100% { 
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }
        
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInRight {
          0% {
            opacity: 0;
            transform: translateX(50px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .fade-in-up {
          animation: fadeInUp 1s ease-out;
        }
        
        .slide-in-right {
          animation: slideInRight 0.8s ease-out 0.3s both;
        }
        
        .visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        
        /* Enhanced hover effects */
        .btn:hover span:last-child {
          transform: translateX(4px);
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .fade-in-up {
            max-width: 95%;
          }
        }
      `}</style>
    </div>
  );
}

export default LandingPage;
