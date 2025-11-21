export default function Button({ children, variant = 'primary', className = '', style = {}, ...props }) {
    const baseStyle = {
        padding: '0.875rem 2rem',
        borderRadius: '8px',
        fontWeight: '600',
        fontSize: '1rem',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        border: 'none',
        position: 'relative',
        overflow: 'hidden',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    };

    const variants = {
        primary: {
            background: 'linear-gradient(135deg, #E31837 0%, #C91530 100%)',
            color: 'var(--white)',
            boxShadow: '0 4px 12px rgba(227, 24, 55, 0.3)',
        },
        secondary: {
            backgroundColor: 'var(--black)',
            color: 'var(--white)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        },
        outline: {
            backgroundColor: 'transparent',
            border: '2px solid var(--black)',
            color: 'var(--black)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        },
        ghost: {
            backgroundColor: 'transparent',
            color: 'var(--black)',
            padding: '0.5rem',
        }
    };

    // Generate unique class name for this variant
    const buttonClass = `btn-${variant} ${className}`;

    return (
        <>
            <style jsx>{`
                .btn-primary:hover {
                    background: linear-gradient(135deg, #E31837 0%, #B91429 100%) !important;
                    box-shadow: 0 8px 20px rgba(227, 24, 55, 0.4), 0 2px 8px rgba(0, 0, 0, 0.1) !important;
                    transform: translateY(-2px);
                }
                
                .btn-secondary:hover {
                    background-color: #1a1a1a !important;
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3) !important;
                    transform: translateY(-2px);
                }
                
                .btn-outline:hover {
                    background-color: var(--black) !important;
                    color: var(--white) !important;
                    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15) !important;
                    transform: translateY(-2px);
                }
                
                .btn-ghost:hover {
                    opacity: 0.7;
                }
            `}</style>
            <button
                style={{ ...baseStyle, ...variants[variant], ...style }}
                className={buttonClass}
                {...props}
            >
                {children}
            </button>
        </>
    );
}
