// utils/storage.js
import { supabase } from './supabaseClient';

// Helper to reliably ping the current cached session inside non-component utility functions
const getUserId = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user?.id || null;
};

export const getFavorites = async () => {
    const userId = await getUserId();
    if (!userId) {
        console.warn('Cannot fetch favorites - user not logged in.');
        return [];
    }

    try {
        const { data, error } = await supabase
            .from('user_favorites')
            .select('recipe')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Extrapolate the recipe JSON object back out
        return data ? data.map(row => row.recipe) : [];
    } catch (error) {
        console.error('Error fetching favorites from Supabase', error);
        return [];
    }
};

export const checkIsFavorite = async (recipeId) => {
    const userId = await getUserId();
    if (!userId) return false;

    try {
        const { data, error } = await supabase
            .from('user_favorites')
            .select('id')
            .eq('user_id', userId)
            .eq('recipe_id', recipeId)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
        return !!data;
    } catch (error) {
        console.error('Error checking favorite status', error);
        return false;
    }
};

export const toggleFavorite = async (recipe, currentFavoriteState) => {
    const userId = await getUserId();
    const recipeId = recipe.idMeal;

    if (!userId) {
        // Not logged in. We can just return the old state.
        alert('Please log in to save recipes to your favorites!');
        return currentFavoriteState;
    }

    try {
        if (currentFavoriteState) {
            // Remove it
            const { error } = await supabase
                .from('user_favorites')
                .delete()
                .eq('user_id', userId)
                .eq('recipe_id', recipeId);

            if (error) throw error;
            return false; // Resulting state is NOT favorite
        } else {
            // Add it
            const { error } = await supabase
                .from('user_favorites')
                .insert([{
                    user_id: userId,
                    recipe_id: recipeId,
                    recipe: recipe
                }]);

            if (error) throw error;
            return true; // Resulting state IS favorite
        }
    } catch (error) {
        console.error('Error toggling favorite in Supabase', error);
        // Return the old state if it failed
        return currentFavoriteState;
    }
};
