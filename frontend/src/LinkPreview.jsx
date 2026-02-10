import { useState } from 'react';
import './LinkPreview.css';

const LinkPreview = () => {
    const [url, setUrl] = useState('');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!url) return;

        setLoading(true);
        setError('');
        setData(null);

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            const response = await fetch(`${apiUrl}/api/preview/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url }),
            });


            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to fetch preview');
            }

            setData(result);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="link-preview-container">
            <h1 className="title">Link Classifier</h1>
            <form onSubmit={handleSubmit} className="search-form">
                <input
                    type="url"
                    placeholder="Paste a link here..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="search-input"
                    required
                />
                <button type="submit" className="search-button" disabled={loading}>
                    {loading ? 'Analyzing...' : 'Preview'}
                </button>
            </form>

            {error && <div className="error-message">{error}</div>}

            {data && (
                <div className="preview-card">
                    {data.image && (
                        <div className="preview-image-container">
                            <img src={data.image} alt="Link Preview" className="preview-image" />
                        </div>
                    )}
                    <div className="preview-content">
                        <h3 className="preview-title">{data.title || 'No Title'}</h3>
                        <p className="preview-description">{data.description || 'No description available.'}</p>
                        <span className="preview-domain">{new URL(url).hostname}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LinkPreview;
