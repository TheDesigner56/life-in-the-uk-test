import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Trophy,
  User,
  Menu,
  X,
  Zap,
  Sun,
  Moon,
  Monitor,
} from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/practice', label: 'Practice', icon: BookOpen },
  { to: '/study', label: 'Study', icon: GraduationCap },
  { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { to: '/profile', label: 'Profile', icon: User },
];

/** Theme toggle button with sun/moon/monitor icons */
function ThemeToggle({ scrolled, isHome }: { scrolled: boolean; isHome: boolean }) {
  const { theme, toggleTheme } = useTheme();

  const iconClass = cn(
    'h-[18px] w-[18px] transition-all',
    scrolled || !isHome
      ? 'text-charcoal dark:text-white'
      : 'text-white'
  );

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'relative flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200',
        scrolled || !isHome
          ? 'hover:bg-gray-100 dark:hover:bg-white/10'
          : 'hover:bg-white/10'
      )}
      title={`Theme: ${theme}`}
      aria-label="Toggle theme"
    >
      {theme === 'light' && <Sun className={iconClass} />}
      {theme === 'dark' && <Moon className={iconClass} />}
      {theme === 'system' && <Monitor className={iconClass} />}
      <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-accent-amber" />
    </button>
  );
}

/** Mobile drawer theme selector with labels */
function MobileThemeToggle() {
  const { theme, setTheme } = useTheme();

  const options = [
    { value: 'light' as const, label: 'Light', Icon: Sun },
    { value: 'dark' as const, label: 'Dark', Icon: Moon },
    { value: 'system' as const, label: 'System', Icon: Monitor },
  ];

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-charcoal dark:text-gray-300">Appearance</span>
      <div className="flex gap-1">
        {options.map(({ value, label, Icon }) => (
          <button
            key={value}
            onClick={() => setTheme(value)}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
              theme === value
                ? 'bg-royal-blue text-white'
                : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5'
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isHome = location.pathname === '/';

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-[100] transition-all duration-300',
          scrolled || !isHome
            ? 'bg-white/90 dark:bg-dark-slate/90 backdrop-blur-[12px] shadow-sm'
            : 'bg-transparent'
        )}
      >
        <div className="mx-auto max-w-[1320px] px-4 md:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-royal-blue">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span
                className={cn(
                  'font-display text-xl font-bold tracking-tight',
                  scrolled || !isHome
                    ? 'text-dark-slate dark:text-white'
                    : 'text-white'
                )}
              >
                Test<span className="text-royal-blue">Pro</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden items-center gap-1 md:flex">
              {navLinks.map((link) => {
                const isActive = location.pathname.startsWith(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={cn(
                      'relative px-3 py-2 text-sm font-medium tracking-[0.01em] transition-colors duration-150',
                      scrolled || !isHome
                        ? isActive
                          ? 'text-royal-blue'
                          : 'text-charcoal hover:text-royal-blue dark:text-gray-300 dark:hover:text-white'
                        : isActive
                          ? 'text-white'
                          : 'text-white/80 hover:text-white'
                    )}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="nav-underline"
                        className={cn(
                          'absolute bottom-0 left-3 right-3 h-0.5 rounded-full',
                          scrolled || !isHome
                            ? 'bg-royal-blue'
                            : 'bg-white'
                        )}
                        transition={{
                          type: 'spring',
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right side - Theme Toggle & CTA */}
            <div className="hidden items-center gap-3 md:flex">
              <ThemeToggle
                scrolled={scrolled}
                isHome={isHome}
              />
              <Link
                to="/practice"
                className={cn(
                  'rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200',
                  scrolled || !isHome
                    ? 'bg-royal-blue text-white hover:shadow-glow-blue hover:brightness-110'
                    : 'bg-white text-royal-blue hover:bg-white/90'
                )}
              >
                Start Practising
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={cn(
                'rounded-lg p-2 md:hidden',
                scrolled || !isHome
                  ? 'text-dark-slate dark:text-white'
                  : 'text-white'
              )}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[150] bg-black/40 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 z-[160] w-[300px] bg-white dark:bg-dark-slate shadow-xl md:hidden"
              style={{ borderRadius: '24px 0 0 24px' }}
            >
              <div className="flex h-16 items-center justify-between px-6">
                <span className="font-display text-lg font-bold text-dark-slate dark:text-white">
                  Menu
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg p-2 text-dark-slate dark:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="px-4 py-2">
                {navLinks.map((link, i) => {
                  const isActive = location.pathname.startsWith(link.to);
                  const Icon = link.icon;
                  return (
                    <motion.div
                      key={link.to}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        to={link.to}
                        className={cn(
                          'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-royal-blue/10 text-royal-blue'
                            : 'text-charcoal hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5'
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
                <div className="mt-4 border-t border-gray-100 pt-4 dark:border-gray-700">
                  <MobileThemeToggle />
                </div>
                <div className="mt-3">
                  <Link
                    to="/practice"
                    className="flex items-center justify-center gap-2 rounded-full bg-royal-blue px-5 py-3 text-sm font-semibold text-white"
                  >
                    <Zap className="h-4 w-4" />
                    Start Practising
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
