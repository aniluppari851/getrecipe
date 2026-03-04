# TryRecipe - Comprehensive Project Documentation

TryRecipe is a modern, responsive, and aesthetically premium React application built with Vite. Its primary purpose is to allow users to search for recipes, view detailed instructions and ingredients, and save their favorite recipes to a personal collection using Supabase for backend authentication and storage.

This document serves as an exhaustive technical deep-dive into the architecture, every single file, component, styling decision, and data flow within the application.

---

## 🏗 System Architecture & Tech Stack

### Core Technologies
- **React 18 & Vite**: The foundation of the application. Vite provides an ultra-fast development server and optimized production builds. React 18 is used for component-based UI construction using modern Hooks (`useState`, `useEffect`, `useContext`).
- **React Router v6 (`react-router-dom`)**: Handles all client-side navigation, URL parameter passing, and route protection, enabling a Single Page Application (SPA) experience without page reloads.
- **Supabase (`@supabase/supabase-js`)**: Serves as the Backend-as-a-Service (BaaS). It provides secure user authentication (Email/Password) and a PostgreSQL database to store user favorites persistently across devices.
- **TheMealDB API**: A free, open JSON API used as the primary data source for querying recipe data, images, categories, and instructions.
- **Lucide React (`lucide-react`)**: A library of clean, customizable SVG icons used throughout the UI for visual enhancement.
- **Vanilla CSS (Custom Properties & Flexbox/Grid)**: Defines the entire aesthetic system. No external CSS frameworks (like Tailwind or Bootstrap) are used. The design relies entirely on a custom CSS variable system for colors, spacing, and typography to maintain full control over the "premium dark mode" aesthetic.

---

## 📂 Exhaustive File & Directory Breakdown

### 1. Root Configuration Files

#### `package.json` & `package-lock.json`
Standard Node.js package definition files. They list project dependencies (React, React Router, Supabase JS, Lucide) and define project scripts (`npm run dev` for local server, `npm run build` for production compilation).

#### `vite.config.js`
The configuration file for the Vite bundler. It uses `@vitejs/plugin-react` to enable React Fast Refresh and JSX compilation during development.

#### `index.html`
The main HTML template served to the browser. It contains the `<div id="root"></div>` mount point where the React application attaches itself. It also imports the global font family (Outfit) from Google Fonts.

#### `eslint.config.js`
Specifies linting rules to enforce code quality and stylistic consistency across JavaScript/JSX files.

---

### 2. The `src/` Directory (Source Code)

This is the heart of the application.

#### `src/main.jsx`
The absolute entry point of the React application. 
- **Purpose**: It targets `document.getElementById('root')` and renders the application tree.
- **Wrappers**: It wraps the main `<App />` component in two crucial providers:
  - `<React.StrictMode>`: Helps identify potential problems in the application during development.
  - `<AuthProvider>`: The custom context provider that injects the Supabase user session globally into the component tree.

#### `src/App.jsx`
The primary layout and routing controller.
- **Purpose**: Defines the structure of the app (Navbar resting above the main content area) and maps URL paths to specific Page components using React Router.
- **Routes**:
  - `/` -> `<Home />` (Public)
  - `/recipe/:id` -> `<RecipeDetail />` (Public)
  - `/login` -> `<Login />` (Public Guest Route)
  - `/signup` -> `<Signup />` (Public Guest Route)
  - `/favorites` -> `<ProtectedRoute><Favorites /></ProtectedRoute>` (Requires Authentication)
- **`ProtectedRoute` Component**: A lightweight wrapper defined directly in `App.jsx`. It consumes the `useAuth` hook. If the app is still checking the session (`loading`), it returns `null`. If the check finishes and there is no `user`, it explicitly intercepts the render and fires `<Navigate to="/login" replace />`, forcing the user out of protected territory.

#### `src/index.css` & `src/App.css`
- **`index.css`**: The global CSS file establishing the root CSS variables (CSS Custom Properties). It defines base colors (`--bg-primary`, `--text-primary`, `--accent-primary`), typographic scales, easing functions, and generic resets (`box-sizing`, `margin: 0`). It establishes the dark-mode-first aesthetic visually.
- **`App.css`**: Contains layout specifics for the root application shell, ensuring the `main` content area flexes to fill available screen height minus the Navbar, and establishes container max-widths.

---

### 3. The `src/context/` Directory (Global State)

#### `src/context/AuthContext.jsx`
Manages the user authentication lifecycle globally.
- **Mechanism**: Uses `createContext()` and `useContext()`.
- **Initialization**: On initial mount, it fires `supabase.auth.getSession()` to see if a valid JWT token exists in the browser's local storage (managed internally by the Supabase SDK).
- **Event Listener**: It subscribes to `supabase.auth.onAuthStateChange`. If a user logs in, signs out, or their token expires, this listener automatically catches the event, updates the `session` and `user` state variables, and triggers a re-render of all dependent components app-wide.
- **Exported Hook**: Exposes `useAuth()`, allowing any component deeply nested in the tree to instantly access `{ user, session, loading }`.

---

### 4. The `src/utils/` Directory (Services & Helpers)

#### `src/utils/supabaseClient.js`
The singleton connection to the database.
- **Purpose**: Imports `createClient` from `@supabase/supabase-js`.
- **Configuration**: Hardcodes the specific `supabaseUrl` and `supabaseKey` (Anon Key) for the project `nysnycskfzjayafolrjw`.
- **Export**: Exports the initialized `supabase` object, used by all other files requiring database access or authentication.

#### `src/utils/storage.js`
An abstraction layer specifically built to handle database row manipulation for favorite recipes. It decouples the React components from writing raw SQL/Supabase commands.
- **`getUserId()`**: A silent helper that securely asks Supabase for the ID of the currently authenticated token payload.
- **`getFavorites()`**: Executes a `SELECT recipe FROM user_favorites WHERE user_id = current_user`. Returns an array of mapped JSON objects to render the Favorites grid.
- **`checkIsFavorite(recipeId)`**: Fast query that executes `SELECT id FROM user_favorites WHERE user_id = current_user AND recipe_id = specific_id`. Returns true/false. This determines if the "Heart" icon should be filled in when loading a recipe detail page.
- **`toggleFavorite(recipe, currentState)`**: Depending on the `currentState`, it either executes an `INSERT INTO user_favorites (user_id, recipe_id, recipe)` or a `DELETE FROM user_favorites`. It handles catching errors and returns the new expected state of the heart icon.

---

### 5. The `src/components/` Directory (Reusable UI Bits)

#### `src/components/Navbar.jsx` & `Navbar.css`
The persistent top navigation bar.
- **Logic**: Consumes `useAuth()`. If `user` is null, it renders Explore and Log In. If `user` is present, it renders Explore, Saved, and a Log Out button.
- **Actions**: The "Log Out" button explicitly calls `supabase.auth.signOut()` and forcefully redirects the user back to the Home page (`/`).
- **Styling**: Uses glassmorphism (translucency + backdrop blur) to float elegantly over scrolling content.

#### `src/components/SearchBar.jsx`
The primary input for finding recipes.
- **Logic**: Manages internal `useState` for the string input. When the `onSubmit` event fires (user hits Enter or clicks the search icon button), it prevents the default form POST action and calls the `onSearch(query)` prop passed down from the parent `Home.jsx` page.

#### `src/components/RecipeCard.jsx` & `RecipeCard.css`
The visual block representing a single recipe in list/grid views.
- **Props**: Accepts a generic `recipe` JSON object (expected format matching TheMealDB output).
- **Structure**: Renders the image (`strMealThumb`), category tag (`strCategory`), and the title (`strMeal`).
- **Interaction**: Wraps the image and title in a `react-router-dom` `<Link>` that points to `/recipe/${recipe.idMeal}`.
- **Styling (`RecipeCard.css`)**: Contains complex CSS to handle hover states (the image slightly zooming in, the card casting a colored drop shadow) and image aspect ratio enforcement.

---

### 6. The `src/pages/` Directory (Full Views)

#### `src/pages/Home.jsx`
The default landing page (`/`).
- **State**: Manages `recipes` (array), `loading` (boolean), `error` (string/null), and `searched` (boolean flag to track if the initial state has changed).
- **Effects**: Utilizes `useEffect` to trigger a default search for "chicken" when the component first mounts.
- **Functions**: `handleSearch(query)` fires a native `fetch()` against `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`. It handles network failures natively and maps the resulting data to the `recipes` array.
- **Render**: If loading, shows a spinner. If empty results, shows a "No recipes found" fallback. Otherwise, maps over `recipes` outputting `<RecipeCard>` components in a CSS Grid layout.

#### `src/pages/RecipeDetail.jsx` & `RecipeDetail.css`
The complex individual recipe view (`/recipe/:id`).
- **Route Params**: Extracts the URL ID using `useParams()`.
- **Hybrid Data Fetching (`useEffect`)**:
  1. It fetches the holistic layout data from TheMealDB `lookup.php?i=${id}`.
  2. Concurrently, it awaits `checkIsFavorite(id)` from `storage.js` to see if the authorized user has this recipe saved.
- **Data Transformation**: TheMealDB unfortunately stores ingredients across 20 distinct keys (`strIngredient1`, `strIngredient2`, etc.). This component executes a `for` loop from 1 to 20, plucking out non-empty ingredient strings and their matching measurement strings, packing them into an array of objects `[{ingredient, measure}]` for clean rendering in lists.
- **Interactivity**: The "Save to Favorites" button triggers `handleToggleFavorite()`. It enters a `savingFav` loading state, executes `storage.toggleFavorite`, updates the heart icon state, and removes the loading spinner.
- **Layout (`RecipeDetail.css`)**: Implements a massive image "hero" section. The content below splits into a sidebar (for Ingredients and tags) and a main column (for paragraph instructions and the YouTube link) using CSS Grid.

#### `src/pages/Favorites.jsx`
The protected gallery of saved dishes (`/favorites`).
- **Fetch Logic**: On mount, calls `getFavorites()` from `storage.js` to grab the user's specific array of saved JSON recipe objects from Supabase.
- **Render**: If zero recipes are loaded, shows a friendly "Empty State" message. If recipes exist, it re-uses the exact same CSS Grid layout and `<RecipeCard />` components as the `Home.jsx` page for visual consistency.

#### `src/pages/Login.jsx` & `src/pages/Signup.jsx` (and `Auth.css`)
The authentication gateways. Both share heavily overlapping logic and structural anatomy.
- **State**: Manage controlled inputs for `email` and `password`. They handle granular `loading`, `error`, and `success` string states.
- **Interaction (`handleLogin` / `handleSignup`)**: Prevent default form submission. They pass the email and password directly to `supabase.auth.signInWithPassword()` or `supabase.auth.signUp()`.
- **Routing**: If successful, `Login.jsx` forcefully redirects to `/` via `navigate('/')`. `Signup.jsx` handles Supabase's strict email confirmation flows (if the session mounts immediately, it redirects; otherwise, it clears the form and shows a "Check your email" success message).
- **Styling (`Auth.css`)**: Provides the dedicated CSS for the form layouts—encompassing floating icon inputs, focus-ring animations, strict button layouts, and clear error/success color blocks.

---

## 🔁 Detailed Data & Network Overviews

**1. The Application State Topology**
- **Session/Token State**: Held in highest authority by Supabase internally. Broadcasted to React via `AuthContext`.
- **View Navigation State**: Handled explicitly by the URL browser bar and interpreted safely by React Router.
- **Search Data State**: Ephemeral; lives entirely inside the memory of `Home.jsx`. Navigating away destroys this memory.
- **Specific Recipe Detail State**: Ephemeral; fetched dynamically based on the URL parameter explicitly on mount of `RecipeDetail.jsx`.
- **Favorites Relationship State**: Highly persistent. The source of truth lives in the `user_favorites` PostgreSQL table in Supabase. The React client explicitly queries this table on mount to ascertain "Favorite" status.

**2. Database Security & Structure**
The core `user_favorites` table structure in Supabase:
- `id`: unique UUID for the row itself.
- `user_id`: unique UUID mapping directly to `auth.users` inherently linked to the specific authenticated account.
- `recipe_id`: Text representation from TheMealDB.
- `recipe`: Full JSONB blob capturing the recipe at the exact moment of saving (trading raw normalization for extreme speed, preventing us from pinging TheMealDB again).

**Row Level Security (RLS)** is enabled on the database. RLS policies explicitly state:
- Selects: `using ( auth.uid() = user_id )`
- Inserts: `with check ( auth.uid() = user_id )`
- Deletes: `using ( auth.uid() = user_id )`
This mathematically ensures that regardless of the frontend logic, the API endpoint mathematically prevents User A from seeing or destroying User B's saved favorites.

---

## 🎨 Design Philosophy summary

TryRecipe was conceived to escape the boilerplate "clean and sterile" interface paradigm. It intentionally leverages dense, rich blacks mixed with stark white typography and vivid, warm gradient overlays (salmon `#ff5e62` to orange `#ff9966`). Heavy emphasis is placed on "Glassmorphism" (using translucent background rgba blocks combined with `backdrop-filter: blur(12px)`) to provide visual depth layers, specifically in the Navbar and side-by-side recipe instruction layouts. Hover and transition micro-interactions (`transition: all 0.3s ease`) are injected on every clickable element to verify high reactivity for end users.
