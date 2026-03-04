import { useState, useEffect } from 'react';
import { getFavorites } from '../utils/storage';
import RecipeCard from '../components/RecipeCard';
import { HeartCrack, Loader2 } from 'lucide-react';

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        // Load favorites from Supabase on mount
        const fetchSaved = async () => {
            setLoading(true);
            const data = await getFavorites();
            if (isMounted) {
                setFavorites(data);
                setLoading(false);
            }
        };

        fetchSaved();

        return () => { isMounted = false; };
    }, []);

    if (loading) {
        return (
            <div className="container center-state full-height" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 72px)' }}>
                <Loader2 className="spinner" size={48} color="var(--accent-primary)" />
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '4rem 1.5rem', minHeight: 'calc(100vh - 72px)' }}>
            <div style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                <h1 style={{ fontSize: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className="text-gradient">Your</span> Favorites
                </h1>
                <p className="text-secondary" style={{ marginTop: '0.5rem' }}>
                    {favorites.length} saved {favorites.length === 1 ? 'recipe' : 'recipes'}
                </p>
            </div>

            {favorites.length === 0 ? (
                <div className="empty-state glass-panel" style={{ marginTop: '4rem' }}>
                    <div className="empty-icon-wrapper" style={{ background: 'rgba(255,153,102,0.1)' }}>
                        <HeartCrack size={48} style={{ color: 'var(--accent-secondary)' }} />
                    </div>
                    <h3>No favorites yet</h3>
                    <p className="text-secondary">
                        Go explore and save recipes you love. They will show up here!
                    </p>
                </div>
            ) : (
                <div className="grid-cards">
                    {favorites.map((recipe) => (
                        <RecipeCard key={recipe.idMeal} recipe={recipe} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Favorites;
