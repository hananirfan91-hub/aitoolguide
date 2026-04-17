import { Link, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, BookOpen, Wrench, Info, Mail, Github, Twitter, Linkedin, Send, User, LogOut, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/', icon: <BookOpen className="w-4 h-4 mr-2" /> },
    { name: 'Tools', path: '/tools', icon: <Wrench className="w-4 h-4 mr-2" /> },
    { name: 'Blog', path: '/blog', icon: <BookOpen className="w-4 h-4 mr-2" /> },
    { name: 'About', path: '/about', icon: <Info className="w-4 h-4 mr-2" /> },
    { name: 'Contact', path: '/contact', icon: <Mail className="w-4 h-4 mr-2" /> },
  ];

  const handleLogout = async () => {
    await signOut();
    setIsDropdownOpen(false);
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfcfc] text-gray-900 font-sans selection:bg-blue-200">
      <div className="h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-green-500 w-full fixed top-0 z-50"></div>
      
      <header className={`fixed top-1 w-full z-40 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2 group">
                <span className="bg-gray-900 text-white p-1.5 rounded-lg max-w-fit shadow-md group-hover:bg-blue-600 transition-colors">
                 <Wrench className="w-6 h-6" />
                </span>
                AIToolGuide
              </Link>
            </div>
            
            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    location.pathname === link.path
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              {/* Conditional Admin Button */}
              {isAdmin && (
                <Link to="/admin" className="ml-2 inline-flex items-center px-4 py-2 bg-purple-50 text-purple-700 text-sm font-medium rounded-full shadow-sm hover:bg-purple-100 transition-colors border border-purple-100">
                  Admin Panel
                </Link>
              )}

              {/* User Dropdown Profile area */}
              <div className="ml-4 pl-4 border-l border-gray-200 relative" ref={dropdownRef}>
                {user ? (
                   <div>
                     <button 
                       onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                       className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none bg-gray-50 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors"
                     >
                       <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                         <User className="w-3.5 h-3.5" />
                       </div>
                       <span className="max-w-[120px] truncate">{user.email}</span>
                       <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                     </button>
                     
                     {/* Dropdown Menu */}
                     {isDropdownOpen && (
                       <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 origin-top-right animate-in fade-in zoom-in duration-200">
                         <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 text-xs text-gray-500 font-mono truncate">
                           {user.email}
                         </div>
                         <div className="py-1">
                           <button 
                             onClick={handleLogout}
                             className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                           >
                             <LogOut className="w-4 h-4" /> Sign out
                           </button>
                         </div>
                       </div>
                     )}
                   </div>
                ) : (
                  <Link to="/auth" className="inline-flex items-center px-5 py-2 text-sm font-medium rounded-full shadow-sm text-white bg-gray-900 hover:bg-gray-800 transition-colors">
                    Login / Sign up
                  </Link>
                )}
              </div>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-900 transition-colors"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className={`md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 transition-all duration-300 ease-in-out shadow-lg overflow-hidden ${isMenuOpen ? 'max-h-[30rem] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="px-4 py-3 space-y-1">
              {/* Authenticated user top bar for mobile */}
              {user && (
                 <div className="px-4 py-3 mb-2 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                     <User className="w-4 h-4" />
                   </div>
                   <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                   </div>
                 </div>
              )}
              
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-xl text-base font-medium ${
                    location.pathname === link.path
                      ? 'bg-gray-50 text-gray-900 border border-gray-100'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
              
              <div className="pt-4 mt-2 border-t border-gray-100 space-y-2">
                 {isAdmin && (
                   <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="w-full flex items-center justify-center px-4 py-3 border border-purple-100 text-base font-medium rounded-xl text-purple-700 bg-purple-50 hover:bg-purple-100">
                     Admin Panel
                   </Link>
                 )}
                 {user ? (
                   <button onClick={handleLogout} className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-xl text-red-700 bg-red-50 hover:bg-red-100 gap-2">
                     <LogOut className="w-5 h-5" /> Sign out
                   </button>
                 ) : (
                   <Link to="/auth" onClick={() => setIsMenuOpen(false)} className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gray-900 hover:bg-gray-800">
                     Login / Sign up
                   </Link>
                 )}
              </div>
            </div>
        </div>
      </header>

      {/* Main Content Area - padded for fixed header */}
      <main className="flex-1 flex flex-col w-full pt-20">
        <Outlet />
      </main>

      {/* Professional Footer */}
      <footer className="bg-gray-900 bg-gradient-to-b from-gray-900 to-black text-gray-300 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            
            {/* Brand Column */}
            <div className="space-y-6">
              <Link to="/" className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <span className="bg-white text-gray-900 p-1.5 rounded-lg shadow-sm">
                 <Wrench className="w-6 h-6" />
                </span>
                AIToolGuide
              </Link>
              <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
                Demystifying Artificial Intelligence for students and beginners. Learn the tools that shape the future in plain English.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">GitHub</span>
                  <Github className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-6">Navigation</h3>
              <ul className="space-y-4">
                <li><Link to="/" className="text-sm hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/tools" className="text-sm hover:text-white transition-colors">AI Tools Directory</Link></li>
                <li><Link to="/blog" className="text-sm hover:text-white transition-colors">Guides & Tutorials</Link></li>
                <li><Link to="/about" className="text-sm hover:text-white transition-colors">Our Mission</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-6">Legal</h3>
              <ul className="space-y-4">
                <li><Link to="/contact" className="text-sm hover:text-white transition-colors">Contact Us</Link></li>
                <li><a href="#" className="text-sm hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-sm hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-sm hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-6">Stay Updated</h3>
              <p className="text-sm text-gray-400 mb-4">Get the latest AI tool guides delivered to your inbox.</p>
              <form className="flex" onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="email-address" className="sr-only">Email address</label>
                <input
                  type="email"
                  name="email"
                  id="email-address"
                  autoComplete="email"
                  required
                  className="w-full min-w-0 appearance-none rounded-l-lg border-0 bg-gray-800/50 px-4 py-2.5 text-base text-white placeholder-gray-500 ring-1 ring-inset ring-gray-700/50 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm"
                  placeholder="Enter your email"
                />
                <button
                  type="submit"
                  className="flex flex-none items-center justify-center rounded-r-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-gray-800/80 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} AIToolGuide. All rights reserved.
            </p>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              Made with ❤️ for students
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
