import { useState } from 'react';
import Button from './Button';
import Input from './Input';

export default function CommentSection({ initialComments = [] }) {
    const [comments, setComments] = useState(initialComments);
    const [newComment, setNewComment] = useState('');
    const [rating, setRating] = useState(5);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        const comment = {
            id: Date.now(),
            user: "Guest User",
            text: newComment,
            rating: rating,
            date: new Date().toLocaleDateString()
        };

        setComments([comment, ...comments]);
        setNewComment('');
        setRating(5);
    };

    return (
        <div style={{ marginTop: '3rem', borderTop: '1px solid var(--gray-200)', paddingTop: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                Reviews & Comments ({comments.length})
            </h3>

            {/* Add Comment Form */}
            <form onSubmit={handleSubmit} style={{ marginBottom: '3rem', backgroundColor: 'var(--gray-100)', padding: '1.5rem', borderRadius: '8px' }}>
                <h4 style={{ marginBottom: '1rem', fontWeight: 'bold' }}>Write a Review</h4>

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Rating</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                style={{
                                    fontSize: '1.5rem',
                                    color: star <= rating ? '#FFD700' : 'var(--gray-300)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Your Review</label>
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={4}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid var(--gray-300)',
                            borderRadius: '4px',
                            fontSize: '1rem',
                            fontFamily: 'inherit',
                            resize: 'vertical'
                        }}
                        placeholder="Share your experience with this product..."
                    />
                </div>

                <Button type="submit">Post Review</Button>
            </form>

            {/* Comments List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {comments.map((comment) => (
                    <div key={comment.id} style={{ borderBottom: '1px solid var(--gray-200)', paddingBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ fontWeight: 'bold' }}>{comment.user}</span>
                            <span style={{ color: 'var(--gray-800)', fontSize: '0.875rem' }}>{comment.date}</span>
                        </div>
                        <div style={{ display: 'flex', marginBottom: '0.5rem' }}>
                            {[...Array(5)].map((_, i) => (
                                <span key={i} style={{ color: i < comment.rating ? '#FFD700' : 'var(--gray-300)' }}>★</span>
                            ))}
                        </div>
                        <p style={{ lineHeight: '1.5' }}>{comment.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
