import { useState } from 'react';
import { Film, Brain, MessageSquare, TrendingUp, Star, Users, ArrowRight, Sparkles, Play, Check } from 'lucide-react';

interface HomeProps {
    onNavigateToLogin: () => void;
    onNavigateToSignup: () => void;
}

const Home = ({ onNavigateToLogin, onNavigateToSignup }: HomeProps) => {
    const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

    const features = [
        {
            icon: <Brain className="w-8 h-8 text-purple-600" />,
            title: "Recommandations IA",
            description: "Notre algorithme d'apprentissage automatique analyse vos préférences pour vous suggérer des films que vous allez adorer.",
            color: "from-purple-50 to-pink-50"
        },
        {
            icon: <MessageSquare className="w-8 h-8 text-blue-600" />,
            title: "Chatbot Intelligent",
            description: "Posez des questions en langage naturel : 'Un film comme Inception ?' et obtenez des suggestions instantanées.",
            color: "from-blue-50 to-cyan-50"
        },
        {
            icon: <TrendingUp className="w-8 h-8 text-green-600" />,
            title: "Analyse de Sentiment",
            description: "NLP avancé pour analyser les critiques, détecter les spoilers et résumer les avis en quelques phrases.",
            color: "from-green-50 to-emerald-50"
        },
        {
            icon: <Star className="w-8 h-8 text-orange-600" />,
            title: "Listes Personnalisées",
            description: "Créez et organisez vos listes de films : 'À voir', 'Favoris', 'Classiques à découvrir'.",
            color: "from-orange-50 to-red-50"
        },
        {
            icon: <Users className="w-8 h-8 text-indigo-600" />,
            title: "Communauté",
            description: "Partagez vos découvertes, suivez des cinéphiles et rejoignez des clubs thématiques.",
            color: "from-indigo-50 to-purple-50"
        },
        {
            icon: <Film className="w-8 h-8 text-pink-600" />,
            title: "Catalogue Complet",
            description: "Accédez à plus de 10 000 films avec l'API TMDb. Nouveautés, classiques, films d'auteur.",
            color: "from-pink-50 to-rose-50"
        }
    ];

    const stats = [
        { number: "10K+", label: "Films" },
        { number: "95%", label: "Précision IA" },
        { number: "1M+", label: "Utilisateurs" }
    ];

    const testimonials = [
        {
            text: "CinéSense a complètement changé ma façon de découvrir des films. Les recommandations sont incroyablement précises !",
            author: "Marie L.",
            role: "Cinéphile",
            avatar: "https://i.pravatar.cc/150?img=1"
        },
        {
            text: "Le chatbot est génial ! Je pose une question et j'obtiens exactement ce que je cherche. Plus de temps perdu à chercher.",
            author: "Thomas R.",
            role: "Amateur de séries",
            avatar: "https://i.pravatar.cc/150?img=3"
        },
        {
            text: "J'adore pouvoir créer mes listes et partager mes découvertes avec mes amis. L'interface est magnifique.",
            author: "Sophie M.",
            role: "Blogueuse cinéma",
            avatar: "https://i.pravatar.cc/150?img=5"
        }
    ];

    const socialLinks = [
        { name: 'Twitter', url: '#', icon: 'M' },
        { name: 'Facebook', url: '#', icon: 'F' },
        { name: 'Instagram', url: '#', icon: 'I' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Navigation */}
            <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md shadow-sm z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2">
                            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-lg">
                                <Film className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                CinéSense
                            </span>
                        </div>

                        <div className="hidden md:flex items-center gap-8">
                            <a href="#features" className="text-gray-700 hover:text-purple-600 transition font-medium">
                                Fonctionnalités
                            </a>
                            <a href="#how-it-works" className="text-gray-700 hover:text-purple-600 transition font-medium">
                                Comment ça marche
                            </a>
                            <a href="#testimonials" className="text-gray-700 hover:text-purple-600 transition font-medium">
                                Témoignages
                            </a>
                            <button
                                onClick={onNavigateToLogin}
                                className="px-4 py-2 text-purple-600 border-2 border-purple-600 rounded-lg hover:bg-purple-50 transition font-semibold"
                            >
                                Connexion
                            </button>
                            <button
                                onClick={onNavigateToSignup}
                                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition font-semibold"
                            >
                                Inscription
                            </button>
                        </div>

                        <div className="md:hidden">
                            <button
                                onClick={onNavigateToLogin}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold"
                            >
                                Connexion
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 relative overflow-hidden">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                    <div className="absolute top-40 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
                </div>

                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-6">
                                <Sparkles className="w-4 h-4 text-purple-600" />
                                <span className="text-sm font-semibold text-purple-600">Propulsé par l'IA</span>
                            </div>

                            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                                Découvrez vos prochains films{' '}
                                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    préférés avec l'IA
                                </span>
                            </h1>

                            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                                CinéSense utilise l'intelligence artificielle pour vous recommander des films
                                parfaitement adaptés à vos goûts. Fini les heures perdues à chercher quoi regarder.
                            </p>

                            <div className="flex flex-wrap gap-4 mb-8">
                                <button
                                    onClick={onNavigateToSignup}
                                    className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-2xl transition text-lg font-semibold flex items-center gap-2"
                                >
                                    Commencer gratuitement
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                                </button>
                                <button className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:shadow-lg transition text-lg font-semibold flex items-center gap-2">
                                    <Play className="w-5 h-5" />
                                    Voir la démo
                                </button>
                            </div>

                            <div className="grid grid-cols-3 gap-6">
                                {stats.map((stat, index) => (
                                    <div key={index} className="text-center">
                                        <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                            {stat.number}
                                        </div>
                                        <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition duration-500">
                                <img
                                    src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&h=800&fit=crop"
                                    alt="Movie"
                                    className="w-full h-[500px] object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                                <div className="absolute bottom-6 left-6 right-6">
                                    <div className="flex items-center gap-3 bg-white/20 backdrop-blur-md rounded-xl p-4">
                                        <Sparkles className="w-6 h-6 text-yellow-400" />
                                        <div>
                                            <div className="text-white font-semibold">Recommandé pour vous</div>
                                            <div className="text-white/80 text-sm">Basé sur vos préférences</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-xl p-4 animate-float">
                                <div className="flex items-center gap-2">
                                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                    <span className="font-bold">9.2/10</span>
                                </div>
                            </div>

                            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-xl p-4 animate-float animation-delay-2000">
                                <div className="flex items-center gap-2">
                                    <Users className="w-5 h-5 text-purple-600" />
                                    <span className="font-bold">1M+ utilisateurs</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 px-4 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Fonctionnalités Innovantes
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Une plateforme complète qui révolutionne votre expérience cinématographique
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                onMouseEnter={() => setHoveredFeature(index)}
                                onMouseLeave={() => setHoveredFeature(null)}
                                className={`relative bg-gradient-to-br ${feature.color} p-8 rounded-2xl hover:shadow-2xl transition duration-300 cursor-pointer transform hover:-translate-y-2`}
                            >
                                <div className={`bg-white w-16 h-16 rounded-full flex items-center justify-center mb-6 transform transition duration-300 ${hoveredFeature === index ? 'scale-110 rotate-6' : ''}`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-20 px-4 bg-gradient-to-b from-slate-50 to-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Comment ça marche ?
                        </h2>
                        <p className="text-xl text-gray-600">
                            Trois étapes simples pour découvrir vos prochains coups de cœur
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            { step: "1", title: "Créez votre profil", desc: "Inscrivez-vous gratuitement et indiquez vos genres préférés", icon: <Users className="w-8 h-8" /> },
                            { step: "2", title: "Notez des films", desc: "Donnez votre avis sur quelques films pour que l'IA comprenne vos goûts", icon: <Star className="w-8 h-8" /> },
                            { step: "3", title: "Découvrez des pépites", desc: "Recevez des recommandations personnalisées et explorez de nouveaux horizons", icon: <Sparkles className="w-8 h-8" /> }
                        ].map((item, index) => (
                            <div key={index} className="text-center relative">
                                <div className="bg-gradient-to-r from-purple-600 to-pink-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl font-bold shadow-lg">
                                    {item.step}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                                {index < 2 && (
                                    <ArrowRight className="hidden lg:block absolute top-10 -right-6 w-12 h-12 text-purple-300" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section id="testimonials" className="py-20 px-4 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Ils adorent CinéSense
                        </h2>
                        <p className="text-xl text-gray-600">
                            Rejoignez des milliers d'utilisateurs satisfaits
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl hover:shadow-xl transition">
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-gray-700 leading-relaxed mb-6 italic">"{testimonial.text}"</p>
                                <div className="flex items-center gap-3">
                                    <img
                                        src={testimonial.avatar}
                                        alt={testimonial.author}
                                        className="w-12 h-12 rounded-full"
                                    />
                                    <div>
                                        <div className="font-bold text-gray-900">{testimonial.author}</div>
                                        <div className="text-sm text-gray-600">{testimonial.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-pink-600 relative overflow-hidden">
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Prêt à découvrir votre prochain film préféré ?
                    </h2>
                    <p className="text-xl text-purple-100 mb-8">
                        Rejoignez des milliers d'utilisateurs qui font confiance à CinéSense pour leurs recommandations cinéma.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <button
                            onClick={onNavigateToSignup}
                            className="group px-10 py-4 bg-white text-purple-600 rounded-xl hover:shadow-2xl transition text-lg font-bold flex items-center gap-2"
                        >
                            <Check className="w-5 h-5" />
                            Commencer maintenant - C'est gratuit
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                        </button>
                    </div>

                    <div className="mt-8 flex flex-wrap items-center justify-center gap-8 text-white/80">
                        <div className="flex items-center gap-2">
                            <Check className="w-5 h-5" />
                            <span>Sans carte bancaire</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="w-5 h-5" />
                            <span>Installation instantanée</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="w-5 h-5" />
                            <span>Toujours gratuit</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-white py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-lg">
                                    <Film className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-2xl font-bold">CinéSense</span>
                            </div>
                            <p className="text-gray-400">
                                La plateforme de découverte de films propulsée par l'intelligence artificielle.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold mb-4">Produit</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#features" className="hover:text-purple-400 transition">Fonctionnalités</a></li>
                                <li><a href="#" className="hover:text-purple-400 transition">Tarifs</a></li>
                                <li><a href="#" className="hover:text-purple-400 transition">FAQ</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold mb-4">Entreprise</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-purple-400 transition">À propos</a></li>
                                <li><a href="#" className="hover:text-purple-400 transition">Blog</a></li>
                                <li><a href="#" className="hover:text-purple-400 transition">Carrières</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold mb-4">Suivez-nous</h3>
                            <div className="flex gap-3">
                                {socialLinks.map((social) => (
                                    <a
                                        key={social.name}
                                        href={social.url}
                                        className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition"
                                        aria-label={social.name}
                                    >
                                        <span className="text-sm font-bold">{social.icon}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
                        <p>&copy; 2025 CinéSense. Projet Universitaire - Tous droits réservés.</p>
                    </div>
                </div>
            </footer>

            <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -20px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(20px, 20px) scale(1.05); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
        </div>
    );
};

export default Home;