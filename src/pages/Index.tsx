import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, X, ArrowRight, Sparkles, Link2, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { PlatformIcon } from '@/components/PlatformIcon';

const EXAMPLE_PAGES = [
  {
    name: 'Sarah Chen',
    username: 'sarahchen',
    bio: 'UX Designer & Content Creator ✨',
    links: ['Portfolio', 'Dribbble', 'YouTube', 'Newsletter'],
    color: 'from-pink-500 to-violet-500',
  },
  {
    name: 'Alex Rivera',
    username: 'alexdev',
    bio: 'Full Stack Developer | Open Source',
    links: ['GitHub', 'Blog', 'LinkedIn', 'Buy me a coffee'],
    color: 'from-emerald-500 to-cyan-500',
  },
  {
    name: 'Mia Tanaka',
    username: 'miatanaka',
    bio: 'Musician & Producer 🎵',
    links: ['Spotify', 'SoundCloud', 'Instagram', 'Merch Store'],
    color: 'from-amber-500 to-orange-500',
  },
];

export default function Index() {
  const [username, setUsername] = useState('');
  const [status, setStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle');
  const navigate = useNavigate();

  const isValid = /^[a-z0-9_-]{3,30}$/.test(username);

  useEffect(() => {
    if (!username) {
      setStatus('idle');
      return;
    }
    if (!isValid) {
      setStatus('invalid');
      return;
    }

    setStatus('checking');
    const timeout = setTimeout(async () => {
      const { data } = await supabase
        .from('pages')
        .select('username')
        .eq('username', username)
        .maybeSingle();
      setStatus(data ? 'taken' : 'available');
    }, 400);

    return () => clearTimeout(timeout);
  }, [username]);

  const handleClaim = () => {
    if (status === 'available') {
      navigate(`/edit/${username}`);
    }
  };

  const handleInput = (value: string) => {
    setUsername(value.toLowerCase().replace(/[^a-z0-9_-]/g, ''));
  };

  return (
    <div className="min-h-screen hero-gradient">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Link2 size={18} className="text-primary-foreground" />
          </div>
          <span className="font-['Space_Grotesk'] font-bold text-xl">LinkForge</span>
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigate('/explore')}>
          Explore
        </Button>
      </nav>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-8">
          <Sparkles size={14} />
          Free forever. No signup required.
        </div>

        <h1 className="text-5xl md:text-6xl font-bold font-['Space_Grotesk'] leading-tight mb-6">
          Your links. One page.{' '}
          <span className="gradient-text">Zero friction.</span>
        </h1>

        <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-12">
          Create a beautiful link-in-bio page in seconds — no signup required.
        </p>

        {/* Username Input */}
        <div className="max-w-lg mx-auto">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch">
            <div className="flex-1 relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-mono">
                linkforge.app/
              </div>
              <Input
                value={username}
                onChange={(e) => handleInput(e.target.value)}
                placeholder="yourname"
                className="pl-[108px] h-12 text-base font-mono"
                maxLength={30}
                onKeyDown={(e) => e.key === 'Enter' && handleClaim()}
              />
            </div>
            <Button
              size="lg"
              onClick={handleClaim}
              disabled={status !== 'available'}
              className="h-12 px-6 text-base font-semibold"
            >
              Claim your page
              <ArrowRight size={18} className="ml-1" />
            </Button>
          </div>

          {/* Status */}
          <div className="h-6 mt-2 text-sm">
            {status === 'checking' && (
              <span className="text-muted-foreground animate-pulse">Checking availability...</span>
            )}
            {status === 'available' && (
              <span className="text-[hsl(var(--success))] flex items-center justify-center gap-1">
                <Check size={14} /> Available!
              </span>
            )}
            {status === 'taken' && (
              <span className="text-destructive flex items-center justify-center gap-1">
                <X size={14} /> Username taken
              </span>
            )}
            {status === 'invalid' && username && (
              <span className="text-destructive text-xs">
                3-30 characters, only lowercase letters, numbers, hyphens and underscores
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Zap, title: 'Instant Setup', desc: 'No signup, no email, no password. Just pick a username and go.' },
            { icon: Link2, title: 'All Your Links', desc: 'Add up to 20 links with auto-detected icons for popular platforms.' },
            { icon: Sparkles, title: 'Beautiful Pages', desc: 'Clean, mobile-first design that looks great on any device.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-card border rounded-xl p-6 text-center">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Icon size={20} className="text-primary" />
              </div>
              <h3 className="font-semibold font-['Space_Grotesk'] mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Examples */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold font-['Space_Grotesk'] text-center mb-4">
          See it in action
        </h2>
        <p className="text-muted-foreground text-center mb-10">
          Here's what a LinkForge page can look like
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {EXAMPLE_PAGES.map((example) => (
            <div key={example.username} className="bg-card border rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${example.color} flex items-center justify-center text-white font-bold text-lg mx-auto mb-4`}>
                {example.name.split(' ').map(w => w[0]).join('')}
              </div>
              <h3 className="font-bold text-center font-['Space_Grotesk']">{example.name}</h3>
              <p className="text-xs text-muted-foreground text-center mb-4">{example.bio}</p>
              <div className="space-y-2">
                {example.links.map((link) => (
                  <div key={link} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary text-sm">
                    <PlatformIcon platform={link.toLowerCase().replace(/\s/g, '')} size={14} className="text-primary" />
                    <span>{link}</span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground text-center mt-4 font-mono">
                linkforge.app/{example.username}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-sm text-muted-foreground">
        <p>LinkForge — Your links, your page, zero friction.</p>
      </footer>
    </div>
  );
}
