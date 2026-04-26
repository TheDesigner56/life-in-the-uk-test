import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Zap, Facebook, Twitter, Youtube, Instagram } from 'lucide-react';

const quickLinks = [
  { to: '/', label: 'Home' },
  { to: '/practice', label: 'Practice Tests' },
  { to: '/study', label: 'Study Materials' },
  { to: '/leaderboard', label: 'Leaderboard' },
];

const resourceLinks = [
  { to: '/study', label: 'Official Handbook' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/terms', label: 'Terms of Service' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const existing = localStorage.getItem('lituk_newsletter_email');
    if (existing) {
      setSubscribed(true);
      setEmail(existing);
    }
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      localStorage.setItem('lituk_newsletter_email', email.trim());
      setSubscribed(true);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-deep-indigo text-white">
      <div className="mx-auto max-w-[1320px] px-4 py-16 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Column 1 - Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-royal-blue">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="font-display text-xl font-bold">
                Test<span className="text-royal-blue">Pro</span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              The free, personalised, and beautifully designed way to pass your
              Life in the UK Test. Join thousands who've studied with us.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://facebook.com/lifetestpro"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com/lifetestpro"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="https://youtube.com/@lifetestpro"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
              >
                <Youtube className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com/lifetestpro"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h4 className="font-display font-semibold">Quick Links</h4>
            <ul className="mt-4 space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-white/70 transition-colors duration-100 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Resources */}
          <div>
            <h4 className="font-display font-semibold">Resources</h4>
            <ul className="mt-4 space-y-2">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-white/70 transition-colors duration-100 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Newsletter */}
          <div>
            <h4 className="font-display font-semibold">Study Tips</h4>
            <p className="mt-4 text-sm text-white/70">
              Get study tips and new questions delivered to your inbox.
            </p>
            {subscribed ? (
              <p className="mt-4 text-sm font-medium text-green-400">
                Thanks for subscribing!
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="mt-4 flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 rounded-full bg-white/10 px-4 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-royal-blue"
                />
                <button
                  type="submit"
                  className="rounded-full bg-royal-blue px-4 py-2 text-sm font-semibold text-white transition-all hover:brightness-110"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/50">
            {currentYear} Life in the UK Test Pro. All rights reserved.
          </p>
          <p className="text-xs text-white/50">
            Made with care for future citizens
          </p>
        </div>
      </div>
    </footer>
  );
}
