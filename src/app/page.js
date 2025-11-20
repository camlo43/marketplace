'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert(`Gracias por suscribirte: ${email}`);
    setEmail('');
  };

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        height: '90vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        color: 'white',
        textAlign: 'center'
      }}>
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            minWidth: '100%',
            minHeight: '100%',
            width: 'auto',
            height: 'auto',
            transform: 'translate(-50%, -50%)',
            zIndex: 0,
            objectFit: 'cover',
            filter: 'brightness(0.6)'
          }}
        >
          <source src="/videos/Ferrari SF-25 REVEALED! First Look at Ferraris 2025 F1 Car.mp4" type="video/mp4" />
        </video>

        {/* Content */}
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <h1 style={{
            fontSize: '5rem',
            fontWeight: '900',
            marginBottom: '1rem',
            textTransform: 'uppercase',
            letterSpacing: '-2px',
            lineHeight: '0.9'
          }}>
            TUNEALO
          </h1>
          <p style={{
            fontSize: '1.5rem',
            fontWeight: '300',
            marginBottom: '3rem',
            maxWidth: '600px',
            margin: '0 auto 3rem',
            letterSpacing: '1px'
          }}>
            TU VEHÍCULO A TU MANERA. <br />
            <span style={{ color: 'var(--primary-red)', fontWeight: 'bold' }}>PARTES PREMIUM</span> PARA AUTOS EXCLUSIVOS.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/marketplace" className="btn btn-primary" style={{
              padding: '1rem 3rem',
              fontSize: '1.2rem',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Explorar Catálogo
            </Link>
            <Link href="/marketplace?category=ofertas" className="btn btn-outline" style={{
              padding: '1rem 3rem',
              fontSize: '1.2rem',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              borderColor: 'white',
              color: 'white'
            }}>
              Ver Ofertas
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--white)' }}>
        <div className="container">
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            textAlign: 'center',
            marginBottom: '4rem',
            textTransform: 'uppercase',
            letterSpacing: '-1px',
            color: 'var(--black)'
          }}>
            Categorías <span style={{ color: 'var(--primary-red)' }}>Destacadas</span>
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            {[
              { name: 'MOTOR Y TRANSMISIÓN', icon: '⚙️', count: '3,200+', category: 'Motor' },
              { name: 'RUEDAS Y LLANTAS', icon: '🛞', count: '2,450+', category: 'Llantas' },
              { name: 'SISTEMA DE FRENOS', icon: '🔧', count: '1,890+', category: 'Frenos' },
              { name: 'LUCES Y ELÉCTRICO', icon: '💡', count: '1,650+', category: 'Iluminación' },
              { name: 'SUSPENSIÓN', icon: '🔩', count: '980+', category: 'Suspensión' },
              { name: 'CARROCERÍA', icon: '🚗', count: '1,200+', category: 'Exterior' },
            ].map((cat, i) => (
              <Link href={`/marketplace?category=${encodeURIComponent(cat.category)}`} key={i} style={{ textDecoration: 'none' }}>
                <div className="category-card" style={{
                  position: 'relative',
                  padding: '3rem 2rem',
                  textAlign: 'center',
                  height: '300px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--gray-50)',
                  borderRadius: '12px',
                  border: '1px solid var(--gray-200)',
                  overflow: 'hidden',
                  transition: 'all 0.4s ease'
                }}>
                  {/* Hover Overlay Effect */}
                  <div className="hover-overlay" style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(to top, var(--gray-100) 0%, transparent 100%)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    zIndex: 1
                  }} />

                  <div style={{ position: 'relative', zIndex: 2 }}>
                    <div style={{
                      fontSize: '4rem',
                      marginBottom: '1.5rem',
                      filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
                    }}>{cat.icon}</div>
                    <h3 style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      marginBottom: '0.5rem',
                      color: 'var(--black)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}>{cat.name}</h3>
                    <p style={{ color: 'var(--gray-600)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{cat.count} productos</p>

                    <span style={{
                      display: 'inline-block',
                      padding: '0.5rem 1.5rem',
                      border: '1px solid var(--gray-300)',
                      borderRadius: '50px',
                      color: 'var(--black)',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      backgroundColor: 'white'
                    }}>
                      Ver Catálogo
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Add CSS for hover effect directly here for simplicity in this context, or better in globals.css */}
          <style jsx global>{`
            .category-card:hover {
              transform: translateY(-10px);
              border-color: var(--primary-red);
              box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
            }
            .category-card:hover .hover-overlay {
              opacity: 1;
            }
          `}</style>
        </div>
      </section>

      {/* Premium Banner */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--gray-50)', color: 'var(--black)' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4rem',
            alignItems: 'center'
          }}>
            <div>
              <span style={{ color: 'var(--primary-red)', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.9rem' }}>
                Calidad Garantizada
              </span>
              <h2 style={{
                fontSize: '3.5rem',
                fontWeight: '900',
                margin: '1rem 0 2rem',
                lineHeight: '1.1',
                color: 'var(--black)'
              }}>
                SOLO LAS MEJORES <br /> MARCAS DEL MUNDO.
              </h2>
              <p style={{ color: 'var(--gray-600)', fontSize: '1.1rem', marginBottom: '3rem', lineHeight: '1.6' }}>
                Trabajamos directamente con los fabricantes más prestigiosos para asegurarnos de que cada pieza que compras cumpla con los estándares más altos de calidad y rendimiento. Tu vehículo merece lo mejor.
              </p>
              <div style={{ display: 'flex', gap: '3rem' }}>
                <div>
                  <h4 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--black)' }}>50K+</h4>
                  <p style={{ color: 'var(--gray-500)' }}>Productos en Stock</p>
                </div>
                <div>
                  <h4 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--black)' }}>15K+</h4>
                  <p style={{ color: 'var(--gray-500)' }}>Clientes Satisfechos</p>
                </div>
                <div>
                  <h4 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--black)' }}>24/7</h4>
                  <p style={{ color: 'var(--gray-500)' }}>Soporte Técnico</p>
                </div>
              </div>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img
                src="/brands-banner.png"
                alt="Marcas Premium"
                style={{
                  width: '100%',
                  maxWidth: '600px',
                  height: 'auto',
                  borderRadius: '12px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--primary-red)', color: 'white', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
            Tunea tu vehículo a tu manera
          </h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '3rem', opacity: '0.9' }}>
            Recibe ofertas exclusivas, nuevos productos y consejos para mantener tu vehículo en perfecto estado.
          </p>
          <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '1rem', maxWidth: '500px', margin: '0 auto' }}>
            <input
              type="email"
              placeholder="Tu correo electrónico..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                flex: 1,
                padding: '1rem',
                borderRadius: '4px',
                border: 'none',
                outline: 'none',
                fontSize: '1rem'
              }}
              required
            />
            <button type="submit" style={{
              backgroundColor: 'var(--black)',
              color: 'white',
              padding: '1rem 2rem',
              border: 'none',
              borderRadius: '4px',
              fontWeight: 'bold',
              cursor: 'pointer',
              textTransform: 'uppercase'
            }}>
              Suscribirse
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
