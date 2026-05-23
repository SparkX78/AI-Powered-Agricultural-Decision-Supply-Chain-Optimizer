import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Home',         href: '/' },
  { label: 'Features',     href: '/#features' },
  { label: 'For Farmers',  href: '/#for-farmers' },
  { label: 'For Businesses', href: '/#for-businesses' },
  { label: 'About',        href: '/about' },
  { label: 'Contact',      href: '/contact' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1 shrink-0">
            <span
              className="text-xl font-bold tracking-tight"
              style={{ fontFamily: 'Sora, sans-serif', color: '#1a5c2a' }}
            >
              KisanUnnati
            </span>
            <span
              className="text-xl font-bold tracking-tight"
              style={{ fontFamily: 'Sora, sans-serif', color: '#c9a227' }}
            >
              Nexus
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === link.href
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="/login"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Sign In
            </a>
            <a
              href="/login"
              className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:shadow-md"
              style={{ background: 'linear-gradient(135deg, #1a5c2a, #2d7a3e)' }}
            >
              Get Started
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-primary"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-border px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="block text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-1"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="/login"
            className="block w-full text-center mt-3 px-4 py-2 rounded-lg text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #1a5c2a, #2d7a3e)' }}
            onClick={() => setMobileOpen(false)}
          >
            Get Started
          </a>
        </div>
      )}
    </header>
  );
}
