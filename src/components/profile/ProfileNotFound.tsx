import { motion } from 'framer-motion';

export function ProfileNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(252,85%,15%)] to-[hsl(224,30%,8%)] flex items-center justify-center px-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <h1 className="text-6xl font-bold font-['Space_Grotesk'] text-white/90 mb-3">404</h1>
        <p className="text-white/60 text-lg mb-6">This page doesn't exist yet.</p>
        <a
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 backdrop-blur text-white font-medium hover:bg-white/20 transition-colors"
        >
          Create yours <span>→</span>
        </a>
      </motion.div>
    </div>
  );
}
