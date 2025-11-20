export default function Button({ children, variant = 'primary', className = '', ...props }) {
    const baseStyle = {
        padding: '0.75rem 1.5rem',
        borderRadius: '4px',
        fontWeight: 'bold',
        fontSize: '1rem',
        transition: 'opacity 0.2s',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    const variants = {
        primary: {
            backgroundColor: 'var(--primary-red)',
            color: 'var(--white)',
        },
        secondary: {
            backgroundColor: 'var(--black)',
            color: 'var(--white)',
        },
        outline: {
            backgroundColor: 'transparent',
            border: '2px solid var(--black)',
            color: 'var(--black)',
        },
        ghost: {
            backgroundColor: 'transparent',
            color: 'var(--black)',
            padding: '0.5rem',
        }
    };

    return (
        <button
            style={{ ...baseStyle, ...variants[variant] }}
            className={className}
            {...props}
        >
            {children}
        </button>
    );
}
