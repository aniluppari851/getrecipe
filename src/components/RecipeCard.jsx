import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import './RecipeCard.css';

const RecipeCard = ({ recipe }) => {
    if (!recipe) return null;

    return (
        <div className="recipe-card glass-panel">
            <div className="recipe-img-wrapper">
                <img
                    src={recipe.strMealThumb}
                    alt={recipe.strMeal}
                    className="recipe-img"
                    loading="lazy"
                />
                <div className="recipe-category-badge">
                    {recipe.strCategory}
                </div>
            </div>

            <div className="recipe-content">
                <h3 className="recipe-title">{recipe.strMeal}</h3>

                <div className="recipe-meta">
                    <span className="recipe-area">
                        <BookOpen size={14} className="meta-icon" />
                        {recipe.strArea || 'Global'} Cuisine
                    </span>
                </div>

                <Link to={`/recipe/${recipe.idMeal}`} className="recipe-action">
                    View Details <ArrowRight size={16} className="action-icon" />
                </Link>
            </div>
        </div>
    );
};

export default RecipeCard;
