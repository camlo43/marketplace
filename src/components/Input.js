export default function Input({ label, error, ...props }) {
    return (
        <div style={{ marginBottom: '1rem', width: '100%' }}>
            {label && (
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--gray-800)' }}>
                    {label}
                </label>
            )}
            <input
                style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: error ? '1px solid var(--primary-red)' : '1px solid var(--gray-300)',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    outline: 'none',
                }}
                {...props}
            />
            {error && (
                <span style={{ color: 'var(--primary-red)', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>
                    {error}
                </span>
            )}
        </div>
    );
}
