import React, { useState, useEffect } from 'react';
import { 
  Home, User, Trophy, Image as ImageIcon, Search, Bell, LogOut, 
  ChevronRight, Play, CheckCircle2, Star, Menu, X, ArrowLeft, 
  Settings, HelpCircle, BookOpen, MessageCircle, PenLine, Cpu,
  Layers, Move, Info, ChevronDown, ChevronUp, Sparkles, Package
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster, toast } from 'sonner';
import confetti from 'canvas-confetti';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { MOCK_USER, MOCK_COURSES, MOCK_GALLERY, MOCK_LEADERBOARD, STEMBOTS, MOCK_CARDS, MOCK_CARD_PACKS } from './data/mock';
import { Course, Module, User as UserType, LessonContent, STEMbot, TopicTag, Card, CardPack } from './types';
import { ImageWithFallback } from './components/figma/ImageWithFallback';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Atom Icon Component
function AtomIcon({ size = 20, className = "" }: { size?: number, className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <circle cx="12" cy="12" r="1" fill="currentColor" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4" />
    </svg>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'profile' | 'leaderboard' | 'gallery' | 'cards' | 'lesson'>('home');
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserType>(MOCK_USER);
  const [userCards, setUserCards] = useState<string[]>([]);

  const handleLogin = (username: string) => {
    setUser({ ...user, username });
    setIsLoggedIn(true);
    toast.success(`Welcome back, ${username}!`);
  };

  const handleEarnXP = (amount: number) => {
    const newXP = user.xp + amount;
    const newLevel = Math.floor(newXP / 1000) + 1;
    if (newLevel > user.level) {
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      toast.success(`LEVEL UP! You are now Level ${newLevel}!`);
    } else {
      toast.success(`+${amount} XP Earned!`);
    }
    setUser(prev => ({ ...prev, xp: newXP, level: newLevel }));
  };

  const handleEarnAtoms = (amount: number) => {
    setUser(prev => ({ ...prev, atoms: prev.atoms + amount }));
    toast.success(`+${amount} Atoms Earned! ⚛️`);
  };

  const handleUpdateAvatar = (avatar: string) => {
    setUser(prev => ({ ...prev, avatar }));
    toast.success('Avatar updated!');
  };

  if (!isLoggedIn) return <LoginScreen onLogin={handleLogin} />;

  if (currentPage === 'lesson' && selectedModule) {
    return (
      <LessonView 
        module={selectedModule} 
        onBack={() => setCurrentPage('home')} 
        onEarnXP={handleEarnXP}
        onEarnAtoms={handleEarnAtoms}
        user={user}
      />
    );
  }

  return (
    <div className="min-h-screen bg-amber-50/30 flex flex-col">
      <Toaster position="top-center" />

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 pb-24">
        {/* Top Progress Bar Row */}
        <header className="bg-white rounded-3xl border-2 border-amber-200 p-6 mb-8 flex flex-col md:flex-row items-center gap-6 shadow-lg shadow-amber-100">
          <div className="flex items-center gap-4 min-w-[120px]">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
              {user.level}
            </div>
            <div>
              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Level</p>
              <p className="text-lg font-bold text-slate-900 leading-none">Explorer</p>
            </div>
          </div>
          
          <div className="flex-1 w-full">
            <div className="flex justify-between items-end mb-2">
              <p className="text-sm font-bold text-slate-600">Level Progress</p>
              <p className="text-xs font-bold text-amber-600">
                {user.xp % 1000} / 1000 XP • {1000 - (user.xp % 1000)} XP to Lvl {user.level + 1}
              </p>
            </div>
            <div className="w-full h-4 bg-amber-100 rounded-full overflow-hidden border-2 border-amber-200">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(user.xp % 1000) / 10}%` }}
                className="h-full bg-gradient-to-r from-amber-400 to-amber-600 relative"
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </motion.div>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="flex flex-col items-end">
              <span className="text-xs font-bold text-slate-400 uppercase">Total XP</span>
              <span className="text-xl font-black text-slate-900">{user.xp}</span>
            </div>
            <div className="p-3 bg-amber-100 rounded-xl text-amber-600 border-2 border-amber-200">
              <Star size={24} className="fill-amber-500" />
            </div>

            <div className="h-10 w-px bg-amber-200"></div>

            <div className="flex flex-col items-end">
              <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
                <AtomIcon size={12} /> Atoms
              </span>
              <span className="text-xl font-black text-amber-600">{user.atoms}</span>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl text-blue-600 border-2 border-blue-200">
              <AtomIcon size={24} />
            </div>
          </div>
        </header>

        {currentPage === 'home' && (
          <Dashboard 
            courses={MOCK_COURSES} 
            onSelectModule={(module) => {
              setSelectedModule(module);
              setCurrentPage('lesson');
            }}
            username={user.username}
          />
        )}
        {currentPage === 'profile' && <Profile user={user} onUpdateAvatar={handleUpdateAvatar} />}
        {currentPage === 'leaderboard' && <Leaderboard entries={MOCK_LEADERBOARD} currentUser={user} />}
        {currentPage === 'gallery' && <Gallery posts={MOCK_GALLERY} />}
        {currentPage === 'cards' && (
          <CardAlbum 
            cards={MOCK_CARDS} 
            packs={MOCK_CARD_PACKS} 
            userCards={userCards}
            userAtoms={user.atoms}
            onBuyPack={(pack) => {
              if (user.atoms >= pack.cost) {
                setUser(prev => ({ ...prev, atoms: prev.atoms - pack.cost }));
                const newCards = MOCK_CARDS.slice(0, pack.cardsCount).map(c => c.id);
                setUserCards(prev => [...prev, ...newCards]);
                confetti({ particleCount: 100, spread: 70 });
                toast.success(`Opened ${pack.name}! Check your collection!`);
              } else {
                toast.error('Not enough Atoms!');
              }
            }}
          />
        )}
      </main>

      {/* Bottom Navigation - Always visible */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-amber-200 flex justify-around p-4 z-50 shadow-2xl shadow-amber-100">
        <BottomNavItem icon={<Home size={24} />} label="Home" active={currentPage === 'home'} onClick={() => setCurrentPage('home')} />
        <BottomNavItem icon={<User size={24} />} label="Profile" active={currentPage === 'profile'} onClick={() => setCurrentPage('profile')} />
        <BottomNavItem icon={<Package size={24} />} label="Cards" active={currentPage === 'cards'} onClick={() => setCurrentPage('cards')} />
        <BottomNavItem icon={<Trophy size={24} />} label="Leaders" active={currentPage === 'leaderboard'} onClick={() => setCurrentPage('leaderboard')} />
        <BottomNavItem icon={<ImageIcon size={24} />} label="Gallery" active={currentPage === 'gallery'} onClick={() => setCurrentPage('gallery')} />
      </nav>
    </div>
  );
}

// Sub-components

function BottomNavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick} 
      className={cn(
        "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-[70px]",
        active ? "bg-amber-100 text-amber-600" : "text-slate-400 hover:text-slate-600"
      )}
    >
      {icon}
      <span className="text-xs font-bold">{label}</span>
    </button>
  );
}

function LoginScreen({ onLogin }: { onLogin: (name: string) => void }) {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');

  const handleSubmit = () => {
    if (username.trim() && pin.length === 4) {
      onLogin(username);
    } else {
      toast.error('Please enter username and 4-digit PIN');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="bg-white rounded-3xl p-8 md:p-12 w-full max-w-md shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center text-white font-bold text-4xl mx-auto mb-4 shadow-xl">SA</div>
          <h2 className="text-3xl font-bold text-slate-900">STEMulate Academy</h2>
          <p className="text-slate-500">Your STEM journey awaits!</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-sm font-bold text-slate-600 mb-2 block">Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="Enter your username" 
              className="w-full px-4 py-4 rounded-2xl border-2 border-amber-200 focus:border-amber-500 focus:outline-none transition-all font-bold bg-amber-50/50"
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-600 mb-2 block">4-Digit PIN</label>
            <input 
              type="password" 
              value={pin} 
              onChange={(e) => e.target.value.length <= 4 && setPin(e.target.value)} 
              placeholder="••••" 
              className="w-full px-4 py-4 rounded-2xl border-2 border-amber-200 focus:border-amber-500 focus:outline-none transition-all font-bold text-center text-2xl tracking-[1em] bg-amber-50/50"
              maxLength={4}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>

          <button 
            disabled={!username.trim() || pin.length !== 4} 
            onClick={handleSubmit}
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-2xl font-bold text-lg hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSignup ? 'Create Account' : 'Sign In'}
          </button>

          <p className="text-center text-sm text-slate-500">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button 
              onClick={() => setIsSignup(!isSignup)} 
              className="text-amber-600 font-bold hover:underline"
            >
              {isSignup ? 'Sign In' : 'Create One'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function Dashboard({ courses, onSelectModule, username }: { courses: Course[], onSelectModule: (module: Module) => void, username: string }) {
  const [expandedCourse, setExpandedCourse] = useState<string | null>(courses[0].id);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<string | null>(null);
  const [subjectFilter, setSubjectFilter] = useState<string | null>(null);

  const greetingTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-amber-500 to-yellow-500 rounded-3xl p-8 text-white shadow-xl">
        <h2 className="text-3xl font-black mb-2">{greetingTime()}, {username}! 👋</h2>
        <p className="text-amber-100 text-lg font-medium">Ready to explore the world of STEM today?</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-amber-500" size={24} />
          <input 
            type="text" 
            placeholder="Search for modules, topics, or lessons..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-16 pr-6 py-6 bg-white border-2 border-amber-200 rounded-3xl focus:ring-4 focus:ring-amber-200 outline-none font-bold text-lg shadow-lg"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Level:</span>
            <select 
              value={levelFilter || ''} 
              onChange={(e) => setLevelFilter(e.target.value || null)}
              className="px-4 py-2 rounded-xl border-2 border-amber-200 bg-white text-sm font-bold focus:ring-2 focus:ring-amber-300 outline-none cursor-pointer"
            >
              <option value="">All</option>
              <option value="p1">Primary 1</option>
              <option value="p2">Primary 2</option>
              <option value="p3">Primary 3</option>
              <option value="p4">Primary 4</option>
              <option value="p5">Primary 5</option>
              <option value="p6">Primary 6</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Subject:</span>
            <select 
              value={subjectFilter || ''} 
              onChange={(e) => setSubjectFilter(e.target.value || null)}
              className="px-4 py-2 rounded-xl border-2 border-amber-200 bg-white text-sm font-bold focus:ring-2 focus:ring-amber-300 outline-none cursor-pointer"
            >
              <option value="">All</option>
              <option value="Science">Science</option>
              <option value="Technology">Technology</option>
              <option value="Engineering">Engineering</option>
              <option value="Mathematics">Mathematics</option>
            </select>
          </div>
        </div>
      </div>

      {/* Course Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {courses.map((course) => (
          <button 
            key={course.id}
            onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}
            className={cn(
              "p-6 rounded-3xl border-2 transition-all text-left flex flex-col gap-4 group shadow-lg",
              expandedCourse === course.id 
                ? "bg-white border-amber-400 ring-4 ring-amber-200" 
                : "bg-white border-amber-200 hover:border-amber-300"
            )}
          >
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg", course.color)}>
              <Layers size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">{course.title}</h3>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{course.modules.length} Modules</p>
            </div>
            <div className="mt-auto flex justify-between items-center">
              <span className="text-[10px] font-bold text-amber-500">EXPLORE</span>
              {expandedCourse === course.id ? <ChevronUp size={16} className="text-amber-600" /> : <ChevronDown size={16} className="text-amber-600" />}
            </div>
          </button>
        ))}
      </div>

      {/* Expanded Course - Adventure Map */}
      <AnimatePresence mode="wait">
        {expandedCourse && (
          <motion.div 
            key={expandedCourse}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-2 bg-amber-500 rounded-full"></div>
              <h2 className="text-2xl font-bold text-slate-900">
                {courses.find(c => c.id === expandedCourse)?.title}
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {courses.find(c => c.id === expandedCourse)?.modules
                .filter(m => {
                  const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                       m.tags?.some(t => t.label.toLowerCase().includes(searchQuery.toLowerCase()));
                  const matchesSubject = !subjectFilter || m.tags?.some(t => t.subject === subjectFilter);
                  return matchesSearch && matchesSubject;
                })
                .map((module, moduleIdx) => (
                <motion.div 
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: moduleIdx * 0.1 }}
                  className="bg-white rounded-3xl overflow-hidden border-2 border-amber-200 shadow-xl hover:shadow-2xl transition-all flex flex-col"
                >
                  {/* Module Header */}
                  <div className="aspect-video w-full overflow-hidden relative">
                    <img src={module.thumbnail} alt={module.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Module {moduleIdx + 1}</p>
                      <h4 className="font-bold text-xl leading-tight">{module.title}</h4>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <p className="text-sm text-slate-500 mb-4">{module.description}</p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(module.tags || []).map(tag => (
                        <span key={tag.id} className="text-[10px] font-black bg-amber-50 text-amber-600 border border-amber-200 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                          {tag.label}
                        </span>
                      ))}
                    </div>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                        <span>Progress</span>
                        <span>{module.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-amber-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-amber-400 to-amber-600" style={{ width: `${module.progress}%` }}></div>
                      </div>
                    </div>

                    {/* Adventure Map - Lesson Previews */}
                    {module.contents.length > 0 && (
                      <div className="mt-auto">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedModule(expandedModule === module.id ? null : module.id);
                          }}
                          className="w-full py-3 bg-amber-100 text-amber-700 rounded-xl font-bold hover:bg-amber-200 transition-colors flex items-center justify-between px-4 mb-3"
                        >
                          <span className="flex items-center gap-2">
                            <Map size={16} /> View Adventure Map
                          </span>
                          {expandedModule === module.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>

                        <AnimatePresence>
                          {expandedModule === module.id && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="space-y-2 overflow-hidden"
                            >
                              {module.contents.slice(0, 3).map((lesson, idx) => (
                                <div 
                                  key={lesson.id}
                                  className="bg-gradient-to-r from-amber-50 to-yellow-50 p-3 rounded-xl border border-amber-200 flex items-center gap-3"
                                >
                                  <div className={cn(
                                    "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0",
                                    lesson.completed ? "bg-green-500 text-white" : "bg-white text-amber-600 border-2 border-amber-300"
                                  )}>
                                    {lesson.completed ? '✓' : idx + 1}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-slate-700 truncate">{lesson.title}</p>
                                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold">
                                      <span className="uppercase">{lesson.type}</span>
                                      <span>•</span>
                                      <span className="flex items-center gap-1">
                                        <Star size={10} className="fill-amber-500 text-amber-500" /> {lesson.xp} XP
                                      </span>
                                      {lesson.type === 'video' && (
                                        <>
                                          <span>•</span>
                                          <span className="flex items-center gap-1">
                                            <AtomIcon size={10} /> 10 Atoms
                                          </span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectModule(module);
                          }}
                          className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-bold hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg flex items-center justify-center gap-2 mt-3"
                        >
                          Start Learning <ChevronRight size={18} />
                        </button>
                      </div>
                    )}

                    {module.contents.length === 0 && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.info('Coming soon!');
                        }}
                        className="w-full py-3 bg-slate-100 text-slate-400 rounded-xl font-bold mt-auto"
                      >
                        Coming Soon
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Map icon for adventure map
function Map({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
      <line x1="9" y1="3" x2="9" y2="18" />
      <line x1="15" y1="6" x2="15" y2="21" />
    </svg>
  );
}

function LessonView({ module, onBack, onEarnXP, onEarnAtoms, user }: { 
  module: Module, 
  onBack: () => void, 
  onEarnXP: (xp: number) => void,
  onEarnAtoms: (atoms: number) => void,
  user: UserType
}) {
  const [activeContentIdx, setActiveContentIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<'learn' | 'notes' | 'qa'>('learn');
  const activeContent = module.contents[activeContentIdx];

  const handleNext = () => {
    if (activeContentIdx < module.contents.length - 1) {
      if (!module.contents[activeContentIdx].completed) {
        onEarnXP(module.contents[activeContentIdx].xp);
        // Award atoms for video completion
        if (module.contents[activeContentIdx].type === 'video') {
          onEarnAtoms(10);
        }
      }
      setActiveContentIdx(activeContentIdx + 1);
      setActiveTab('learn');
    } else {
      onBack();
      toast.success("Module Completed! You're a STEM Star! ⭐");
    }
  };

  if (!activeContent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <div className="text-center">
          <h2 className="text-2xl font-black text-slate-900 mb-4">Module coming soon!</h2>
          <button onClick={onBack} className="bg-amber-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg">Back to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row relative pb-20 md:pb-0">
      <Toaster position="top-center" />
      
      {/* Sidebar - Outline */}
      <aside className="w-full md:w-80 bg-amber-50/50 border-r-2 border-amber-200 overflow-y-auto flex flex-col h-auto md:h-screen sticky top-0">
        <div className="p-6 border-b-2 border-amber-200 bg-white">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-amber-600 transition-colors mb-4 text-sm font-bold">
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
          <h2 className="text-xl font-black text-slate-900 leading-tight">{module.title}</h2>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 h-2 bg-amber-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-400 to-amber-600" style={{ width: `${module.progress}%` }}></div>
            </div>
            <span className="text-xs font-bold text-amber-600">{module.progress}%</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {module.contents.map((content, idx) => (
            <button 
              key={content.id}
              onClick={() => { setActiveContentIdx(idx); setActiveTab('learn'); }}
              className={cn(
                "w-full flex items-center gap-3 p-4 rounded-2xl transition-all text-left group",
                activeContentIdx === idx ? "bg-white shadow-md ring-2 ring-amber-200" : "hover:bg-white/50"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-bold",
                content.completed ? "bg-green-100 text-green-600" : "bg-white text-slate-400 border-2 border-amber-200"
              )}>
                {content.completed ? <CheckCircle2 size={18} /> : (idx + 1)}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className={cn(
                  "text-sm font-bold truncate",
                  activeContentIdx === idx ? "text-amber-600" : "text-slate-700"
                )}>
                  {content.title}
                </p>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase font-black tracking-widest">
                  <span>{content.type}</span>
                  {content.duration && <><span>•</span><span>{content.duration}</span></>}
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Star size={10} /> {content.xp}
                  </span>
                  {content.type === 'video' && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-blue-500">
                        <AtomIcon size={10} /> 10
                      </span>
                    </>
                  )}
                </div>
              </div>
              {activeContentIdx === idx && <div className="w-2 h-2 rounded-full bg-amber-600"></div>}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Player Area */}
      <main className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 border-b-2 border-amber-100 flex items-center justify-between px-8 bg-white/80 backdrop-blur sticky top-0 z-10">
          <div className="flex gap-1 bg-amber-100 p-1 rounded-2xl">
            <TabButton active={activeTab === 'learn'} icon={<Play size={16} />} label="Learn" onClick={() => setActiveTab('learn')} />
            <TabButton active={activeTab === 'notes'} icon={<PenLine size={16} />} label="Notes" onClick={() => setActiveTab('notes')} />
            <TabButton active={activeTab === 'qa'} icon={<MessageCircle size={16} />} label="Ask" onClick={() => setActiveTab('qa')} />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-bold text-amber-600 bg-amber-50 px-4 py-2 rounded-full border-2 border-amber-200">
              <Star size={16} fill="currentColor" /> {activeContent?.xp} XP
            </div>
            {activeContent?.type === 'video' && (
              <div className="flex items-center gap-2 text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-full border-2 border-blue-200">
                <AtomIcon size={16} /> 10 Atoms
              </div>
            )}
          </div>
        </header>

        <div className="flex-1 p-4 md:p-12 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {activeTab === 'learn' && (
              <div className="space-y-8">
                {/* STEMbot Intro Card */}
                <div className="bg-white rounded-3xl p-6 border-2 border-amber-200 flex flex-col sm:flex-row items-center gap-6 shadow-lg">
                  <img src={STEMBOTS.sophia.avatar} alt="Sophia" className="w-20 h-20 bg-blue-50 rounded-2xl p-2 shrink-0 border-2 border-blue-200" />
                  <div>
                    <h4 className="font-black text-blue-600 text-lg mb-1">Hi, I'm Sophia!</h4>
                    <p className="text-slate-600 text-sm leading-relaxed font-medium">
                      Today we're exploring <span className="text-amber-600 font-bold">{activeContent?.title}</span>. Pay close attention to the science concepts!
                    </p>
                  </div>
                </div>

                {activeContent?.type === 'video' && (
                  <div className="space-y-6">
                    <div className="aspect-video w-full bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl relative group ring-4 ring-amber-200">
                      <ImageWithFallback src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80" className="w-full h-full object-cover opacity-60" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button className="w-24 h-24 bg-amber-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all">
                          <Play size={40} fill="white" className="ml-1" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-white p-6 rounded-3xl border-2 border-amber-200 shadow-lg">
                      <div>
                        <h2 className="text-2xl font-black text-slate-900">{activeContent.title}</h2>
                        <p className="text-slate-500 font-medium">
                          Earn <span className="text-amber-600 font-bold">{activeContent.xp} XP</span> and <span className="text-blue-600 font-bold flex items-center gap-1 inline-flex"><AtomIcon size={14} /> 10 Atoms</span>!
                        </p>
                      </div>
                      <button onClick={handleNext} className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-2xl font-black hover:from-amber-600 hover:to-amber-700 transition-all shadow-xl">
                        Next Step
                      </button>
                    </div>
                  </div>
                )}

                {activeContent?.type === 'quiz' && (
                  <div className="max-w-2xl mx-auto space-y-8 py-10">
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Star size={40} className="fill-amber-600" />
                      </div>
                      <h2 className="text-3xl font-black text-slate-900">{activeContent.title}</h2>
                    </div>
                    
                    <div className="bg-white p-8 rounded-[2.5rem] border-2 border-amber-200 shadow-xl space-y-6">
                      <p className="text-xl font-bold text-slate-800">1. {activeContent.quizQuestions?.[0]?.question || "Ready to start?"}</p>
                      <div className="space-y-3">
                        {activeContent.quizQuestions?.[0]?.options.map((opt, i) => (
                          <button key={i} className="w-full p-5 bg-white border-2 border-amber-200 rounded-2xl text-left font-bold hover:border-amber-500 hover:bg-amber-50 transition-all flex items-center justify-between group">
                            {opt}
                            <div className="w-6 h-6 rounded-full border-2 border-amber-300 group-hover:border-amber-600 group-hover:bg-amber-600"></div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <button onClick={handleNext} className="w-full py-5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-2xl font-black text-lg hover:from-amber-600 hover:to-amber-700 transition-all shadow-xl">
                      Submit Quiz
                    </button>
                  </div>
                )}

                {activeContent?.type === 'summary' && (
                  <div className="max-w-2xl mx-auto space-y-8 py-10">
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <BookOpen size={40} />
                      </div>
                      <h2 className="text-3xl font-black text-slate-900">{activeContent.title}</h2>
                    </div>
                    
                    <div className="bg-white p-10 rounded-[2.5rem] border-2 border-amber-200 shadow-xl relative">
                      <div className="absolute -top-4 -left-4 bg-amber-600 text-white px-4 py-1 rounded-lg font-black text-[10px] uppercase tracking-widest">SUMMARY</div>
                      <p className="text-xl text-slate-700 leading-relaxed font-bold">
                        {activeContent.summaryText || "Keep this summary for your notes!"}
                      </p>
                    </div>

                    <button onClick={handleNext} className="w-full py-5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-2xl font-black text-lg shadow-xl">
                      Continue
                    </button>
                  </div>
                )}

                {activeContent?.type === 'simulation' && (
                  <SimulationView simulation={{ title: activeContent.title, description: "Balance the circuit to win!" }} onComplete={handleNext} />
                )}

                {activeContent?.type === 'activity' && (
                  <div className="space-y-8">
                    <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
                      <div className="relative z-10 max-w-lg">
                        <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block">Hands-on Lab</span>
                        <h2 className="text-4xl font-black mb-4">{activeContent.title}</h2>
                        <p className="text-amber-100 text-lg mb-8 font-medium">Build your project and upload to gallery for bonus points!</p>
                        <button className="flex items-center gap-2 bg-white text-amber-600 px-6 py-3 rounded-xl font-black hover:bg-amber-50 transition-colors">
                          <Play size={20} fill="currentColor" /> Watch Demo
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button onClick={handleNext} className="px-12 py-5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-2xl font-black shadow-xl">
                        Finish Module
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="bg-white rounded-[2.5rem] p-10 border-2 border-amber-200 shadow-lg min-h-[500px] flex flex-col">
                <h3 className="text-2xl font-black text-slate-900 mb-8">Lesson Notes</h3>
                <textarea className="flex-1 w-full p-6 bg-amber-50 rounded-3xl border-2 border-amber-200 focus:ring-4 focus:ring-amber-200 text-slate-700 font-bold text-lg resize-none outline-none" placeholder="What did you learn today?" />
              </div>
            )}

            {activeTab === 'qa' && (
              <div className="bg-white rounded-[2.5rem] p-10 border-2 border-amber-200 shadow-lg min-h-[500px] flex flex-col">
                <h3 className="text-2xl font-black text-slate-900 mb-8">Ask the STEMbots</h3>
                <div className="flex-1 space-y-4 mb-6">
                  <div className="flex gap-4">
                    <img src={STEMBOTS.sophia.avatar} className="w-10 h-10 bg-blue-50 rounded-xl" />
                    <div className="bg-amber-50 p-4 rounded-2xl rounded-tl-none border-2 border-amber-200 max-w-[80%]">
                      <p className="text-sm font-black text-blue-600 mb-1">Sophia says:</p>
                      <p className="text-slate-700 font-bold">Ask me anything about this lesson!</p>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <input type="text" placeholder="Your question..." className="w-full pl-6 pr-16 py-5 bg-amber-50 rounded-2xl border-2 border-amber-200 font-bold outline-none focus:ring-4 focus:ring-amber-200" />
                  <button className="absolute right-3 top-3 bottom-3 bg-amber-600 text-white px-4 rounded-xl hover:bg-amber-700"><ChevronRight /></button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function SimulationView({ simulation, onComplete }: { simulation: any, onComplete: () => void }) {
  const [sliderVal, setSliderVal] = useState(50);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (sliderVal > 90) setIsSuccess(true);
    else setIsSuccess(false);
  }, [sliderVal]);

  return (
    <div className="space-y-8">
      <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden border-8 border-slate-800 shadow-2xl">
        <div className="absolute top-8 left-8 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
          <span className="text-white text-[10px] font-black uppercase tracking-[0.2em]">Live Simulation</span>
        </div>

        <div className="relative z-10 w-full max-w-md text-center">
          <h3 className="text-3xl font-black text-white mb-4">{simulation.title}</h3>
          <p className="text-slate-400 mb-12">{simulation.description}</p>
          
          <div className="relative h-48 w-48 mx-auto mb-12 bg-slate-800 rounded-3xl flex items-end justify-center overflow-hidden border-4 border-slate-700">
            <motion.div 
              animate={{ height: `${20 + sliderVal * 0.7}%` }}
              className={cn("w-32 rounded-t-xl transition-colors duration-300", isSuccess ? "bg-green-500" : "bg-red-500")}
            >
              <div className="w-full h-8 bg-black/20"></div>
            </motion.div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-widest">
              <span>Low Power</span>
              <span>High Power</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={sliderVal}
              onChange={(e) => setSliderVal(parseInt(e.target.value))}
              className="w-full h-3 bg-slate-800 rounded-full appearance-none cursor-pointer accent-amber-500"
            />
          </div>
        </div>

        <AnimatePresence>
          {isSuccess && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="absolute inset-0 bg-green-500/10 backdrop-blur-sm flex items-center justify-center z-20"
            >
              <div className="bg-white p-8 rounded-3xl shadow-2xl text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <h4 className="text-2xl font-black text-slate-900 mb-2">Circuit Powered!</h4>
                <p className="text-slate-600 mb-6">Excellent job!</p>
                <button onClick={onComplete} className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700">Next Lesson</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function TabButton({ active, icon, label, onClick }: { active: boolean, icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all",
        active ? "bg-white text-amber-600 shadow-md" : "text-slate-500 hover:text-slate-700"
      )}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function Profile({ user, onUpdateAvatar }: { user: UserType, onUpdateAvatar: (avatar: string) => void }) {
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  
  const avatarOptions = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Leo",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Mia",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Max",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe"
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-[2.5rem] p-10 border-2 border-amber-200 shadow-xl flex flex-col md:flex-row items-center gap-10">
        <div className="relative shrink-0">
          <div className="w-40 h-40 rounded-full overflow-hidden ring-8 ring-amber-100 bg-slate-100 shadow-inner">
            <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <button 
            onClick={() => setIsEditingAvatar(!isEditingAvatar)}
            className="absolute -bottom-2 -right-2 bg-amber-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-black border-4 border-white shadow-lg hover:bg-amber-700 transition-all"
          >
            ✏️
          </button>
        </div>
        
        <div className="text-center md:text-left flex-1">
          <div className="flex flex-col md:flex-row items-center gap-4 mb-2">
            <h2 className="text-4xl font-black text-slate-900">{user.username}</h2>
            <span className="bg-amber-600 text-white px-3 py-1 rounded-lg text-xs font-black uppercase">Level {user.level} Explorer</span>
          </div>
          <p className="text-slate-500 font-medium mb-8 text-lg">STEMulate Academy Member since March 2026</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <StatsCard label="TOTAL XP" value={user.xp.toLocaleString()} />
            <StatsCard label="ATOMS" value={user.atoms.toString()} icon={<AtomIcon size={16} />} />
            <StatsCard label="BADGES" value={user.badges.length.toString()} />
          </div>
        </div>
      </div>

      {/* Avatar Customization */}
      <AnimatePresence>
        {isEditingAvatar && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-3xl p-8 border-2 border-amber-200 shadow-xl overflow-hidden"
          >
            <h3 className="text-2xl font-black text-slate-900 mb-6">Choose Your Avatar</h3>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
              {avatarOptions.map((avatar, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onUpdateAvatar(avatar);
                    setIsEditingAvatar(false);
                  }}
                  className={cn(
                    "w-full aspect-square rounded-2xl border-4 transition-all hover:scale-110",
                    user.avatar === avatar ? "border-amber-500 ring-4 ring-amber-200" : "border-amber-200 hover:border-amber-400"
                  )}
                >
                  <img src={avatar} alt={`Avatar ${idx + 1}`} className="w-full h-full object-cover rounded-xl" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section>
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-black text-slate-900">Hall of Achievement</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
          {user.badges.map((badge) => (
            <div key={badge.id} className="bg-white p-6 rounded-3xl border-2 border-amber-200 flex flex-col items-center gap-4 text-center group hover:border-amber-500 transition-all shadow-lg hover:shadow-xl">
              <span className="text-5xl group-hover:scale-110 transition-transform">{badge.icon}</span>
              <div>
                <p className="text-sm font-black text-slate-900">{badge.name}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Earned {badge.earnedAt}</p>
              </div>
            </div>
          ))}
          {[1, 2].map((i) => (
            <div key={i} className="bg-amber-50 p-6 rounded-3xl border-2 border-dashed border-amber-200 flex flex-col items-center justify-center gap-2 grayscale opacity-40">
              <span className="text-4xl">🔒</span>
              <p className="text-xs font-bold text-slate-400">Locked</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatsCard({ label, value, icon }: { label: string, value: string, icon?: React.ReactNode }) {
  return (
    <div className="bg-white px-6 py-4 rounded-2xl border-2 border-amber-200 shadow-md min-w-[120px]">
      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1 flex items-center gap-1">
        {icon} {label}
      </p>
      <p className="text-2xl font-black text-amber-600">{value}</p>
    </div>
  );
}

function Leaderboard({ entries, currentUser }: { entries: any[], currentUser: UserType }) {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-[2.5rem] border-2 border-amber-200 shadow-xl overflow-hidden">
        <div className="p-8 bg-gradient-to-r from-amber-500 to-amber-600 text-white flex items-center justify-between">
          <div>
            <h3 className="text-3xl font-black">Top Explorers</h3>
            <p className="text-amber-100 font-medium">Weekly Global Ranking</p>
          </div>
          <Trophy size={48} className="text-white/20" />
        </div>
        <div className="divide-y-2 divide-amber-100">
          {entries.map((entry) => (
            <div key={entry.id} className={cn("flex items-center gap-6 p-6 transition-colors", entry.username === currentUser.username ? "bg-amber-50" : "hover:bg-amber-50/50")}>
              <div className="w-10 flex justify-center shrink-0">
                {entry.rank === 1 && <span className="text-3xl">🥇</span>}
                {entry.rank === 2 && <span className="text-3xl">🥈</span>}
                {entry.rank === 3 && <span className="text-3xl">🥉</span>}
                {entry.rank > 3 && <span className="font-black text-slate-400 text-xl">#{entry.rank}</span>}
              </div>
              <div className="w-16 h-16 rounded-full bg-amber-100 overflow-hidden ring-4 ring-white shadow-md">
                <img src={entry.avatar} alt={entry.username} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-lg font-black text-slate-900">{entry.username}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">Level {Math.floor(entry.xp / 1000) + 1}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-slate-900">{entry.xp.toLocaleString()}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Points</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Gallery({ posts }: { posts: any[] }) {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
      {posts.map((post) => (
        <motion.div key={post.id} className="break-inside-avoid bg-white rounded-3xl border-2 border-amber-200 shadow-lg overflow-hidden hover:shadow-2xl transition-all group">
          <div className="relative">
            <img src={post.imageUrl} alt={post.caption} className="w-full h-auto object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-6 text-center">
              <p className="text-white font-bold mb-4">{post.caption}</p>
              <button className="bg-white text-slate-900 px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-amber-600 hover:text-white transition-all">
                <Star size={18} /> Cheer!
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <img src={post.avatar} alt={post.username} className="w-10 h-10 rounded-xl bg-amber-100" />
              <div>
                <span className="text-sm font-black text-slate-900 block">{post.username}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Junior Maker</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string) => (
                <span key={tag} className="text-[10px] font-black bg-amber-50 text-amber-600 px-2.5 py-1 rounded-lg uppercase border border-amber-200">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function CardAlbum({ cards, packs, userCards, userAtoms, onBuyPack }: { 
  cards: Card[], 
  packs: CardPack[], 
  userCards: string[], 
  userAtoms: number,
  onBuyPack: (pack: CardPack) => void 
}) {
  const [activeTab, setActiveTab] = useState<'collection' | 'shop'>('shop');

  const getRarityColor = (rarity: string) => {
    switch(rarity) {
      case 'legendary': return 'from-purple-500 to-pink-500';
      case 'epic': return 'from-blue-500 to-cyan-500';
      case 'rare': return 'from-green-500 to-emerald-500';
      default: return 'from-slate-400 to-slate-500';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black mb-2">STEM Card Collection</h2>
            <p className="text-purple-100 text-lg font-medium">Collect legendary scientists and phenomena!</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-purple-100 mb-1 flex items-center gap-2 justify-end">
              <AtomIcon size={16} /> Your Atoms
            </p>
            <p className="text-4xl font-black">{userAtoms}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 bg-white p-2 rounded-2xl border-2 border-amber-200 shadow-lg">
        <button 
          onClick={() => setActiveTab('shop')}
          className={cn(
            "flex-1 py-4 rounded-xl font-black text-lg transition-all",
            activeTab === 'shop' ? "bg-amber-500 text-white shadow-lg" : "text-slate-600 hover:bg-amber-50"
          )}
        >
          🛒 Card Shop
        </button>
        <button 
          onClick={() => setActiveTab('collection')}
          className={cn(
            "flex-1 py-4 rounded-xl font-black text-lg transition-all",
            activeTab === 'collection' ? "bg-amber-500 text-white shadow-lg" : "text-slate-600 hover:bg-amber-50"
          )}
        >
          📚 My Collection ({userCards.length})
        </button>
      </div>

      {activeTab === 'shop' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packs.map((pack) => (
            <motion.div 
              key={pack.id}
              whileHover={{ y: -5 }}
              className="bg-white rounded-3xl p-8 border-2 border-amber-200 shadow-xl hover:shadow-2xl transition-all flex flex-col items-center text-center"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-3xl flex items-center justify-center text-white mb-6 shadow-xl">
                <Package size={48} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">{pack.name}</h3>
              <p className="text-slate-500 font-medium mb-4">{pack.description}</p>
              <p className="text-sm font-bold text-slate-400 mb-6">{pack.cardsCount} random cards</p>
              <button 
                onClick={() => onBuyPack(pack)}
                disabled={userAtoms < pack.cost}
                className={cn(
                  "w-full py-4 rounded-2xl font-black text-lg transition-all shadow-lg flex items-center justify-center gap-2",
                  userAtoms >= pack.cost 
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700" 
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                )}
              >
                <AtomIcon size={20} /> {pack.cost} Atoms
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'collection' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.filter(c => userCards.includes(c.id)).length > 0 ? (
            cards.filter(c => userCards.includes(c.id)).map((card) => (
              <motion.div 
                key={card.id}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-3xl overflow-hidden border-2 border-amber-200 shadow-xl hover:shadow-2xl transition-all"
              >
                <div className={cn("h-48 bg-gradient-to-br", getRarityColor(card.rarity), "relative")}>
                  <div className="absolute top-3 right-3 bg-white/90 px-3 py-1 rounded-full">
                    <span className="text-xs font-black uppercase">{card.rarity}</span>
                  </div>
                  <img src={card.imageUrl} alt={card.name} className="w-full h-full object-cover opacity-90" />
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-black text-slate-900 mb-2">{card.name}</h4>
                  <p className="text-sm text-slate-600 font-medium mb-3">{card.description}</p>
                  {card.fact && (
                    <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl">
                      <p className="text-xs font-bold text-amber-700">💡 {card.fact}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package size={48} className="text-amber-400" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">No cards yet!</h3>
              <p className="text-slate-500 font-medium mb-6">Buy your first pack to start collecting</p>
              <button 
                onClick={() => setActiveTab('shop')}
                className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg"
              >
                Visit Shop
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
