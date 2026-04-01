import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, X, ArrowRight, Sparkles, Link2, Zap, Eye, BarChart3, Palette, Shield, Globe, Smartphone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { PlatformIcon } from '@/components/PlatformIcon';
import { AppThemeSwitcher, DarkModeToggle } from '@/components/AppThemeSwitcher';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const EXAMPLE_PAGES = [
  {
    name: 'Sarah Chen',
    username: 'sarahchen',
    bio: 'UX Designer & Content Creator ✨',
    links: ['Portfolio', 'Dribbble', 'YouTube', 'Newsletter'],
    color: 'from-pink-500 to-violet-500',
    theme: 'Glassmorphism',
  },
  {
    name: 'Alex Rivera',
    username: 'alexdev',
    bio: 'Full Stack Developer | Open Source',
    links: ['GitHub', 'Blog', 'LinkedIn', 'Buy me a coffee'],
    color: 'from-emerald-500 to-cyan-500',
    theme: 'Neon',
  },
  {
    name: 'Mia Tanaka',
    username: 'miatanaka',
    bio: 'Musician & Producer 🎵',
    links: ['Spotify', 'SoundCloud', 'Instagram', 'Merch Store'],
    color: 'from-amber-500 to-orange-500',
    theme: 'Gradient Pop',
  },
];

const FEATURES = [
  { icon: Zap, title: 'Instant Setup', desc: 'No signup, no email, no password. Just pick a username and go.' },
  { icon: Link2, title: 'All Your Links', desc: 'Add up to 20 links with auto-detected icons for popular platforms.' },
  { icon: Palette, title: '12+ Themes', desc: 'From minimal to neon, glassmorphism to brutalist — find your style.' },
  { icon: BarChart3, title: 'Analytics', desc: 'Track views, clicks, and engagement with a built-in dashboard.' },
  { icon: Shield, title: 'No Account Needed', desc: 'Edit with a secret link. Bookmark it and you\'re good to go.' },
  { icon: Smartphone, title: 'Mobile-First', desc: 'Looks stunning on every device. PWA-ready for home screen.' },
];

const STATS = [
  { label: 'Themes Available', value: '12+' },
  { label: 'Max Links', value: '20' },
  { label: 'Cost', value: '$0' },
  { label: 'Signup Required', value: 'Nope' },
];

function AnimatedSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Index() {
  const [username, setUsername] = useState('');
  const [status, setStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle');
  const navigate = useNavigate();

  const isValid = /^[a-z0-9_-]{3,30}$/.test(username);

  useEffect(() => {
    if (!username) { setStatus('idle'); return; }
    if (!isValid) { setStatus('invalid'); return; }
    setStatus('checking');
    const timeout = setTimeout(async () => {
      const { data } = await supabase.from('pages').select('username').eq('username', username).maybeSingle();
      setStatus(data ? 'taken' : 'available');
    }, 400);
    return () => clearTimeout(timeout);
  }, [username]);

  const handleClaim = () => { if (status === 'available') navigate(`/edit/${username}`); };
  const handleInput = (value: string) => setUsername(value.toLowerCase().replace(/[^a-z0-9_-]/g, ''));

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -left-40 w-80 h-80 rounded-full bg-accent/5 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 right-1/4 w-72 h-72 rounded-full bg-primary/3 blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      {/* Nav */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25">
            <Link2 size={18} className="text-primary-foreground" />
          </div>
          <span className="font-['Space_Grotesk'] font-bold text-xl">LinkForge</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-1"
        >
          <DarkModeToggle />
          <AppThemeSwitcher />
          <Button variant="ghost" size="sm" onClick={() => navigate('/explore')}>
            Explore
          </Button>
        </motion.div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pt-16 md:pt-24 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-5 py-2 text-sm font-medium mb-8 border border-primary/20"
        >
          <Sparkles size={14} className="animate-pulse" />
          Free forever. No signup required.
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold font-['Space_Grotesk'] leading-[1.1] mb-6 tracking-tight"
        >
          Your links. One page.
          <br />
          <span className="gradient-text">Zero friction.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-14 leading-relaxed"
        >
          Create a beautiful link-in-bio page in seconds.
          <br className="hidden md:block" />
          Share everything you are, in one simple link.
        </motion.p>

        {/* Username Input */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="max-w-lg mx-auto"
        >
          <div className="flex flex-col sm:flex-row gap-3 items-stretch">
            <div className="flex-1 relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-mono">
                linkforge.app/
              </div>
              <Input
                value={username}
                onChange={(e) => handleInput(e.target.value)}
                placeholder="yourname"
                className="pl-[108px] h-13 text-base font-mono border-2 focus:border-primary transition-colors shadow-sm"
                maxLength={30}
                onKeyDown={(e) => e.key === 'Enter' && handleClaim()}
              />
            </div>
            <Button
              size="lg"
              onClick={handleClaim}
              disabled={status !== 'available'}
              className="h-13 px-8 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
            >
              Claim your page
              <ArrowRight size={18} className="ml-2" />
            </Button>
          </div>

          {/* Status */}
          <div className="h-6 mt-3 text-sm">
            {status === 'checking' && (
              <span className="text-muted-foreground animate-pulse">Checking availability...</span>
            )}
            {status === 'available' && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-[hsl(var(--success))] flex items-center justify-center gap-1 font-medium"
              >
                <Check size={14} /> Available! Claim it now.
              </motion.span>
            )}
            {status === 'taken' && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-destructive flex items-center justify-center gap-1"
              >
                <X size={14} /> Username taken
              </motion.span>
            )}
            {status === 'invalid' && username && (
              <span className="text-destructive text-xs">
                3-30 characters, only lowercase letters, numbers, hyphens and underscores
              </span>
            )}
          </div>
        </motion.div>
      </section>

      {/* Stats strip */}
      <AnimatedSection className="relative z-10 max-w-4xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 + i * 0.1 }}
              className="text-center p-4 rounded-2xl bg-card/50 backdrop-blur-sm border"
            >
              <p className="text-2xl md:text-3xl font-bold font-['Space_Grotesk'] text-primary">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      {/* Features */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        <AnimatedSection className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold font-['Space_Grotesk'] mb-4">
            Everything you need,{' '}
            <span className="gradient-text">nothing you don't</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Powerful features to make your link-in-bio page stand out.
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ icon: Icon, title, desc }, i) => (
            <AnimatedSection key={title} delay={i * 0.08}>
              <div className="bg-card border rounded-2xl p-6 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-1 transition-all duration-300 group h-full">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <Icon size={22} className="text-primary" />
                </div>
                <h3 className="font-semibold font-['Space_Grotesk'] text-lg mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Examples */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        <AnimatedSection className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold font-['Space_Grotesk'] mb-4">
            See it in action
          </h2>
          <p className="text-muted-foreground text-lg">
            Here's what a LinkForge page can look like
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-6">
          {EXAMPLE_PAGES.map((example, i) => (
            <AnimatedSection key={example.username} delay={i * 0.12}>
              <div className="bg-card border rounded-2xl p-6 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-2 transition-all duration-300 group">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${example.color} flex items-center justify-center text-white font-bold text-lg mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {example.name.split(' ').map(w => w[0]).join('')}
                </div>
                <h3 className="font-bold text-center font-['Space_Grotesk'] text-lg">{example.name}</h3>
                <p className="text-xs text-muted-foreground text-center mb-1">{example.bio}</p>
                <p className="text-[10px] text-primary font-medium text-center mb-4">{example.theme} theme</p>
                <div className="space-y-2">
                  {example.links.map((link, li) => (
                    <motion.div
                      key={link}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-secondary/60 text-sm border border-transparent hover:border-primary/20 transition-colors"
                    >
                      <PlatformIcon platform={link.toLowerCase().replace(/\s/g, '')} size={14} className="text-primary" />
                      <span className="font-medium">{link}</span>
                    </motion.div>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground text-center mt-4 font-mono">
                  linkforge.app/{example.username}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <AnimatedSection className="relative z-10 max-w-3xl mx-auto px-6 py-24">
        <div className="text-center bg-card border rounded-3xl p-10 md:p-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
          <div className="relative z-10">
            <Globe size={40} className="text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold font-['Space_Grotesk'] mb-4">
              Ready to forge your links?
            </h2>
            <p className="text-muted-foreground mb-8 text-lg max-w-md mx-auto">
              It takes less than 30 seconds. No account. No credit card. Just you and your links.
            </p>
            <Button size="lg" className="px-10 h-14 text-base font-semibold shadow-xl shadow-primary/20" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              Get Started — It's Free
              <ArrowRight size={18} className="ml-2" />
            </Button>
          </div>
        </div>
      </AnimatedSection>

      {/* Footer */}
      <footer className="relative z-10 text-center py-10 text-sm text-muted-foreground border-t">
        <p className="font-['Space_Grotesk'] font-medium">LinkForge — Your links, your page, zero friction.</p>
        <p className="text-xs mt-2 opacity-60">Made with ❤️ for creators everywhere</p>
      </footer>
    </div>
  );
}
