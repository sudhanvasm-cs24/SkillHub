import React, { useState, useEffect } from 'react';
// NEW: Import react-slick
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import FloatingLines from './FloatingLines';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './contexts/ProtectedRoute';

// NEW: Import React Router components
import { 
  BrowserRouter, Routes, Route, Link, useNavigate, 
  useParams, Outlet, useLocation, useOutletContext
} from 'react-router-dom';
import { 
  BookOpen, Map, Home, Youtube, Brain, Shield, Database, Code, Server, 
  Network, Lock, Sigma, User, Info, ChartNoAxesCombined, TvMinimalPlay,
  ArrowLeft, ExternalLink, Square, CheckSquare, Cpu, ListCheck, CodeXml, ArrowRight, BookmarkCheck,
  Loader,
  // FIXED: Corrected names
  Puzzle, Globe, Calculator, MonitorDot, 
  ChevronLeft, ChevronRight, 
  SquareTerminal, BrainCircuit, ChartBarStacked,
  Bot, Cloudy, HouseWifi, Gamepad, ShieldAlert, CircuitBoard, Blocks,
  Github, Linkedin, Flame, Zap, Trophy, Award, Target, CalendarDays, Star,
  Facebook,
  Twitter,
  Instagram,
  LockKeyhole
} from 'lucide-react';

// --- Icon Mapping ---
const icons = {
  // From Roadmaps
  Code, Brain, Shield, Map, 
  SquareTerminal,
  BrainCircuit,
  ChartBarStacked,
  Bot,
  Cloudy,
  HouseWifi,
  Gamepad,
  ShieldAlert,
  Blocks, 

  // Learning
  Database, Server, Network, Cpu, BookOpen,
  Calculator,
  Puzzle: Puzzle,
  GlobeLock: Globe, 
  MonitorCloud: MonitorDot, 
  CircuitBoard,
  
  // Other icons
  Lock, Sigma,
  // From HomePage
  ChartNoAxesCombined, TvMinimalPlay, ListCheck, CodeXml, BookmarkCheck, Youtube, ExternalLink,
  // Nav icons
  Home, Info,
  // Footer icons
  Github, Linkedin,
  // Gamification
  Flame, Zap, Trophy, Award, Target, CalendarDays, Star
};

// --- Shared Styles ---
const styles = {
  card: "bg-gray-900 rounded-3xl border border-gray-800 shadow-lg p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-blue-500/20 block",
  buttonPrimary: "bg-blue-500 text-white px-6 py-3 rounded-full font-semibold text-lg hover:bg-blue-800 transition-all duration-300 shadow-lg flex items-center gap-2 justify-center",
  input: "w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
  pageContainer: "p-8 pt-28 max-w-7xl mx-auto", 
  heading: "text-4xl font-bold mb-8 mt-8 text-center text-white"
};

// --- Testimonial Data ---
const reviews = [
  {
    name: "Sudhanva S M",
    img: "/Images/sudhanva.png",
    course: "Machine Learning",
    quote: "This roadmap helped me understand ML and build models."
  },
  {
    name: "Sumant Shridhar",
    img: "/Images/sumant.jpeg",
    course: "Web development",
    quote: "I understood the concepts clearly & built my first portfolio website."
  },
  { 
    name: "Subraveti Sathvik", 
    img: "/Images/sathvik.jpg",
    course: "Artificial Intelligence", 
    quote: "I learned AI concepts well and created a chatbot." 
  },
  { 
    name: "Srihari S Rao", 
    img: "/Images/srihari.jpg",
    course: "Cyber Security", 
    quote: "I learned essential security concepts and built my first analyzer." 
  }
];

// --- Helper Components ---

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
};

const LoadingSpinner = () => (
  <div className="flex flex-col justify-center items-center h-[60vh] text-white">
    <Loader className="h-16 w-16 animate-spin text-blue-400" />
    <p className="text-lg text-gray-300 mt-4">Loading Content...</p>
  </div>
);

// Reusable Component for Resources/Assignments List
const ResourceList = ({ items, title }) => {
  if (!items || items.length === 0) return null;
  return (
    <div className="mt-4">
      <h4 className="font-semibold text-gray-300 mb-2 flex items-center gap-2">
        {title === "Resources" ? <BookOpen className="h-4 w-4 text-blue-400"/> : <CodeXml className="h-4 w-4 text-green-400"/>}
        {title}
      </h4>
      <ol className="list-decimal list-inside space-y-2 pl-2">
        {items.map((link, i) => (
          <li key={i} className="text-gray-300">
            <a href={link.url} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 hover:underline inline-flex items-center gap-1 transition-colors">
              {link.name} <ExternalLink className="h-3 w-3 opacity-70"/>
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
};

// Reusable Step Card for Details Pages
const StepCard = ({ step, stepId, isComplete, onToggle }) => (
  <div className={`bg-gray-900 rounded-2xl shadow-lg p-6 border transition-all duration-300 ${isComplete ? 'border-green-500/50 bg-green-500/5' : 'border-gray-800'}`}>
    <div className="flex items-start space-x-4">
      <button 
        onClick={() => onToggle(stepId)} 
        className={`flex-shrink-0 mt-1 transition-transform active:scale-90 ${isComplete ? 'text-green-500' : 'text-gray-600 hover:text-blue-400'}`}
        title={isComplete ? "Mark Incomplete" : "Mark Complete"}
      >
        {isComplete ? <CheckSquare className="h-8 w-8" /> : <Square className="h-8 w-8" />}
      </button>
      <div className="w-full">
        <h3 className={`text-2xl font-bold mb-2 ${isComplete ? 'text-gray-500 line-through decoration-2' : 'text-white'}`}>
          {step.title}
        </h3>
        <p className={`text-gray-300 mb-4 leading-relaxed ${isComplete ? 'text-gray-600' : ''}`}>
          {step.description}
        </p>
        
        {/* Resources & Assignments */}
        {(step.resources?.length > 0 || step.assignments?.length > 0) && (
          <div className="border-t border-gray-800 pt-4 mt-4 grid md:grid-cols-2 gap-6">
            <ResourceList items={step.resources} title="Resources" />
            <ResourceList items={step.assignments} title="Assignments" />
          </div>
        )}
      </div>
    </div>
  </div>
);

// Custom Arrows for Carousel
const SlickArrow = ({ onClick, direction }) => {
  const Icon = direction === 'left' ? ChevronLeft : ChevronRight;
  const posClass = direction === 'left' ? 'left-4' : 'right-4';
  return (
    <div onClick={onClick} className={`absolute top-1/2 ${posClass} -translate-y-1/2 z-20 cursor-pointer bg-gray-800/80 backdrop-blur-sm rounded-full p-3 text-white hover:bg-blue-600 transition-all shadow-lg border border-gray-700`}>
      <Icon className="h-6 w-6" />
    </div>
  );
};

// --- Main Layout Components ---

function Navbar() {
  const { pathname } = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const navItems = [
    { id: '/', label: 'Home', icon: Home },
    { id: '/roadmaps', label: 'Roadmaps', icon: Map },
    { id: '/learning', label: 'Learning', icon: BookOpen },
    { id: '/about', label: 'About', icon: Info },
  ];

  return (
    <nav className="fixed bg-gray-900/80 flex justify-between items-center gap-4 md:gap-8 py-3 px-6 md:px-8 left-1/2 -translate-x-1/2 top-6 rounded-full backdrop-blur-sm text-white shadow-2xl z-[100] border border-gray-700/50 w-[95%] max-w-6xl">
      <Link to="/" className="flex items-center space-x-2 cursor-pointer group">
        <div className="bg-blue-500/20 p-2 rounded-lg group-hover:bg-blue-500/30 transition-colors">
           <BookOpen className="h-6 w-6 text-blue-400" />
        </div>
        <span className="text-2xl font-bold hidden sm:block tracking-tight">SkillHub</span>
      </Link>

      <div className="hidden md:flex bg-gray-800/50 rounded-full p-2 border backdrop-blur-lg border-gray-700/50">
        {navItems.map((item) => {
          const isActive = (pathname.startsWith(item.id) && item.id !== '/') || pathname === item.id;
          return (
            <Link key={item.id} to={item.id} className={`flex items-center space-x-2 px-4 gap-2 py-2 rounded-full transition-all duration-300 ${isActive ? 'bg-blue-500 text-white shadow-md' : 'text-gray-300 hover:text-white hover:bg-gray-700/50'}`}>
              <item.icon className="h-6 w-6" />
              <span className="text-md font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="flex items-center space-x-3">
        {isAuthenticated ? (
          <>
            <span className="hidden sm:block text-gray-300 text-md font-medium">{user?.name}</span>
            <button 
              onClick={logout} 
              className="hidden sm:block text-gray-300 hover:text-red-400 text-md font-medium px-3 py-2 transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hidden sm:block text-gray-300 hover:text-white text-md font-medium px-3 py-2 transition-colors">Login</Link>
            <Link to="/register" className="bg-white text-gray-900 px-5 py-2.5 rounded-full hover:bg-gray-300 transition-all shadow-lg flex items-center space-x-2 font-semibold text-base">
              <span className="hidden sm:inline">Get Started</span> <ArrowRight className="h-4 w-4"/>
            </Link>
          </>
        )}
        {isAuthenticated && (
          <Link to="/profile" className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 border border-gray-700 transition-colors"><User className="h-5 w-5 text-blue-400" /></Link>
        )}
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-32">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-6 w-6 text-blue-400" />
              <span className="text-xl font-bold text-white">SkillHub</span>
            </div>
            <p className="text-gray-300 leading-relaxed max-w-sm">
              Your structured path to mastering Computer Science. Built with passion for students, by students.
            </p>
          </div>
          <div>
            <h5 className="text-white font-semibold mb-4">Platform</h5>
            <ul className="space-y-3 text-gray-300">
              <li><Link to="/roadmaps" className="hover:text-blue-400 transition-colors">Browse Roadmaps</Link></li>
              <li><Link to="/learning" className="hover:text-blue-400 transition-colors">Learning Paths</Link></li>
              <li><Link to="/profile" className="hover:text-blue-400 transition-colors">Your Progress</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-semibold mb-4">Connect</h5>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/" className="bg-gray-800 p-2 rounded-lg hover:bg-blue-600 hover:text-white transition-all text-gray-300"><Facebook className="h-5 w-5" /></a>
              <a href="https://www.instagram.com/" className="bg-gray-800 p-2 rounded-lg hover:bg-pink-600 hover:text-white transition-all text-gray-300"><Instagram className="h-5 w-5" /></a>
              <a href="https://x.com/" className="bg-gray-800 p-2 rounded-lg hover:bg-blue-600 hover:text-white transition-all text-gray-300"><Twitter className="h-5 w-5" /></a>
              <a href="https://www.linkedin.com/in/sudhanvasm/" className="bg-gray-800 p-2 rounded-lg hover:bg-blue-600 hover:text-white transition-all text-gray-300"><Linkedin className="h-5 w-5" /></a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-center items-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} SkillHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

// --- Page Components ---

function HomePage() {
  const navigate = useNavigate();
  const { reviews } = useOutletContext();
  const { isAuthenticated } = useAuth();

  const carouselSettings = {
    dots: true, infinite: true, speed: 800, slidesToShow: 3, slidesToScroll: 1, autoplay: true, autoplaySpeed: 5000,
    nextArrow: <SlickArrow direction="right" />, prevArrow: <SlickArrow direction="left" />,
    appendDots: dots => <div className="absolute -bottom-12 w-full"><ul className="m-0 flex justify-center space-x-2">{dots}</ul></div>,
    customPaging: () => <button className="h-2 w-2 rounded-full bg-gray-700 hover:bg-blue-500 hover:scale-105 transition-all" />,
    responsive: [{ breakpoint: 1024, settings: { slidesToShow: 2 } }, { breakpoint: 640, settings: { slidesToShow: 1 } }]
  };

  return (
    <div className="text-center pt-32 px-6">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto mb-24 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-blue-500/20 blur-[120px] rounded-full -z-10"></div>
        <div className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
          🚀 Master Computer Science the Right Way
        </div>
        <h1 className="text-6xl md:text-7xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 tracking-tight leading-tight">
          Your Path to <br/> <span className="text-blue-400">Tech Mastery</span>
        </h1>
        <p className="text-xl text-white max-w-2xl mx-auto mb-10 leading-relaxed">
          Stop getting lost in random tutorials. Follow structured roadmaps, track your progress, and master essential CS concepts step-by-step.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button onClick={() => isAuthenticated ? navigate('/roadmaps') : navigate('/login')} className={styles.buttonPrimary}>
            Explore Roadmaps <ArrowRight className="h-5 w-5"/>
          </button>
          <button onClick={() => isAuthenticated ? navigate('/learning') : navigate('/login')} className={styles.buttonPrimary}>
            Browse Topics <ArrowRight className="h-5 w-5"/>
          </button>
        </div>
      </div>

      {/* Stats / Features Grid */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 mb-32">
        {[
          { icon: Map, title: "Structured Roadmaps", desc: "Step-by-step guides for every major tech role.", color: "text-purple-400", bg: "bg-purple-500/10" },
          { icon: Youtube, title: "Curated Resources", desc: "Hand-picked videos and docs. No filler.", color: "text-red-400", bg: "bg-red-500/10" },
          { icon: Trophy, title: "Gamified Progress", desc: "Earn XP, maintain streaks, and level up.", color: "text-yellow-400", bg: "bg-yellow-500/10" }
        ].map((feature, idx) => (
          <div key={idx} className="bg-gray-900/50 backdrop-blur-md p-8 rounded-3xl border border-gray-800 hover:border-gray-700 transition-all text-left">
            <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mx-auto mb-6`}>
              <feature.icon className={`h-7 w-7 ${feature.color}`} />
            </div>
            <h3 className="text-xl font-bold text-white text-center mb-3">{feature.title}</h3>
            <p className="text-gray-300 text-center leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>

      {/* How to Get Started Section */}
      <div className="mt-28 -translate-y-2 w-full max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-10 text-center">How to Get Started?</h1>
        <div className="grid md:grid-cols-3 gap-8">
          {[
          { icon: ListCheck, title: "1. Choose a Path", desc: "Browse our list of CS domains and select a topic.", color: "text-green-400", bg: "bg-green-500/10" },
          { icon: ExternalLink, title: "2. Follow Steps", desc: "Each step includes curated links to high-quality resources.", color: "text-blue-400", bg: "bg-blue-500/10" },
          { icon: BookmarkCheck, title: "3. Track Progress", desc: "Mark tasks as you complete them to see your progress bar fill up.", color: "text-orange-400", bg: "bg-yellow-500/10" }
        ].map((feature, idx) => (
          <div key={idx} className="bg-gray-900/50 backdrop-blur-md p-8 rounded-3xl border border-gray-800 hover:border-gray-700 transition-all text-center">
            <div className={`w-14 h-14 rounded-2xl ${feature.bg} mx-auto flex items-center justify-center mb-6`}>
              <feature.icon className={`h-7 w-7 ${feature.color}`} />
            </div>
            <h3 className="text-xl font-bold text-white text-center mb-3">{feature.title}</h3>
            <p className="text-gray-300 text-center leading-relaxed">{feature.desc}</p>
          </div>
        ))}
        </div>
      </div>

      {/* Featured Roadmap */}
      <div className="max-w-6xl mx-auto mt-28 mb-32">
        <div className="bg-gradient-to-t from-gray-900 to-gray-700 border border-gray-800 rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden text-left flex flex-col md:flex-row items-center gap-12">
          <div className="absolute w-full h-full bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.1),_transparent_40%)]"></div>
          <div className="md:w-1/2 relative backdrop-blur-lg z-10">
            <div className="flex items-center gap-2 text-blue-400 font-semibold mb-4">
              <Star className="h-5 w-5 fill-current" />
              <span>Most Popular Path</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Full Stack Web Development</h2>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              From HTML basics to advanced React & Node.js. This is the complete guide to becoming a modern web developer in 2024.
            </p>
            <button onClick={() => isAuthenticated ? navigate('/roadmaps/web') : navigate('/login')} className={styles.buttonPrimary}>
              Start This Path <ArrowRight className="h-5 w-5"/>
            </button>
          </div>
          <div className="md:w-1/2 relative z-10 flex justify-center">
            <div className="relative w-full max-w-md aspect-square bg-gray-800 rounded-3xl border border-gray-700 p-8 flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-all duration-500">
              <CodeXml className="w-32 h-32 text-blue-500" />
              <div className="absolute -bottom-6 -right-6 bg-gray-800 p-4 rounded-2xl border border-gray-700 shadow-xl flex items-center gap-3">
                <div className="bg-green-500/20 p-2 rounded-lg"><CheckSquare className="h-6 w-6 text-green-500"/></div>
                <div>
                  <p className="text-xs text-gray-300">Course Status</p>
                  <p className="text-sm font-bold text-white">Updated 2025</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="max-w-7xl mx-auto mb-20">
        <h2 className="text-4xl font-bold text-white mb-12">Join Your Classmates</h2>
        <div className="slick-container px-5">
          <Slider {...carouselSettings}>
            {reviews.map((d, idx) => (
              <div key={idx} className="px-3 pb-12">
                <div className="bg-gray-900 rounded-3xl border border-gray-800 p-8 h-full min-h-[150px] flex flex-col hover:border-gray-700 transition-all relative group">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-800 border-2 border-gray-700">
                      <img src={d.img} alt={d.name} className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                    </div>
                    <div className="text-left">
                      <p className="text-lg font-bold select-text text-white">{d.name}</p>
                      <p className="text-sm text-blue-400 font-medium">{d.course}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 text-lg leading-relaxed text-left flex-grow">"{d.quote}"</p>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
}

function RoadmapsPage() {
  const { roadmaps } = useOutletContext();
  return (
    <div className={styles.pageContainer}>
      <h2 className={styles.heading}>CS Domain Paths</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roadmaps.map((roadmap) => {
          const Icon = icons[roadmap.icon] || Map;
          return (
            <Link key={roadmap._id} to={`/roadmaps/${roadmap.roadmapId}`} className={styles.card}>
              <div className="w-14 h-14 bg-gray-800 rounded-xl flex items-center justify-center mb-6">
                 <Icon className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-3xl font-bold mb-3 text-white">{roadmap.title}</h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">{roadmap.description}</p>
              <div className="flex items-center text-blue-400 text-sm font-medium group">
                <span>View Roadmap</span>
                <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function LearningPage() {
  const { learningItems } = useOutletContext();
  return (
    <div className={styles.pageContainer}>
      <h2 className={styles.heading}>Core Concepts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {learningItems.map((item) => {
          const Icon = icons[item.icon] || BookOpen;
          return (
            <Link key={item._id} to={`/learning/${item.learningId}`} className={styles.card}>
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-gray-800 rounded-xl flex items-center justify-center">
                   <Icon className="h-8 w-8 text-blue-400" />
                </div>
                <span className="text-xs font-bold bg-gray-800 text-gray-300 px-3 py-1 rounded-full border border-gray-700">
                  {item.steps?.length || 0} MODULES
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
              <p className="text-gray-300 text-sm mb-4 line-clamp-2">{item.description || "Master this fundamental topic with curated resources."}</p>
              <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full w-0 group-hover:w-1/3 transition-all duration-500"></div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// Optimized Single Detail Page Component
// This replaces both RoadmapDetailPage and LearningDetailPage
function DetailPage({ type }) {
  const params = useParams();
  const navigate = useNavigate();
  // FIX: Destructured onToggleComplete here
  const { roadmaps, learningItems, progressData, onToggleComplete } = useOutletContext();
  
  const id = type === 'roadmap' ? params.roadmapId : params.learningId;
  const data = type === 'roadmap' ? roadmaps : learningItems;
  const item = data.find(r => (type === 'roadmap' ? r.roadmapId : r.learningId) === id) || { title: 'Not Found', steps: [] };

  // Calculate progress for this specific item
  const totalItemSteps = item.steps?.length || 0;
  const completedItemSteps = item.steps?.filter(step => progressData[`${type}-${id}-${step.id}`]).length || 0;
  const progressPercent = totalItemSteps > 0 ? Math.round((completedItemSteps / totalItemSteps) * 100) : 0;

  return (
    <div className={styles.pageContainer}>
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => navigate(-1)} className="flex items-center pt-16 space-x-2 text-gray-300 hover:text-white transition-colors">
          <ArrowLeft className="h-5 w-5" /> <span>Back</span>
        </button>
        <div className="text-right pt-16">
           <p className="text-sm text-gray-300 mb-1">{progressPercent}% Completed</p>
           <div className="w-36 bg-gray-800 h-2 rounded-full overflow-hidden">
             <div className="bg-green-500 h-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
           </div>
        </div>
      </div>

      <div className="text-center mb-12">
        <h2 className="text-5xl font-bold text-white mb-4">{item.title}</h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">{item.description}</p>
      </div>

      {item.steps?.length > 0 ? (
        <div className="max-w-4xl mx-auto space-y-6 relative before:absolute before:left-8 before:top-0 before:bottom-0 before:w-1 before:bg-gray-800">
          {item.steps.map((step, idx) => (
            <div key={step.id} className="relative pl-24">
               {/* Timeline Connector */}
               <div className={`absolute left-4 top-8 w-9 h-10 rounded-full border-4 flex items-center justify-center z-10 bg-gray-900 ${!!progressData[`${type}-${id}-${step.id}`] ? 'border-green-500 text-green-500' : 'border-gray-700 text-gray-500'}`}>
                  <span className="text-xs font-bold">{idx + 1}</span>
               </div>
               
               {/* Optimized StepCard Call */}
              <StepCard 
                step={step} 
                stepId={`${type}-${id}-${step.id}`} 
                isComplete={!!progressData[`${type}-${id}-${step.id}`]} 
                onToggle={onToggleComplete} 
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center bg-gray-900 rounded-3xl p-12 border border-gray-800">
          <p className="text-gray-300 text-lg">Content is being updated for this path. Check back soon!</p>
        </div>
      )}
    </div>
  );
}

function AuthForm({ title, buttonText, isRegister = false }) {
  const navigate = useNavigate();
  const { register, login, loading, error } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.email || !formData.password || (isRegister && !formData.name)) {
      setFormError('Please fill in all fields');
      return;
    }

    if (!validateEmail(formData.email)) {
      setFormError('Please enter a valid email address');
      return;
    }

    const result = isRegister
      ? await register(formData.name, formData.email, formData.password)
      : await login(formData.email, formData.password);

    if (result.success) {
      navigate('/profile');
    } else {
      setFormError(result.error);
    }
  };

  return (
    <div className="flex justify-center items-center pt-32 pb-20 px-4">
      <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-gray-800">
        <div className="text-center mb-8">
           <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
             <LockKeyhole className="h-6 w-6 text-blue-400" />
           </div>
           <h2 className="text-3xl font-bold text-white">{title}</h2>
           <p className="text-gray-300 text-md mt-2">Welcome to SkillHub</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {(formError || error) && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
              <p className="text-red-400 text-sm">{formError || error}</p>
            </div>
          )}
          {isRegister && (
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1 ml-1">Full Name</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={styles.input} 
                placeholder="John Doe" 
              />
            </div>
          )}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1 ml-1">Email Address</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.input} 
              placeholder="you@example.com" 
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1 ml-1">Password</label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={styles.input} 
              placeholder="•••••••••" 
            />
          </div>
          <button 
            className={styles.buttonPrimary + " w-full justify-center mt-4 disabled:opacity-50 disabled:cursor-not-allowed"}
            disabled={loading}
          >
            {loading ? 'Processing...' : buttonText}
          </button>
        </form>
        <p className="text-center mt-8 text-gray-300 text-sm">
          {isRegister ? "Already have an account?" : "Don't have an account?"} 
          <span 
            className="text-blue-400 cursor-pointer hover:underline ml-1 font-medium" 
            onClick={() => navigate(isRegister ? '/login' : '/register')}
          >
            {isRegister ? 'Login' : 'Register'}
          </span>
        </p>
      </div>
    </div>
  );
}

function ProfilePage() {
  const { user, updateProfile, changePassword } = useAuth();
  const { progressData, totalSteps} = useOutletContext();
  const completedCount = Object.keys(progressData).length;
  const progress = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

  // Mock Gamification
  const level = Math.floor(completedCount / 5) + 1;
  const xp = completedCount * 100;
  const streak = progress;

  // Local UI state for update forms
  const [showUpdate, setShowUpdate] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [updateForm, setUpdateForm] = React.useState({ name: user?.name || '', email: user?.email || '' });
  const [pwdForm, setPwdForm] = React.useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [msg, setMsg] = React.useState(null);
  const [pwdError, setPwdError] = React.useState(null);
  const [loadingAction, setLoadingAction] = React.useState(false);

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setLoadingAction(true);
    const res = await updateProfile(updateForm.name, updateForm.email);
    if (res.success) {
      setMsg({ type: 'success', text: 'Profile updated successfully.' });
      setShowUpdate(false);
    } else {
      setMsg({ type: 'error', text: res.error || 'Failed to update profile.' });
    }
    setLoadingAction(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setPwdError(null);
    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      setMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    setLoadingAction(true);

    let res;
    try {
      res = await changePassword(pwdForm.currentPassword, pwdForm.newPassword);
      console.log('changePassword result:', res);
    } catch (err) {
      // Shouldn't normally happen because changePassword catches, but guard anyway
      console.error('changePassword threw:', err);
      const text = err?.message || 'Failed to change password.';
      setMsg({ type: 'error', text });
      setPwdError(text);
      setLoadingAction(false);
      return;
    }

    // Defensive handling if response is missing or malformed
    if (!res || typeof res !== 'object') {
      const text = 'Failed to change password.';
      setMsg({ type: 'error', text });
      setPwdError(text);
      setLoadingAction(false);
      return;
    }

    // If server indicates success
    if (res.success) {
    setMsg({
      type: 'success',
      text: res.message || 'Password updated successfully.'
    });
    setPwdError(null);
    setShowPassword(false);
    setPwdForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    return;
  }

    // Otherwise map known cases to a clear inline message
    let errText = res.error || 'Failed to change password.';
    const errMsg = (res.error || '').toString();

    const wrongPwdRegex = /current|incorrect|wrong password|invalid current|incorrect password|current password is incorrect/i;

    // Show explicit alert when server indicates incorrect current password or 401
    if (res.status === 401 || wrongPwdRegex.test(errMsg)) {
      errText = 'The password entered is incorrect. Please try again.';
      try { window.alert(errText); } catch (e) { /* ignore in non-browser env */ }
    } else if (/failed to fetch|network|timeout/i.test(errMsg)) {
      // Network related error
      errText = 'Network error while changing password. Please check your connection and try again.';
      try { window.alert(errText); } catch (e) { /* ignore */ }
    } else if (!res.status && res.error && res.error.toString().toLowerCase().includes('password')) {
      // Generic failure mentioning password - surface it
      try { window.alert(errText); } catch (e) { /* ignore */ }
    }

    if (!errText) errText = 'Failed to change password.';

    // Append status for debugging visibility if present
    const statusSuffix = res.status ? ` (status ${res.status})` : '';
    const fullErrText = `${errText}${statusSuffix}`;

    setMsg({ type: 'error', text: fullErrText });
    setPwdError(fullErrText);
    setLoadingAction(false);
  };


  return (
    <div className={styles.pageContainer}>
      
      {/* Profile Header */}
      <div className="mt-8 bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 border border-gray-800 shadow-2xl mb-8 flex flex-col md:flex-row items-center md:items-start backdrop-blur-lg gap-8">
        <div className="w-32 h-32 bg-gray-700 rounded-full p-1 border-4 border-gray-800 shadow-xl relative">
           <img src={`/Images/avatar.png`} alt="avatar" className="w-full h-full rounded-full bg-gray-800" />
           <div className="absolute bottom-0 right-0 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full border-4 border-gray-800">LVL {level}</div>
        </div>
        <div className="text-center md:text-left flex-grow">
          <h2 className="text-3xl font-bold text-white mb-2">{user?.name || "Student User"}</h2>
          <p className="text-gray-300 mb-6">Computer Science • Batch 2025</p>

          <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
            <button
              className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium"
              onClick={() => { setShowUpdate(!showUpdate); setShowPassword(false); setMsg(null); setUpdateForm({ name: user?.name || '', email: user?.email || '' }); }}
            >
              Update Profile
            </button>
            <button
              className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium border border-gray-700"
              onClick={() => { setShowPassword(!showPassword); setShowUpdate(false); setMsg(null); setPwdError(null); setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' }); }}
            >
              Change Password
            </button>
          </div>

          {msg && (
            <div className={`mb-4 p-3 rounded-md ${msg.type === 'success' ? 'bg-green-800 text-green-200' : 'bg-red-800 text-red-200'}`}>
              {msg.text}
            </div>
          )}

          {showUpdate && (
            <form onSubmit={handleUpdateSubmit} className="mb-6 bg-gray-800 p-4 rounded-md border border-gray-700">
              <label className="block text-sm text-gray-300 mb-2">Name</label>
              <input className="w-full mb-3 p-2 rounded bg-gray-900 border border-gray-700 text-white" value={updateForm.name} onChange={(e) => setUpdateForm({...updateForm, name: e.target.value})} />
              <label className="block text-sm text-gray-300 mb-2">Email</label>
              <input className="w-full mb-3 p-2 rounded bg-gray-900 border border-gray-700 text-white" value={updateForm.email} onChange={(e) => setUpdateForm({...updateForm, email: e.target.value})} />
              <div className="flex gap-2">
                <button type="submit" className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md" disabled={loadingAction}>{loadingAction ? 'Saving...' : 'Save'}</button>
                <button type="button" className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md" onClick={() => setShowUpdate(false)}>Cancel</button>
              </div>
            </form>
          )}

          {showPassword && (
            <form onSubmit={handlePasswordSubmit} className="mb-6 bg-gray-800 p-4 rounded-md border border-gray-700">
              <label className="block text-sm text-gray-300 mb-2">Current Password</label>
              <input type="password" className="w-full mb-3 p-2 rounded bg-gray-900 border border-gray-700 text-white" value={pwdForm.currentPassword} onChange={(e) => setPwdForm({...pwdForm, currentPassword: e.target.value})} />
              {pwdError && <div className="mb-3 p-2 rounded bg-red-800 text-red-100 text-sm">{pwdError}</div>}
              <label className="block text-sm text-gray-300 mb-2">New Password</label>
              <input type="password" className="w-full mb-3 p-2 rounded bg-gray-900 border border-gray-700 text-white" value={pwdForm.newPassword} onChange={(e) => setPwdForm({...pwdForm, newPassword: e.target.value})} />
              <label className="block text-sm text-gray-300 mb-2">Confirm New Password</label>
              <input type="password" className="w-full mb-3 p-2 rounded bg-gray-900 border border-gray-700 text-white" value={pwdForm.confirmPassword} onChange={(e) => setPwdForm({...pwdForm, confirmPassword: e.target.value})} />
              <div className="flex gap-2">
                <button type="submit" className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md" disabled={loadingAction}>{loadingAction ? 'Saving...' : 'Change Password'}</button>
                <button type="button" className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md" onClick={() => setShowPassword(false)}>Cancel</button>
              </div>
            </form>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
             <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700">
                <div className="text-gray-300 text-xs uppercase font-bold mb-1 flex items-center justify-center md:justify-start gap-1"><Flame className="h-3 w-3 text-orange-500"/> Streak</div>
                <div className="text-2xl font-bold text-white">{streak} <span className="text-sm font-normal text-gray-500">days</span></div>
             </div>
             <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700">
                <div className="text-gray-300 text-xs uppercase font-bold mb-1 flex items-center justify-center md:justify-start gap-1"><Zap className="h-3 w-3 text-yellow-500"/> XP Earned</div>
                <div className="text-2xl font-bold text-white">{xp}</div>
             </div>
             <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700">
                <div className="text-gray-300 text-xs uppercase font-bold mb-1 flex items-center justify-center md:justify-start gap-1"><Target className="h-3 w-3 text-red-500"/> Tasks</div>
                <div className="text-2xl font-bold text-white">{completedCount}</div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Progress */}
        <div className="md:col-span-2 bg-gray-900 rounded-3xl p-8 lg border border-gray-800 shadow-lg">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Trophy className="h-5 w-5 text-yellow-500"/> Overall Progress</h3>
          <div className="mb-2 flex justify-between text-sm font-medium">
            <span className="text-gray-300">Course Completion</span>
            <span className="text-blue-400">{progress}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-4 mb-8 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-full rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
          </div>
          
          <h4 className="font-semibold text-white mb-4 mt-8">Activity</h4>
          {/* Simple Heatmap Mock */}
          <div className="flex gap-1 flex-wrap">
             {[...Array(60)].map((_, i) => (
               <div key={i} className={`w-3 h-3 rounded-sm ${Math.random() > 0.7 ? 'bg-green-500' : Math.random() > 0.5 ? 'bg-green-900' : 'bg-gray-800'}`}></div>
             ))}
          </div>
        </div>

        {/* Badges */}
        <div className="bg-gray-900 rounded-3xl p-8 border border-gray-800 shadow-lg">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Award className="h-5 w-5 text-purple-500"/> Badges</h3>
          <div className="grid grid-cols-2 gap-4">
             {[
               {name: "Early Bird", icon: BookOpen, unlocked: true},
               {name: "On Fire", icon: Flame, unlocked: streak > 3},
               {name: "Scholar", icon: Calculator, unlocked: completedCount > 10},
               {name: "Master", icon: Trophy, unlocked: completedCount > 50},
             ].map((badge, i) => (
               <div key={i} className={`flex flex-col items-center p-4 rounded-xl border ${badge.unlocked ? 'bg-blue-500/10 border-blue-500/30' : 'bg-gray-800/50 border-gray-700 opacity-50'}`}>
                  <badge.icon className={`h-8 w-8 mb-2 ${badge.unlocked ? 'text-blue-400' : 'text-gray-500'}`}/>
                  <span className="text-xs font-medium text-gray-300">{badge.name}</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AboutPage() {
  return (
    <div className={styles.pageContainer}>
      <h2 className={styles.heading}>About SkillHub</h2>
      <div className="bg-gray-900 rounded-3xl shadow-lg p-8 md:p-12 border border-gray-800 space-y-12">
        {/* Mission */}
        <div className="flex flex-col md:flex-row gap-8 items-center">
           <div className="flex-1">
             <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
             <p className="text-gray-300 leading-relaxed text-lg">
               SkillHub was built to demystify computer science for students. 
               In a world of infinite tutorials, we provide the <span className="text-blue-400 font-semibold">structured clarity</span> needed to actually master concepts.
             </p>
           </div>
           <div className="w-full md:w-1/3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-8 border border-gray-700 flex items-center justify-center">
              <CircuitBoard className="w-32 h-32 text-blue-400 opacity-80" />
           </div>
        </div>

        {/* Tech Stack */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Built With MERN</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {n: "MongoDB", i: Database, c: "text-green-500/100", b: "bg-green-500/100"}, {n: "Express.js", i: Server}, 
              {n: "React.js", i: CodeXml}, {n: "Node.js", i: Cpu},
              {n: "Tailwind CSS", i: Code}, {n: "React Router", i: Map},
              {n: "Lucide", i: Star}, {n: "Create React App", i: Zap}
            ].map((t, i) => (
              <div key={i} className="bg-gray-800 p-4 rounded-xl flex items-center justify-center gap-3 border border-gray-700 hover:border-blue-500 transition-all group">
                <t.i className={`h-5 w-5 text-gray-500 group-hover:text-blue-400 transition-colors`}/>
                <span className={`font-medium  text-white group-hover:text-white`}>{t.n}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Creator */}
        <div className="bg-gray-800/50 rounded-2xl grid lg:grid-cols-4 p-8 border border-gray-700 items-center gap-6">
        {[
          { img: "/Images/sudhanva.png", name: "Sudhanva S M", desc: "Lead Developer & Student", gb: "https://github.com/sudhanvasm-cs24/", li: "https://www.linkedin.com/in/sudhanvasm/" },
          { img: "/Images/sumant.jpeg", name: "Sumant Shridhar", desc: "Associate Developer & Student", gb: "https://github.com/sumantshridhar", li: "https://www.linkedin.com/in/sumant-shridhar-52598837b/" },
          { img: "/Images/sathvik.jpg", name: "Subraveti Sathvik", desc: "Junior Developer & Student", gb: "https://github.com/subravetics24-Vik/", li: "https://www.linkedin.com/in/sathvik-subraveti-6081bb332" },
          {img: "/Images/srihari.jpg", name: "Srihari S Rao", desc: "Senior Developer & Student", gb: "https://github.com/srihari-sys/", li: "https://www.linkedin.com/in/srihari-s-rao-a1772a8347/"}
        ].map((feature, idx) => (
          <div key={idx} className="bg-gray-900/50 backdrop-blur-md p-8 rounded-3xl border border-gray-800 hover:border-gray-700 transition-all text-center">
            <div className={`w-28 h-28 rounded-full ${feature.bg} mx-auto flex items-center justify-center mb-6`}>
              <img src={feature.img} alt="" className={`h-24 w-24 rounded-full overflow-hidden border border-gray-900`} />
            </div>
            <h3 className="text-xl font-bold text-white text-center mb-2">{feature.name}</h3>
            <p className="text-gray-300 text-center leading-relaxed">{feature.desc}</p>
            <div className="flex md:grid-cols-2 mt-4 gap-4 items-center justify-center">
              <a href={feature.gb} className="text-gray-300 hover:text-white"><Github className="h-5 w-5"/></a>
              <a href={feature.li} className="text-gray-300 hover:text-white"><Linkedin className="h-5 w-5"/></a>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}

function Layout() { 
  const [progressData, setProgressData] = useState({});
  const [data, setData] = useState({ roadmaps: [], learningItems: [], reviews: [] });
  const [isLoading, setIsLoading] = useState(true);
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const API_BASE = "https://skill-hub-1h3a.onrender.com";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        const [r, l] = await Promise.all([
          fetch(`${API_BASE}/api/content/roadmaps`, { headers }),
          fetch(`${API_BASE}/api/content/learning`, { headers })
        ]);
        const roadmapsData = r.ok ? await r.json() : [];
        const learningData = l.ok ? await l.json() : [];
        const reviewsData =  reviews; // Fallback to local reviews
        setData({ roadmaps: roadmapsData, learningItems: learningData, reviews: reviewsData });
      } catch (e) { 
        console.error(e);
        // Fallback to local data if API fails
        setData({ roadmaps: [], learningItems: [], reviews: reviews });
      } finally { 
        setIsLoading(false); 
      }
    };
    fetchData();
  }, [token]);

  // When user is authenticated, fetch their saved progress
  useEffect(() => {
    const fetchProgress = async () => {
      if (!token) {
        setProgressData({});
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/api/progress`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const json = await res.json();
          const completed = json.completedSteps || [];
          const map = {};
          completed.forEach(id => { map[id] = true; });
          setProgressData(map);
        }
      } catch (err) {
        console.error('Failed to fetch progress', err);
      }
    };
    fetchProgress();
  }, [token, isAuthenticated]);

  const onToggleComplete = async (stepId) => {
    // If not authenticated, send user to login
    if (!token) {
      navigate('/login');
      return;
    }

    // Optimistic UI update
    setProgressData(prev => {
      const newP = { ...prev };
      if (newP[stepId]) delete newP[stepId]; else newP[stepId] = true;
      return newP;
    });

    try {
      const res = await fetch(`${API_BASE}/api/progress/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ stepId })
      });

      if (!res.ok) {
        // Revert optimistic change on error
        setProgressData(prev => {
          const newP = { ...prev };
          if (newP[stepId]) delete newP[stepId]; else newP[stepId] = true;
          return newP;
        });
      } else {
        const json = await res.json();
        const completed = json.completedSteps || [];
        const map = {};
        completed.forEach(id => { map[id] = true; });
        setProgressData(map);
      }
    } catch (err) {
      console.error('Failed to toggle progress', err);
    }
  };

  const totalSteps = 
    data.roadmaps.reduce((acc, r) => acc + (r.steps?.length || 0), 0) + 
    data.learningItems.reduce((acc, l) => acc + (l.steps?.length || 0), 0);

  return (
    <div className="relative min-h-screen flex flex-col z-10">

      {/* Background Grid Animation */}
      <div
        style={{
          position: 'fixed',
          inset: 0,         // Shorthand for top:0, left:0, right:0, bottom:0
          zIndex: -1,       // <--- KEY FIX: Puts animation strictly BEHIND everything
          pointerEvents: 'none', // Ensures clicks pass through to buttons
        }}
      >
        <FloatingLines
          enabledWaves={['top', 'middle', 'bottom']}
          lineCount={[10, 15, 20]}
          lineDistance={[10, 10, 10]}
          bendRadius={5.0}
          bendStrength={-0.5}
          interactive={true}
          parallax={true}
        />
      </div>

      <Navbar />
      <main className="flex-grow">
        {isLoading ? <LoadingSpinner /> : 
          <Outlet context={{ ...data, progressData, onToggleComplete, totalSteps }} />
        }
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="roadmaps" element={<ProtectedRoute><RoadmapsPage /></ProtectedRoute>} />
            <Route path="roadmaps/:roadmapId" element={<ProtectedRoute><DetailPage type="roadmap" /></ProtectedRoute>} />
            <Route path="learning" element={<ProtectedRoute><LearningPage /></ProtectedRoute>} />
            <Route path="learning/:learningId" element={<ProtectedRoute><DetailPage type="learning" /></ProtectedRoute>} />
            <Route path="login" element={<AuthForm title="Login" buttonText="Login" />} />
            <Route path="register" element={<AuthForm title="Register" buttonText="Create Account" isRegister />} />
            <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="*" element={<HomePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}