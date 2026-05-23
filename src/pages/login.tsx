import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff, Sprout, Mail, Lock, ArrowRight, Leaf, Phone } from 'lucide-react';

type Role = 'farmer' | 'owner' | 'partner';
type AuthMode = 'email' | 'otp';

const roles: { value: Role; label: string; desc: string; emoji: string }[] = [
  { value: 'farmer', label: 'Farmer', desc: 'Track produce & prices', emoji: '🌾' },
  { value: 'owner', label: 'Business Owner', desc: 'Manage operations', emoji: '🏢' },
  { value: 'partner', label: 'Logistics Partner', desc: 'Manage deliveries', emoji: '🚛' },
];

const demoAccounts: Record<Role, { email: string; password: string; phone: string }> = {
  farmer: { email: 'ramesh@kisanunnati.in', password: 'farmer123', phone: '9876543210' },
  owner: { email: 'admin@kisanunnati.in', password: 'owner123', phone: '9123456789' },
  partner: { email: 'partner@kisanunnati.in', password: 'partner123', phone: '9988776655' },
};

export default function LoginPage() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<Role>('farmer');
  const [authMode, setAuthMode] = useState<AuthMode>('email');
  const [email, setEmail] = useState(demoAccounts.farmer.email);
  const [password, setPassword] = useState(demoAccounts.farmer.password);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRoleChange = (role: Role) => {
    setSelectedRole(role);
    setEmail(demoAccounts[role].email);
    setPassword(demoAccounts[role].password);
    setError('');
    setOtpSent(false);
    setOtp('');
    setPhone('');
  };

  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setOtpSent(true);
    setError('');
    setIsLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 900));

    if (authMode === 'otp') {
      if (otp === '123456') {
        redirectByRole();
      } else {
        setError('Invalid OTP. Use demo OTP: 123456');
      }
    } else {
      const demo = demoAccounts[selectedRole];
      if (email === demo.email && password === demo.password) {
        redirectByRole();
      } else {
        setError('Invalid credentials. Use the demo account shown below.');
      }
    }
    setIsLoading(false);
  };

  const redirectByRole = () => {
    if (selectedRole === 'farmer') navigate('/farmer-dashboard');
    else if (selectedRole === 'owner') navigate('/owner-dashboard');
    else navigate('/farmer-dashboard');
  };

  return (
    <>
      <title>Login – KisanUnnati Nexus</title>
      <meta name="description" content="Sign in to KisanUnnati Nexus — your agritech supply chain platform." />

      <div className="min-h-screen bg-gradient-to-br from-[#f0fdf4] via-background to-[#fefce8] flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <a href="/" className="inline-flex items-center gap-2 justify-center mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#dcfce7' }}>
                <Sprout size={22} style={{ color: '#1a5c2a' }} />
              </div>
              <div className="text-left">
                <span className="block text-xl font-bold leading-none" style={{ color: '#1a5c2a' }}>KisanUnnati</span>
                <span className="block text-xl font-bold leading-none" style={{ color: '#c9a227' }}>Nexus</span>
              </div>
            </a>
            <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
            <p className="text-sm text-muted-foreground mt-1">Sign in to your account to continue</p>
          </div>

          <div className="bg-card rounded-2xl shadow-lg border border-border p-7">
            {/* Role Selector */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">I am a...</p>
              <div className="grid grid-cols-3 gap-2">
                {roles.map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => handleRoleChange(role.value)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-center transition-all duration-200 ${
                      selectedRole === role.value
                        ? 'border-primary bg-[#f0fdf4]'
                        : 'border-border hover:border-primary/40 hover:bg-muted/40'
                    }`}
                    aria-pressed={selectedRole === role.value}
                  >
                    <span className="text-2xl" role="img" aria-label={role.label}>{role.emoji}</span>
                    <span className={`text-xs font-semibold ${selectedRole === role.value ? 'text-primary' : 'text-foreground'}`}>
                      {role.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground leading-tight hidden sm:block">{role.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Auth Mode Toggle */}
            <div className="flex gap-1 bg-muted rounded-lg p-1 mb-5">
              {(['email', 'otp'] as AuthMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => { setAuthMode(mode); setError(''); setOtpSent(false); }}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-semibold transition-all duration-200 ${
                    authMode === mode ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {mode === 'email' ? <><Mail size={13} /> Email & Password</> : <><Phone size={13} /> Mobile OTP</>}
                </button>
              ))}
            </div>

            <form onSubmit={handleLogin} className="space-y-4" noValidate>
              <AnimatePresence mode="wait">
                {authMode === 'email' ? (
                  <motion.div
                    key="email-form"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                          placeholder="your@email.com"
                          required
                          autoComplete="email"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">
                        Password
                      </label>
                      <div className="relative">
                        <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-9 pr-10 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                          placeholder="Enter password"
                          required
                          autoComplete="current-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="otp-form"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1.5">
                        Mobile Number
                      </label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <input
                            id="phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                            placeholder="10-digit mobile number"
                            maxLength={10}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          disabled={isLoading || otpSent}
                          className="px-3 py-2.5 rounded-lg text-xs font-semibold text-white transition-all duration-200 disabled:opacity-60 whitespace-nowrap"
                          style={{ background: '#1a5c2a' }}
                        >
                          {isLoading && !otpSent ? 'Sending...' : otpSent ? 'Sent ✓' : 'Send OTP'}
                        </button>
                      </div>
                    </div>
                    {otpSent && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <label htmlFor="otp" className="block text-sm font-medium text-foreground mb-1.5">
                          Enter OTP
                        </label>
                        <input
                          id="otp"
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm text-center tracking-[0.4em] font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                          placeholder="• • • • • •"
                          maxLength={6}
                        />
                        <p className="text-xs text-muted-foreground mt-1">Demo OTP: <span className="font-mono font-semibold text-foreground">123456</span></p>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
                  role="alert"
                >
                  {error}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={isLoading || (authMode === 'otp' && !otpSent)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                style={{ background: 'linear-gradient(135deg, #1a5c2a, #2d7a3e)' }}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                    Signing in...
                  </span>
                ) : (
                  <>Sign In <ArrowRight size={16} /></>
                )}
              </button>
            </form>

            {/* Demo hint */}
            <div className="mt-5 p-3 bg-muted/60 rounded-xl border border-border">
              <p className="text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1">
                <Leaf size={11} className="text-primary" />
                Demo credentials ({selectedRole})
              </p>
              {authMode === 'email' ? (
                <>
                  <p className="text-xs text-muted-foreground">Email: <span className="font-mono text-foreground">{demoAccounts[selectedRole].email}</span></p>
                  <p className="text-xs text-muted-foreground">Password: <span className="font-mono text-foreground">{demoAccounts[selectedRole].password}</span></p>
                </>
              ) : (
                <p className="text-xs text-muted-foreground">Enter any 10-digit number, then OTP: <span className="font-mono text-foreground">123456</span></p>
              )}
            </div>

            <p className="text-center text-xs text-muted-foreground mt-4">
              New to the platform?{' '}
              <a href="/login" className="text-primary font-semibold hover:underline">Register here</a>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}
