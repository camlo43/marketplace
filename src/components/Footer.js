import Link from 'next/link';

export default function Footer() {
    return (
        <footer style={{ backgroundColor: 'var(--gray-50)', color: 'var(--black)', padding: '5rem 0 2rem', borderTop: '1px solid var(--gray-200)' }}>
            <div className="container">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '4rem',
                    marginBottom: '4rem'
                }}>
                    {/* Brand Column */}
                    <div>
                        <div style={{
                            fontSize: '2rem',
                            fontWeight: '900',
                            fontStyle: 'italic',
                            color: 'var(--primary-red)',
                            letterSpacing: '-1px',
                            textTransform: 'uppercase',
                            marginBottom: '1rem'
                        }}>
                            TUNEALO
                        </div>
                        <p style={{ color: 'var(--gray-600)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                            Tu vehículo a tu manera. La plataforma líder para encontrar partes premium y exclusivas para los amantes de los autos.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            {/* Social Icons Placeholders */}
                            {['IG', 'FB', 'TW', 'YT'].map(social => (
                                <div key={social} style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    backgroundColor: 'var(--white)',
                                    border: '1px solid var(--gray-300)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.8rem',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    color: 'var(--black)',
                                    transition: 'all 0.2s'
                                }}>
                                    {social}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Links Column 1 */}
                    <div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'var(--black)', textTransform: 'uppercase' }}>
                            Comprar
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {['Catálogo Completo', 'Ofertas Especiales', 'Nuevos Arrivos', 'Marcas Destacadas'].map(item => (
                                <li key={item} style={{ marginBottom: '0.8rem' }}>
                                    <Link href="/marketplace" style={{ color: 'var(--gray-600)', textDecoration: 'none', transition: 'color 0.2s' }}>
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Links Column 2 */}
                    <div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'var(--black)', textTransform: 'uppercase' }}>
                            Soporte
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {['Centro de Ayuda', 'Envíos y Devoluciones', 'Garantía', 'Contactar Soporte'].map(item => (
                                <li key={item} style={{ marginBottom: '0.8rem' }}>
                                    <Link href="#" style={{ color: 'var(--gray-600)', textDecoration: 'none', transition: 'color 0.2s' }}>
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter Column */}
                    <div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'var(--black)', textTransform: 'uppercase' }}>
                            Mantente al día
                        </h4>
                        <p style={{ color: 'var(--gray-600)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                            Suscríbete para recibir las últimas novedades y ofertas exclusivas.
                        </p>
                        <div style={{ display: 'flex' }}>
                            <input
                                type="email"
                                placeholder="Email"
                                style={{
                                    background: 'var(--white)',
                                    border: '1px solid var(--gray-300)',
                                    padding: '0.8rem',
                                    color: 'var(--black)',
                                    borderRadius: '4px 0 0 4px',
                                    width: '100%',
                                    outline: 'none'
                                }}
                            />
                            <button style={{
                                background: 'var(--primary-red)',
                                border: 'none',
                                color: 'white',
                                padding: '0 1rem',
                                borderRadius: '0 4px 4px 0',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}>
                                OK
                            </button>
                        </div>
                    </div>
                </div>

                <div style={{
                    borderTop: '1px solid var(--gray-200)',
                    paddingTop: '2rem',
                    textAlign: 'center',
                    fontSize: '0.85rem',
                    color: 'var(--gray-500)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem'
                }}>
                    <div>
                        &copy; {new Date().getFullYear()} TUNEALO. Todos los derechos reservados.
                    </div>
                    <div style={{ display: 'flex', gap: '2rem' }}>
                        <span>Privacidad</span>
                        <span>Términos</span>
                        <span>Cookies</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
