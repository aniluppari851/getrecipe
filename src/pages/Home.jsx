import { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import RecipeCard from '../components/RecipeCard';
import { ChefHat, Loader2 } from 'lucide-react';
import './Home.css';

const Home = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);

    // Default fetch on load (e.g., initial popular search or random)
    useEffect(() => {
        handleSearch('chicken'); // Give them something to look at immediately
    }, []);

    const handleSearch = async (query) => {
        if (!query) return;

        setLoading(true);
        setError(null);
        setHasSearched(true);

        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
            if (!response.ok) throw new Error('Failed to fetch recipes');

            const data = await response.json();
            setRecipes(data.meals || []);
        } catch (err) {
            setError(err.message || 'An error occurred while fetching recipes.');
            setRecipes([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="container hero-content">
                    <h1 className="hero-title">
                        Find the perfect <br />
                        <span className="text-gradient">Recipe</span> for today
                    </h1>
                    <p className="hero-subtitle">
                        Search from thousands of free, delicious recipes instantly.
                    </p>
                    <div className="hero-search">
                        <SearchBar onSearch={handleSearch} />
                    </div>
                </div>
            </section>

            {/* Results Section */}
            <section className="results-section container">
                {loading && (
                    <div className="loading-state">
                        <Loader2 className="spinner" size={48} />
                        <p>Cooking up results...</p>
                    </div>
                )}

                {error && (
                    <div className="error-state glass-panel">
                        <p className="error-text">⚠️ {error}</p>
                    </div>
                )}

                {!loading && !error && recipes.length > 0 && (
                    <>
                        <div className="results-header">
                            <h2 className="results-title">Delicious Discoveries</h2>
                            <span className="results-count">{recipes.length} recipes found</span>
                        </div>

                        <div className="grid-cards">
                            {recipes.map((recipe) => (
                                <RecipeCard key={recipe.idMeal} recipe={recipe} />
                            ))}
                        </div>
                    </>
                )}

                {!loading && !error && hasSearched && recipes.length === 0 && (
                    <div className="empty-state glass-panel">
                        <div className="empty-icon-wrapper">
                            <ChefHat size={48} className="empty-icon text-gradient" />
                        </div>
                        <h3>No recipes found</h3>
                        <p className="text-secondary">Try searching for something else like "beef", "pasta", or "salad".</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
