import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { checkIsFavorite, toggleFavorite } from '../utils/storage';
import { Heart, Loader2, PlaySquare, ArrowLeft, Layers, Info } from 'lucide-react';
import './RecipeDetail.css';

const RecipeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [favorite, setFavorite] = useState(false);
    const [savingFav, setSavingFav] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const fetchRecipeAndStatus = async () => {
            setLoading(true);
            try {
                // 1. Fetch recipe from MealDB
                const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
                if (!response.ok) throw new Error('Network error');

                const data = await response.json();
                if (data.meals && data.meals.length > 0) {
                    const currentRecipe = data.meals[0];

                    if (isMounted) setRecipe(currentRecipe);

                    // 2. Fetch favorite status from Supabase
                    const isFav = await checkIsFavorite(currentRecipe.idMeal);
                    if (isMounted) setFavorite(isFav);

                } else {
                    if (isMounted) setError('Recipe not found');
                }
            } catch (err) {
                if (isMounted) setError('Failed to load recipe details.');
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchRecipeAndStatus();

        return () => { isMounted = false; };
    }, [id]);

    const handleToggleFavorite = async () => {
        if (recipe && !savingFav) {
            setSavingFav(true);
            // Wait for Supabase to resolve the insertion/deletion
            const isNowFav = await toggleFavorite(recipe, favorite);
            setFavorite(isNowFav);
            setSavingFav(false);
        }
    };

    if (loading) {
        return (
            <div className="container center-state full-height">
                <Loader2 className="spinner" size={48} />
            </div>
        );
    }

    if (error || !recipe) {
        return (
            <div className="container center-state full-height">
                <div className="error-state glass-panel">
                    <h2>Oops!</h2>
                    <p>{error}</p>
                    <button onClick={() => navigate('/')} className="btn-primary mt-4">
                        GO BACK HOME
                    </button>
                </div>
            </div>
        );
    }

    // Extract ingredients natively assuming up to 20 provided by MealDB
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = recipe[`strIngredient${i}`];
        const measure = recipe[`strMeasure${i}`];
        if (ingredient && ingredient.trim() !== '') {
            ingredients.push({ ingredient, measure });
        }
    }

    return (
        <div className="recipe-detail-wrapper">
            <div className="recipe-detail-hero">
                <div className="hero-img-overlay"></div>
                <img
                    src={recipe.strMealThumb}
                    alt={recipe.strMeal}
                    className="hero-img"
                />
                <div className="container hero-content-overlay">
                    <button className="back-btn" onClick={() => navigate(-1)}>
                        <ArrowLeft size={20} /> Back
                    </button>
                    <div className="hero-titles">
                        <span className="recipe-badge">{recipe.strCategory}</span>
                        <h1 className="title-huge">{recipe.strMeal}</h1>
                        <p className="subtitle">{recipe.strArea} Cuisine</p>
                    </div>
                </div>
            </div>

            <div className="container recipe-detail-content">
                <div className="content-sidebar">
                    <div className="glass-panel sidebar-card interactive-card">
                        <div className="action-row">
                            <button
                                className={`favorite-btn ${favorite ? 'active' : ''}`}
                                onClick={handleToggleFavorite}
                                disabled={savingFav}
                                style={{ opacity: savingFav ? 0.6 : 1, cursor: savingFav ? 'wait' : 'pointer' }}
                            >
                                {savingFav ? (
                                    <Loader2 size={24} className="spinner" style={{ margin: 0 }} />
                                ) : (
                                    <Heart size={24} fill={favorite ? 'currentColor' : 'none'} className={favorite ? 'heart-beat' : ''} />
                                )}
                                <span>{favorite ? 'Saved to Favorites' : 'Save to Favorites'}</span>
                            </button>
                        </div>

                        {recipe.strTags && (
                            <div className="tags-container mt-4">
                                {recipe.strTags.split(',').map((tag) => (
                                    <span key={tag} className="tag">{tag}</span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="glass-panel sidebar-card mt-4">
                        <h3 className="section-title"><Layers size={20} /> Ingredients</h3>
                        <ul className="ingredients-list">
                            {ingredients.map((item, index) => (
                                <li key={index} className="ingredient-item">
                                    <span className="ingredient-name">{item.ingredient}</span>
                                    <span className="ingredient-measure">{item.measure}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="content-main">
                    <div className="glass-panel main-card">
                        <h3 className="section-title"><Info size={20} /> Instructions</h3>
                        <div className="instructions-body">
                            {recipe.strInstructions.split('\n').filter(p => p.trim() !== '').map((para, index) => (
                                <p key={index}>{para}</p>
                            ))}
                        </div>

                        {recipe.strYoutube && (
                            <div className="video-section mt-6">
                                <a
                                    href={recipe.strYoutube}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-video"
                                >
                                    <PlaySquare size={20} /> Watch on YouTube
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipeDetail;
