import { useState, useEffect } from 'react';
import { Film, Star, Heart, Clock, TrendingUp, Search, Menu, LogOut, User, Moon, Sun, X, Sparkles } from 'lucide-react';

// Types
interface Movie {
    id: number;
    title: string;
    poster: string;
    rating: number;
    year: number;
    genre: string;
}

// Sample movies data
const trendingMovies = [
    {
        id: 1,
        title: 'Inception',
        poster: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop',
        rating: 8.8,
        year: 2010,
        genre: 'Sci-Fi'
    },
    {
        id: 2,
        title: 'The Shawshank Redemption',
        poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop',
        rating: 9.3,
        year: 1994,
        genre: 'Drama'
    },
    {
        id: 3,
        title: 'Interstellar',
        poster: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=600&fit=crop',
        rating: 8.6,
        year: 2014,
        genre: 'Sci-Fi'
    },
    {
        id: 4,
        title: 'The Dark Knight',
        poster: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop',
        rating: 9.0,
        year: 2008,
        genre: 'Action'
    },
    {
        id: 5,
        title: 'Pulp Fiction',
        poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop',
        rating: 8.9,
        year: 1994,
        genre: 'Crime'
    },
    {
        id: 6,
        title: 'Forrest Gump',
        poster: 'https://images.unsplash.com/photo-1574267432644-f2423dd4098c?w=400&h=600&fit=crop',
        rating: 8.8,
        year: 1994,
        genre: 'Drama'
    }
];

const App = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);
    const [chatMessage, setChatMessage] = useState('');
    const [favorites, setFavorites] = useState<number[]>([]);
    const [recommendations, setRecommendations] = useState<Movie[]>([]);

    useEffect(() => {
        const isDark = localStorage.getItem('darkMode') === 'true';
        setDarkMode(isDark);

        // Simulate AI recommendations
        setRecommendations(trendingMovies.slice(0, 4));
    }, []);

    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem('darkMode', newMode.toString());
    };

    const toggleFavorite = (movieId: number) => {
        setFavorites(prev =>
            prev.includes(movieId)
                ? prev.filter(id => id !== movieId)
                : [...prev, movieId]
        );
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        alert('Déconnexion réussie');
    };

    const handleSendMessage = () => {
        if (chatMessage.trim()) {
            alert(`Question envoyée au chatbot IA: "${chatMessage}"`);
            setChatMessage('');
        }
    };

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
            {/* Navigation */}
            <nav className={`sticky top-0 z-50 ${darkMode ? 'bg-gray-800 border-b border-gray-700' : 'bg-white border-b border-gray-200'} shadow-sm`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <Film className="w-8 h-8 text-purple-600" />
                            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                CinéSense
                            </span>
                        </div>

                        {/* Search Bar - Desktop */}
                        <div className="hidden md:flex flex-1 max-w-md mx-8">
                            <div className="relative w-full">
                                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                <input
                                    type="text"
                                    placeholder="Rechercher des films..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className={`w-full pl-10 pr-4 py-2 rounded-lg ${darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                        : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500'
                                        } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
                                />
                            </div>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center gap-4">
                            <button
                                onClick={toggleDarkMode}
                                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                            >
                                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>
                            <a href="/profile" className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                                <User className="w-5 h-5" />
                            </a>
                            <button
                                onClick={handleLogout}
                                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="md:hidden p-2 rounded-lg"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                    <div className={`md:hidden border-t ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
                        <div className="px-4 py-4 space-y-3">
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`w-full px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'
                                    } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
                            />
                            <button onClick={toggleDarkMode} className="w-full flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100">
                                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                                <span>{darkMode ? 'Mode Clair' : 'Mode Sombre'}</span>
                            </button>
                            <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100">
                                <LogOut className="w-5 h-5" />
                                <span>Déconnexion</span>
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Bienvenue sur CinéSense</h1>
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                        Découvrez vos prochains films préférés grâce à l'intelligence artificielle
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <Film className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Films vus</p>
                                <p className="text-2xl font-bold">24</p>
                            </div>
                        </div>
                    </div>

                    <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-pink-100 rounded-lg">
                                <Heart className="w-6 h-6 text-pink-600" />
                            </div>
                            <div>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Favoris</p>
                                <p className="text-2xl font-bold">{favorites.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <Clock className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>À voir</p>
                                <p className="text-2xl font-bold">12</p>
                            </div>
                        </div>
                    </div>

                    <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <Star className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Évaluations</p>
                                <p className="text-2xl font-bold">18</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Recommendations Section */}
                <section className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-6 h-6 text-purple-600" />
                            <h2 className="text-2xl font-bold">Recommandations IA pour vous</h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {recommendations.map((movie) => (
                            <div
                                key={movie.id}
                                className={`rounded-xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm hover:shadow-lg transition-all cursor-pointer group`}
                            >
                                <div className="relative">
                                    <img
                                        src={movie.poster}
                                        alt={movie.title}
                                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform"
                                    />
                                    <button
                                        onClick={() => toggleFavorite(movie.id)}
                                        className="absolute top-2 right-2 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition"
                                    >
                                        <Heart
                                            className={`w-5 h-5 ${favorites.includes(movie.id) ? 'fill-red-500 text-red-500' : 'text-white'
                                                }`}
                                        />
                                    </button>
                                    <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-md">
                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                        <span className="text-white text-sm font-semibold">{movie.rating}</span>
                                    </div>
                                </div>
                                <div className="p-3">
                                    <h3 className="font-semibold truncate">{movie.title}</h3>
                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {movie.year} • {movie.genre}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Trending Movies */}
                <section>
                    <div className="flex items-center gap-2 mb-6">
                        <TrendingUp className="w-6 h-6 text-orange-600" />
                        <h2 className="text-2xl font-bold">Films Tendances</h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {trendingMovies.map((movie) => (
                            <div
                                key={movie.id}
                                className={`rounded-xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm hover:shadow-lg transition-all cursor-pointer group`}
                            >
                                <div className="relative">
                                    <img
                                        src={movie.poster}
                                        alt={movie.title}
                                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                                    />
                                    <button
                                        onClick={() => toggleFavorite(movie.id)}
                                        className="absolute top-2 right-2 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition"
                                    >
                                        <Heart
                                            className={`w-4 h-4 ${favorites.includes(movie.id) ? 'fill-red-500 text-red-500' : 'text-white'
                                                }`}
                                        />
                                    </button>
                                </div>
                                <div className="p-2">
                                    <h3 className="font-semibold text-sm truncate">{movie.title}</h3>
                                    <div className="flex items-center gap-1 mt-1">
                                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                        <span className="text-xs">{movie.rating}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* Chatbot Button */}
            <button
                onClick={() => setChatOpen(!chatOpen)}
                className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all z-40"
            >
                <Sparkles className="w-6 h-6" />
            </button>

            {/* Chatbot Modal */}
            {chatOpen && (
                <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] z-50">
                    <div className={`rounded-2xl shadow-2xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 flex justify-between items-center">
                            <h3 className="text-white font-semibold flex items-center gap-2">
                                <Sparkles className="w-5 h-5" />
                                Chatbot Cinéma IA
                            </h3>
                            <button onClick={() => setChatOpen(false)} className="text-white hover:bg-white/20 p-1 rounded">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-4 h-64 overflow-y-auto">
                            <div className={`p-3 rounded-lg mb-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                <p className="text-sm">👋 Bonjour ! Je suis votre assistant cinéma IA. Posez-moi des questions comme :</p>
                                <ul className="text-sm mt-2 space-y-1 list-disc list-inside">
                                    <li>"Un film comme Inception ?"</li>
                                    <li>"Films d'horreur récents ?"</li>
                                    <li>"Comédies françaises à voir ?"</li>
                                </ul>
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={chatMessage}
                                    onChange={(e) => setChatMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Posez votre question..."
                                    className={`flex-1 px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'
                                        } border-0 focus:outline-none focus:ring-2 focus:ring-purple-500`}
                                />
                                <button
                                    onClick={handleSendMessage}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                                >
                                    Envoyer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;