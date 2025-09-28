import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #34C759 0%, #52D765 50%, #D4F4DD 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-lg)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Elements */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
        animation: 'float 20s ease-in-out infinite'
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '-30%',
        right: '-30%',
        width: '60%',
        height: '60%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
        animation: 'float 15s ease-in-out infinite reverse'
      }} />

      {/* Main Content */}
      <div style={{
        textAlign: 'center',
        zIndex: 10,
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* Logo */}
        <div style={{
          fontSize: 'var(--font-size-4xl)',
          marginBottom: 'var(--space-lg)',
          animation: 'bounce 2s ease-in-out infinite'
        }}>
          ♻️
        </div>

        {/* Main Heading */}
        <h1 style={{
          fontSize: 'var(--font-size-4xl)',
          fontWeight: '700',
          color: 'var(--white)',
          marginBottom: 'var(--space-lg)',
          textShadow: '0 4px 20px rgba(0,0,0,0.3)',
          lineHeight: '1.2'
        }}>
          Smart Bin Monitoring
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: 'var(--font-size-xl)',
          color: 'rgba(255,255,255,0.9)',
          marginBottom: 'var(--space-2xl)',
          lineHeight: '1.6',
          textShadow: '0 2px 10px rgba(0,0,0,0.2)'
        }}>
          Revolutionizing waste management with intelligent monitoring, 
          weather alerts, and environmental consciousness
        </p>

        {/* Features Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-lg)',
          marginBottom: 'var(--space-2xl)'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-lg)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <div style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--space-sm)' }}>📊</div>
            <h3 style={{ color: 'var(--white)', marginBottom: 'var(--space-sm)' }}>Real-time Monitoring</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 'var(--font-size-sm)' }}>
              Live tracking of bin fill levels and weight
            </p>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-lg)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <div style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--space-sm)' }}>🌤️</div>
            <h3 style={{ color: 'var(--white)', marginBottom: 'var(--space-sm)' }}>Weather Integration</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 'var(--font-size-sm)' }}>
              Smart alerts based on weather conditions
            </p>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-lg)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <div style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--space-sm)' }}>🤖</div>
            <h3 style={{ color: 'var(--white)', marginBottom: 'var(--space-sm)' }}>AI Assistant</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 'var(--font-size-sm)' }}>
              Environmental chatbot for guidance
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div style={{
          display: 'flex',
          gap: 'var(--space-lg)',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <Link 
            to="/dashboard" 
            className="btn btn-primary"
            style={{
              padding: 'var(--space-lg) var(--space-2xl)',
              fontSize: 'var(--font-size-lg)',
              fontWeight: '600',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-sm)',
              background: 'var(--white)',
              color: 'var(--primary-green)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              transform: 'translateY(0)',
              transition: 'all var(--transition-normal)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-4px)';
              e.target.style.boxShadow = '0 12px 40px rgba(0,0,0,0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)';
            }}
          >
            Get Started
            <span style={{ fontSize: 'var(--font-size-lg)' }}>→</span>
          </Link>

          <Link 
            to="/weather" 
            className="btn btn-secondary"
            style={{
              padding: 'var(--space-lg) var(--space-2xl)',
              fontSize: 'var(--font-size-lg)',
              fontWeight: '600',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-sm)',
              background: 'transparent',
              color: 'var(--white)',
              border: '2px solid var(--white)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              transform: 'translateY(0)',
              transition: 'all var(--transition-normal)'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'var(--white)';
              e.target.style.color = 'var(--primary-green)';
              e.target.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = 'var(--white)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Weather Forecast
            <span style={{ fontSize: 'var(--font-size-lg)' }}>🌤️</span>
          </Link>
        </div>

        {/* Stats */}
        <div style={{
          marginTop: 'var(--space-2xl)',
          display: 'flex',
          justifyContent: 'center',
          gap: 'var(--space-2xl)',
          flexWrap: 'wrap'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: 'var(--font-size-3xl)', 
              fontWeight: '700', 
              color: 'var(--white)',
              textShadow: '0 2px 10px rgba(0,0,0,0.3)'
            }}>
              100+
            </div>
            <div style={{ color: 'rgba(255,255,255,0.8)' }}>Smart Bins</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: 'var(--font-size-3xl)', 
              fontWeight: '700', 
              color: 'var(--white)',
              textShadow: '0 2px 10px rgba(0,0,0,0.3)'
            }}>
              24/7
            </div>
            <div style={{ color: 'rgba(255,255,255,0.8)' }}>Monitoring</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: 'var(--font-size-3xl)', 
              fontWeight: '700', 
              color: 'var(--white)',
              textShadow: '0 2px 10px rgba(0,0,0,0.3)'
            }}>
              99%
            </div>
            <div style={{ color: 'rgba(255,255,255,0.8)' }}>Efficiency</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
}

export default LandingPage;
