import React, { useState, useEffect } from 'react';
// NEW: Import react-slick
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

// NEW: Import React Router components
import { 
  BrowserRouter, Routes, Route, Link, useNavigate, 
  useParams, Outlet, useLocation, useOutletContext
} from 'react-router-dom';
import { 
  BookOpen, Map, Home, Youtube, Brain, Shield, Database, Code, Server, 
  Network, Lock, Sigma, User, LogIn, UserPlus, Info, ChartNoAxesCombined, TvMinimalPlay,
  ArrowLeft, ExternalLink, Square, CheckSquare, Cpu, ListCheck, CodeXml, ArrowRight, BookmarkCheck,
  Loader, Puzzle, LockKeyhole, Calculator, MonitorCloud, SquareTerminal, BrainCircuit, ChartBarStacked,
  Bot, Cloudy, HouseWifi, Gamepad, ShieldAlert, CircuitBoard, Blocks, ChevronLeft, ChevronRight
} from 'lucide-react';

// --- Icon Mapping ---
const icons = {
  BookOpen, Map, Home, Youtube, Brain, Shield, Database, Code, Server, 
  Network, Lock, Sigma, User, LogIn, UserPlus, Info, ChartNoAxesCombined, TvMinimalPlay,
  ArrowLeft, ExternalLink, Square, CheckSquare, Cpu, ListCheck, CodeXml, ArrowRight, BookmarkCheck,
  Loader, Puzzle, LockKeyhole, Calculator, MonitorCloud, SquareTerminal, BrainCircuit, ChartBarStacked,
  Bot, Cloudy, HouseWifi, Gamepad, ShieldAlert, CircuitBoard, Blocks, ChevronLeft, ChevronRight
};


// --- Testimonial Data ---
const reviews = [
  {
    name: "Sudhanva S M",
    img: "/Images/ml.jpg",
    course: "Machine Learning",
    quote: "This roadmap helped me understand ML and build models."
  },
  {
    name: "Sumant Shridhar",
    img: "/Images/web.jpg",
    course: "Web development",
    quote: "I understood the concepts clearly & built my first portfolio website."
  },
  { 
    name: "Subraveti Sathvik", 
    img: "/Images/ai.jpg",
    course: "Artificial Intelligence", 
    quote: "I learned AI concepts well and created a chatbot." 
  },
  { 
    name: "Srihari S Rao", 
    img: "/Images/cs.jpg",
    course: "Cyber Security", 
    quote: "I learned essential security concepts and built my first analyzer." 
  }
];

function ScrollToTop(){
  useEffect(() => {
      window.scrollTo(0, 0)
        }, [])
}
// --- Components ---
function LoadingSpinner() {
  return (
    <div className="flex flex-col justify-center items-center h-[60vh] text-white">
      <Loader className="h-16 w-16 animate-spin text-blue-400" />
      <p className="text-lg text-gray-300 mt-4">Loading Content...</p>
    </div>
  );
}

/**
 * Navigation Bar Component
 */
function Navbar() {
  const location = useLocation(); // Hook to get the current URL path
  const activePage = location.pathname; // e.g., "/", "/roadmaps"

  const navItems = [
    { id: '/', label: 'Home', icon: Home },
    { id: '/roadmaps', label: 'Roadmaps', icon: Map },
    { id: '/learning', label: 'Learning', icon: BookOpen },
    { id: '/about', label: 'About', icon: Info },
  ];

  return (
    <nav className = "fixed bg-gray-800 flex justify-between items-center gap-16 py-3 px-10 left-1/2 -translate-x-[50%] top-[20px] rounded-full backdrop-blur-md bg-opacity-70 text-white shadow-2xl z-[100] border border-gray-700">
      {/* Logo and Title */}
      <Link to="/" className="flex items-center space-x-2 px-4 py-2 cursor-pointer">
        <BookOpen className="flex items-center translate-y-0.5 h-8 w-8  text-blue-400" />
        {/* FIXED: Renamed to CS PathFinder */}
        <span className="text-2xl font-bold text-white">SkillHub</span>
      </Link>

      {/* Main Navigation Links */}
      <div className="hidden md:flex space-x-4">
        {navItems.map((item) => (
          <Link
            key={item.id}
            to={item.id}
            className={`flex items-center space-x-3 px-4 py-2 rounded-3xl transition-all duration-200 font-medium ${
              // Check if path is active (e.g., /roadmaps or /roadmaps/web)
              (activePage.startsWith(item.id) && item.id !== '/') || (activePage === item.id)
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <item.icon className="h-7 w-7" />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Auth & Profile Buttons */}
      <div className="flex items-center space-x-5">
        <Link
          to="/login"
          className="flex items-center space-x-2 px-5 py-3 rounded-3xl text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200"
        >
          <LogIn className="h-5 w-5" />
          <span className="hidden sm:inline">Login</span>
        </Link>
        <Link
          to="/register"
          className="flex items-center space-x-2 px-4 py-2 rounded-3xl bg-blue-500 text-white hover:bg-blue-800 transition-all duration-200 shadow-md"
        >
          <UserPlus className="h-5 w-5" />
          <span className="hidden sm:inline">Register</span>
        </Link>
        <Link
          to="/profile"
          className="p-2 rounded-full text-gray-300 hover:bg-gray-700 hover:text-white"
          title="Profile"
        >
          <User className="h-5 w-5" />
        </Link>
      </div>
    </nav>
  );
}

// --- NEW: Custom Arrows for react-slick ---
function SlickNextArrow(props) {
  const { onClick } = props;
  return (
    <div
      className="absolute top-1/2 right-4 -translate-y-1/2 z-10 cursor-pointer bg-white/10 rounded-full p-2 text-white hover:bg-white/20 transition-all"
      onClick={onClick}
    >
      <ChevronRight className="h-6 w-6" />
    </div>
  );
}

function SlickPrevArrow(props) {
  const { onClick } = props;
  return (
    <div
      className="absolute top-1/2 left-4 -translate-y-1/2 z-10 cursor-pointer bg-white/10 rounded-full p-2 text-white hover:bg-white/20 transition-all"
      onClick={onClick}
    >
      <ChevronLeft className="h-6 w-6" />
    </div>
  );
}


/**
 * Home Page Component
 */
function HomePage() {
  const navigate = useNavigate(); // Hook for navigation
  ScrollToTop();
  // Settings for the react-slick carousel
  const carouselSettings = {
    dots: true, // Show dots at the bottom
    infinite: true,
    speed: 1000,
    slidesToShow: 3, // Show 3 slides by default
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    nextArrow: <SlickNextArrow />,
    prevArrow: <SlickPrevArrow />,
    // Custom dots
    appendDots: dots => (
      <div className="absolute -bottom-10 w-full">
        <ul className="m-0 flex justify-center space-x-2"> {dots} </ul>
      </div>
    ),
    customPaging: i => (
      <button className="h-3 w-3 rounded-full bg-gray-800 transition-all hover:bg-gray-400 focus:outline-none"></button>
    ),
    // Responsive settings
    responsive: [
      {
        breakpoint: 1024, // for tablets
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        }
      },
      {
        breakpoint: 640, // for mobile
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };
  // --- End Carousel Logic ---


  return (
    <div className="text-center p-10 flex flex-col items-center justify-center pt-10">
      <h1 className="text-5xl font-extrabold mb-4 text-white">Welcome to SkillHub</h1>
      <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
        Your simple guide to essential Computer Science topics. Explore curated roadmaps,
        learning resources and track your progress.
      </p>
      <div className="flex space-x-4">
        <button
          onClick={() => navigate('/roadmaps')} // Use navigate
          className="bg-blue-500 text-white px-6 py-3 rounded-full font-semibold text-lg hover:bg-blue-800  transition-all duration-300 shadow-lg"
        >
          Explore Roadmaps
        </button>
        <button
          onClick={() => navigate('/learning')} // Use navigate
          className="bg-blue-500 text-white px-6 py-3 rounded-full font-semibold text-lg hover:bg-blue-800 transition-all duration-300"
        >
          Start Learning
        </button>
      </div>

      <div className="mt-20 w-full max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-6">Why SkillHub?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-900 p-6 rounded-3xl border border-gray-800 shadow-lg">
            <Map className="h-10 w-10 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Simple Roadmaps</h3>
            <p className="text-gray-400">
              No clutter. Just clear, simple roadmaps for everyone.
            </p>
          </div>
          <div className="bg-gray-900 p-6 rounded-3xl border border-gray-800 shadow-lg">
            <TvMinimalPlay className="h-10 w-10 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Curated Learning</h3>
            <p className="text-gray-400">
              Direct links to high-quality YouTube playlists. No more searching.
            </p>
          </div>
          <div className="bg-gray-900 p-6 rounded-3xl border border-gray-800 shadow-lg">
            <ChartNoAxesCombined className="h-10 w-10 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Track Progress</h3>
            <p className="text-gray-400">
              Use your profile to see how far you've come.
            </p>
          </div>
        </div>
      </div>

      {/* How to Get Started Section */}
      <div className="mt-20 w-full max-w-5xl mx-auto text-left">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">How to Get Started?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-gray-900 p-6 rounded-3xl flex items-start space-x-4 shadow-lg">
            <div className="flex-shrink-0 bg-indigo-500/20 p-3 rounded-full">
              <ListCheck className="h-8 w-8 text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">1. Choose a Path</h3>
              <p className="text-gray-400">
                Browse our list of CS domains and select a topic you want to learn, from Web Dev to AI.
              </p>
            </div>
          </div>
          {/* Step 2 */}
          <div className="bg-gray-900 p-6 rounded-3xl  flex items-start space-x-4 shadow-lg">
            <div className="flex-shrink-0 bg-indigo-500/20 p-3 rounded-full">
              <ExternalLink className="h-8 w-8 text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">2. Follow the Steps</h3>
              <p className="text-gray-400">
                Each step includes curated links to high-quality resources like GFG, YouTube, and LeetCode.
              </p>
            </div>
          </div>
          {/* Step 3 */}
          <div className="bg-gray-900 p-6 rounded-3xl flex items-start space-x-4 shadow-lg">
            <div className="flex-shrink-0 bg-indigo-500/20 p-3 rounded-full">
              <BookmarkCheck className="h-8 w-8 text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">3. Track Your Progress</h3>
              <p className="text-gray-400">
                Check off tasks as you complete them and see your progress bar fill up on your profile page.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Roadmap Section */}
      <div className="mt-20 w-full max-w-5xl mx-auto text-left bg-gray-900 rounded-3xl border border-gray-800 p-8 md:p-12 shadow-2xl">
        <div className="md:flex items-center justify-between">
          <div className="md:w-1/2">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">Featured Roadmap</h3>
            <h2 className="text-4xl font-bold text-white mb-4">Web Development</h2>
            <p className="text-gray-400 text-lg mb-6">
              Start from the ground up. Learn HTML, CSS, JavaScript, React, and Node.js to build modern,
              full-stack web applications. This is the perfect place to begin your developer journey.
            </p>
            <button
              onClick={() => navigate('/roadmaps/web')} // Use navigate
              className="flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-full font-semibold text-lg hover:bg-blue-800 transition-all duration-300 shadow-lg"
            >
              <span>View Web Dev Roadmap</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
          <div className="hidden md:block md:w-1/3 text-center">
            <CodeXml className="h-52 w-52 text-blue-400/30" />
          </div>
        </div>
      </div>

      {/* --- Student Testimonials Carousel --- */}
      <div className="w-full max-w-6xl mx-auto mt-20">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Student Reviews</h2>
        {/* The slick-container class is used for custom dot styling in index.css */}
        <div className="slick-container">
          <Slider {...carouselSettings}>
            {/* Map over testimonials to create slides */}
            {reviews.map((d, idx) => (
              <div key={idx} className="px-3"> 
                <div className="bg-gray-900 rounded-3xl border border-gray-800 p-8 h-[375px] flex flex-col items-center text-center">
                  <img src={d.img} alt={d.name} className="h-28 w-28 rounded-full mt-7 object-cover" />
                  <div className="text-center mt-3">
                    <p className="text-2xl font-bold text-white"> {d.name} </p>
                    <p className="font-semibold text-lg text-blue-400">{d.course}</p>
                  </div> 
                  <div className="flex flex-col justify-center items-center gap-4 p-4 text-lg px-6 py-3 text-gray-300 font-medium">
                    <p>"{d.quote}"</p>
                  </div> 
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
      {/* --- End Carousel --- */}


      {/* Call to Action Section */}
      <div className="mt-20 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to Start?</h2>
        <p className="text-lg text-gray-300 mb-6">
          Jump right into a roadmap or explore a new topic.
        </p>
        <button
          onClick={() => navigate('/roadmaps')} // Use navigate
          className="bg-blue-500 text-white px-8 py-3 rounded-3xl font-semibold text-lg hover:bg-blue-800 transition-all duration-300 shadow-lg"
        >
          See All Roadmaps
        </button>
      </div>
    </div>
  );
}

/**
 * About Page Component
 */
function AboutPage() {
  ScrollToTop();
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold mb-8 mt-1 text-center text-white">About CS PathFinder</h2>
      <div className="bg-gray-900 rounded-3xl shadow-lg p-8 border border-gray-800">
        <p className="text-lg text-gray-300 mb-4">
          SkillHub is a lightweight, simplified web application designed specifically for college students. 
          The goal isn't to be the most comprehensive platform,
          but to be a simple, non-overwhelming starting point.
        </p>
        <p className="text-lg text-gray-300 mb-4">
          This project demonstrates the fundamentals of a MERN stack application (MongoDB, Express.js, React, Node.js).
          This frontend is built with React and Tailwind CSS, and it's designed to be simple to understand,
          modify, and connect to a backend API.
        </p>
        <h3 className="text-2xl font-semibold text-white mt-6 mb-3">Features</h3>
        <ul className="list-disc list-inside text-gray-300 space-y-2">
          <li>Curated CS domain roadmaps with checkpoints.</li>
          <li>A learning section with structured learning paths.</li>
          <li>Page routing handled by `react-router-dom`.</li>
          <li>Login, register, and profile pages.</li>
          <li>A clean, responsive, dark-mode UI built with Tailwind CSS.</li>
        </ul>
      </div>
    </div>
  );
}

/**
 * Roadmaps Page Component
 */
function RoadmapsPage() {
  ScrollToTop();
  const { roadmaps } = useOutletContext(); // Get data from Layout

  return (
    <div className="p-8">
      <h2 className="text-4xl font-bold mb-8 mt-1 text-center text-white">CS Domain Roadmaps</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roadmaps.map((roadmap) => {
          const IconComponent = icons[roadmap.icon] || Map;
          return (
            <Link
              key={roadmap._id}
              to={`/roadmaps/${roadmap.roadmapId}`} // Navigate to detail page URL
              className="block bg-gray-900 rounded-3xl shadow-lg p-6 border border-gray-800
                         transform transition-all duration-300 hover:scale-105 hover:shadow-blue-500/30
                         text-left w-full hover:border-blue-500"
            >
              <IconComponent className="h-12 w-12 text-blue-400 mb-4" />
              <h3 className="text-2xl font-semibold mb-2 text-white">{roadmap.title}</h3>
              <p className="text-gray-400">{roadmap.description}</p>
            </Link>
          )
        })}
      </div>
    </div>
  );
}

/**
 * Learning Section Page Component
 */
function LearningPage() {
  ScrollToTop();
  const { learningItems } = useOutletContext(); // Get data from Layout

  return (
    <div className="p-8">
      {/* FIXED: Text color for dark theme */}
      <h2 className="text-4xl font-bold mb-8 mt-1 text-center text-white">Learning Section</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {learningItems.map((item) => {
          const IconComponent = icons[item.icon] || BookOpen; // Get icon by name, fallback to BookOpen
          return (
            <Link
              key={item._id}
              to={`/learning/${item.learningId}`} // Navigate to NEW detail page URL
              className="block bg-gray-900 rounded-3xl shadow-lg p-6 border border-gray-800
                         transform transition-all duration-300 hover:scale-105 hover:shadow-blue-500/30 group"
            >
              <div className="flex items-center justify-between mb-4">
                <IconComponent className="h-10 w-10 text-blue-400" />
                <span className="text-xs font-medium text-gray-500 bg-gray-800 px-2 py-1 rounded-full">
                  {item.steps ? item.steps.length : 0} STEPS
                </span>
              </div>
              <h3 className="flex-row items-center text-2xl font-semibold text-white">{item.title}</h3>
              <p className="text-blue-400 mt-2 font-medium group-hover:underline">
                Start Learning
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// Re-usable component for rendering links (used by both detail pages)
function renderLinks(links, title) {
  return (
    <div>
      <h4 className="font-semibold text-gray-300 mb-2 mt-3">{title}</h4>
      <ol className="list-decimal space-y-2 pl-4">
        {links.map((link, i) => (
          <li key={i}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 hover:underline"
            >
              <span>{link.name}</span>
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}


/**
 * Roadmap Detail Page Component
 */
function RoadmapDetailPage() {
  ScrollToTop();
  const { roadmapId } = useParams(); // Get roadmapId from URL (e.g., "web")
  const navigate = useNavigate(); // Hook for navigation
  const { roadmaps, progressData, onToggleComplete } = useOutletContext(); // Get data from Layout

  const roadmap = roadmaps.find(r => r.roadmapId === roadmapId) || { title: 'Roadmap Not Found', steps: [] };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)} // Go back one page
        className="flex items-center space-x-2 text-blue-400 font-bold mb-8 -translate-x-44
                   hover:text-blue-300 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back</span>
      </button>

      {/* Header */}
      <h2 className="text-4xl font-bold -translate-y-14 text-center text-white">{roadmap.title}</h2>

      {/* Steps */}
      {roadmap.steps && roadmap.steps.length > 0 ? (
        <div className="space-y-6">
          {roadmap.steps.map((step) => {
            // FIXED: Unique stepId
            const stepId = `roadmap-${roadmapId}-${step.id}`;
            const isComplete = !!progressData[stepId];

            return (
              <div
                key={step.id}
                className="bg-gray-900 rounded-3xl shadow-lg p-6 border border-gray-800
                           flex items-start space-x-4 -translate-y-4"
              >
                {/* Checkbox */}
                <button
                  onClick={() => onToggleComplete(stepId)}
                  className="flex-shrink-0 mt-1"
                  title={isComplete ? "Mark as Incomplete" : "Mark as Complete"}
                >
                  {isComplete ? (
                    <CheckSquare className="h-8 w-8 text-green-500" />
                  ) : (
                    <Square className="h-8 w-8 text-gray-800" />
                  )}
                </button>
                
                {/* Content */}
                <div className="w-full">
                  <h3 className={`text-2xl font-semibold text-white mb-2 ${isComplete ? 'line-through text-gray-500' : ''}`}>
                    {step.title}
                  </h3>
                  <p className={`text-gray-400 mb-3 ${isComplete ? 'line-through text-gray-500' : ''}`}>
                    {step.description}
                  </p>
                  
                  {step.resources && renderLinks(step.resources, "Resources")}
                  {step.assignments && renderLinks(step.assignments, "Assignments")}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // Placeholder for roadmaps without data
        <div className="text-center bg-gray-900 rounded-xl p-8 border border-gray-800">
          <p className="text-gray-400 text-lg">
            This roadmap is empty. Data will be added soon.
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Learning Detail Page Component
 * Handles checkpoints for learning topics.
 */
function LearningDetailPage() {
  ScrollToTop();
  const { learningId } = useParams(); // Get learningId from URL (e.g., "os")
  const navigate = useNavigate();
  const { learningItems, progressData, onToggleComplete } = useOutletContext();

  const item = learningItems.find(i => i.learningId === learningId) || { title: 'Topic Not Found', steps: [] };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)} // Go back one page
        className="flex items-center space-x-2 text-blue-400 font-bold mb-8 -translate-x-44
                   hover:text-blue-300 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back</span>
      </button>

      {/* Header */}
      <h2 className="text-4xl font-bold -translate-y-14 mb-8 text-center text-white">{item.title}</h2>

      {/* Steps */}
      {item.steps && item.steps.length > 0 ? (
        <div className="space-y-6">
          {item.steps.map((step) => {
            // Checkpoints are tracked by "learningId-stepId"
            const stepId = `learning-${learningId}-${step.id}`;
            const isComplete = !!progressData[stepId];

            return (
              <div
                key={step.id}
                className="bg-gray-900 shadow-lg rounded-xl p-6 border border-gray-800
                           flex items-start space-x-4"
              >
                {/* Checkbox */}
                <button
                  onClick={() => onToggleComplete(stepId)}
                  className="flex-shrink-0 mt-1"
                  title={isComplete ? "Mark as Incomplete" : "Mark as Complete"}
                >
                  {isComplete ? (
                    <CheckSquare className="h-8 w-8 text-green-500" />
                  ) : (
                    <Square className="h-8 w-8 text-gray-800" />
                  )}
                </button>
                
                {/* Content */}
                <div className="w-full">
                  <h3 className={`text-2xl font-semibold text-white mb-2 ${isComplete ? 'line-through text-gray-500' : ''}`}>
                    {step.title}
                  </h3>
                  <p className={`text-gray-400 mb-3 ${isComplete ? 'line-through text-gray-500' : ''}`}>
                    {step.description}
                  </p>
                  
                  {step.resources && renderLinks(step.resources, "Resources")}
                  {step.assignments && renderLinks(step.assignments, "Quizzes & Assignments")}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center bg-gray-900 rounded-3xl p-8 border border-gray-800 -translate-y-14">
          <p className="text-gray-400 text-lg">
            This learning topic is currently empty. Please add steps to the database.
          </p>
        </div>
      )}
    </div>
  );
}


/**
 * Base component for auth forms (Login/Register)
 */
function AuthForm({ title, buttonText, isRegister = false }) {
  ScrollToTop();
  const navigate = useNavigate(); // Hook for navigation

  return (
    <div className="p-8 flex justify-center items-center">
      <div className="w-full max-w-md mt-1 bg-gray-900 rounded-3xl shadow-lg p-8 border border-gray-800">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">{title}</h2>
        <form onSubmit={(e) => e.preventDefault()}> {/* Prevents actual form submission */}
          <div className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="name">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="email">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white px-4 py-3 rounded-3xl font-semibold hover:bg-blue-800 transition-all duration-300 shadow-lg"
            >
              {buttonText}
            </button>
          </div>
        </form>
        <div className="text-center mt-6">
          <button
            onClick={() => navigate(isRegister ? '/login' : '/register')} // Use navigate
            className="text-sm text-blue-400 hover:underline"
          >
            {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Profile Page Component
 */
function ProfilePage() {
  ScrollToTop();
  const { progressData, totalSteps } = useOutletContext(); // Get data from Layout

  // Calculate progress
  const completedCount = Object.keys(progressData).length;
  const progress = totalSteps > 0 ? Math.round((completedCount / totalSteps)* 100) : 0;

  return (
    <div className="p-8 mt-1 max-w-4xl mx-auto">
      {/* FIXED: Text color for dark theme */}
      <h2 className="text-4xl font-bold mb-8 text-center text-white">Your Profile</h2>
      <div className="bg-gray-900 rounded-3xl shadow-lg p-8 border border-gray-800">
        <div className="flex items-center space-x-6 mb-8">
          <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center">
            <User className="w-12 h-12 text-white" />
          </div>
          <div>
            <h3 className="text-3xl font-semibold text-white">Student User</h3>
            <p className="text-lg text-gray-400">student.user@university.edu</p>
          </div>
        </div>
        
        <h4 className="text-2xl font-semibold text-white mb-4">Your Progress</h4>
        <p className="text-gray-300 mb-2">{completedCount} / {totalSteps} tasks completed</p>
        
        <div className="w-full bg-gray-700 rounded-full h-4 mb-4">
          <div
            className="bg-blue-500 h-4 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-right text-blue-400 font-semibold">{progress}% Complete</p>

      </div>
    </div>
  );
}

/**
 * Footer Component
 */
function Footer() {
  return (
    <footer className="text-center py-6 text-gray-400 border-t border-gray-600 mt-64">
      SkillHub - Learn smart, follow simple, master more.
    </footer>
  );
}

/**
 * Layout Component
 * This component wraps all pages, holds the state and data fetching,
 * and passes it down to the child pages via <Outlet />
 */
function Layout() {
  // State for progress
  const [progressData, setProgressData] = useState({});
  
  // State for API data
  const [roadmaps, setRoadmaps] = useState([]);
  const [learningItems, setLearningItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // useEffect to fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch roadmaps and learning items in parallel
        const [roadmapsRes, learningRes] = await Promise.all([
          fetch('http://localhost:5000/api/content/roadmaps'),
          fetch('http://localhost:5000/api/content/learning') // FIXED: Use new endpoint
        ]);
        
        const roadmapsData = await roadmapsRes.json();
        const learningData = await learningRes.json();
        
        setRoadmaps(roadmapsData);
        setLearningItems(learningData);

      } catch (error)
 {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Runs once on load

  // Handler to toggle a step's completion
  const handleToggleComplete = (stepId) => {

    setProgressData(prev => {
      const newProgress = { ...prev };
      if (newProgress[stepId]) {
        delete newProgress[stepId];
      } else {
        newProgress[stepId] = true;
      }
      return newProgress;
    });
  };
  
  const totalRoadmapSteps = roadmaps.reduce((acc, roadmap) => acc + (roadmap.steps ? roadmap.steps.length : 0), 0);
  const totalLearningSteps = learningItems.reduce((acc, item) => acc + (item.steps ? item.steps.length : 0), 0);
  const totalSteps = totalRoadmapSteps + totalLearningSteps;

  return (
    <div className="min-h-screen bg-black text-white font-sans"
         style = {{
           backgroundImage: `
           linear-gradient(to right, rgba(255,255,255,0.12) 1px, transparent 1px),
           linear-gradient(to bottom, rgba(255,255,255,0.12) 1px, transparent 1px)
           `,
           backgroundSize: "3rem 3rem", // Grid size
         }}>
      <Navbar />
      <main className="container mx-auto px-6 py-8 pt-28">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          // <Outlet /> renders the active page (e.g., HomePage, AboutPage)
          // We pass all state down through the "context" prop
          <Outlet context={{ 
            roadmaps, 
            learningItems, 
            progressData, 
            onToggleComplete: handleToggleComplete, // Correctly pass the function
            totalSteps 
          }} />
        )}
      </main>
      <Footer />
    </div>
  );
}

/**
 * Main App Component
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* The Layout component wraps all pages */}
        <Route path="/" element={<Layout />}>
          {/* "index" means this is the default route for "/" */}
          <Route index element={<HomePage />} />
          
          <Route path="about" element={<AboutPage />} />
          <Route path="roadmaps" element={<RoadmapsPage />} />
          <Route path="roadmaps/:roadmapId" element={<RoadmapDetailPage />} /> {/* Dynamic route */}
          
          {/* NEW: Routes for Learning Checkpoints */}
          <Route path="learning" element={<LearningPage />} />
          <Route path="learning/:learningId" element={<LearningDetailPage />} /> {/* Dynamic route */}

          <Route path="login" element={<AuthForm title="Login" buttonText="Login" isRegister={false} />} />
          <Route path="register" element={<AuthForm title="Register" buttonText="Create Account" isRegister={true} />} />
          <Route path="profile" element={<ProfilePage />} />
          
          {/* Fallback route - if no other route matches, go home */}
          <Route path="*" element={<HomePage />} /> 
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
