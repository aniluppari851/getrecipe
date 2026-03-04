import { useState } from 'react';
import { Search } from 'lucide-react';
import './SearchBar.css';

const SearchBar = ({ onSearch, initialValue = '' }) => {
    const [query, setQuery] = useState(initialValue);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query.trim());
        }
    };

    return (
        <form className="search-bar-container" onSubmit={handleSubmit}>
            <div className="search-input-wrapper glass-panel">
                <Search className="search-icon" size={20} />
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search for a recipe (e.g., Pasta)..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit" className="search-button">
                    Search
                </button>
            </div>
        </form>
    );
};

export default SearchBar;
