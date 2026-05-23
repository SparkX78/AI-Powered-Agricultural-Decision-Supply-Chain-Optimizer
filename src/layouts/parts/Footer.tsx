import { Leaf, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0f3318] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-1 mb-3">
              <span
                className="text-xl font-bold"
                style={{ fontFamily: 'Sora, sans-serif', color: '#4ade80' }}
              >
                KisanUnnati
              </span>
              <span
                className="text-xl font-bold"
                style={{ fontFamily: 'Sora, sans-serif', color: '#c9a227' }}
              >
                Nexus
              </span>
            </div>
            <p className="text-sm text-green-200/70 leading-relaxed">
              Smart Agritech Supply Chain Platform connecting farmers, logistics providers, and
              businesses across India.
            </p>
            <div className="flex items-center gap-1 mt-4">
              <Leaf size={14} className="text-green-400" />
              <span className="text-xs text-green-300/60">Empowering Indian Agriculture</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-green-300 uppercase tracking-wider mb-4">
              Platform
            </h4>
            <ul className="space-y-2">
              {['Features', 'For Farmers', 'For Businesses', 'Pricing', 'How It Works'].map(
                (item) => (
                  <li key={item}>
                    <a
                      href={`/#${item.toLowerCase().replace(/ /g, '-')}`}
                      className="text-sm text-green-100/60 hover:text-white transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-green-300 uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-2">
              {[
                { label: 'About Us',        href: '/about' },
                { label: 'Contact',         href: '/contact' },
                { label: 'Farmer Guide',    href: '/contact' },
                { label: 'Business Guide',  href: '/contact' },
                { label: 'Support',         href: '/contact' },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-sm text-green-100/60 hover:text-white transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-green-300 uppercase tracking-wider mb-4">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Mail size={14} className="text-green-400 mt-0.5 shrink-0" />
                <span className="text-sm text-green-100/60">support@kisanunnatinexus.in</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone size={14} className="text-green-400 mt-0.5 shrink-0" />
                <span className="text-sm text-green-100/60">+91 1800-XXX-XXXX</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={14} className="text-green-400 mt-0.5 shrink-0" />
                <span className="text-sm text-green-100/60">New Delhi, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-green-200/40">
            © 2026 KisanUnnati Nexus. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-xs text-green-200/40 hover:text-green-200/80 transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
