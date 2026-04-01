export function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(252,85%,15%)] to-[hsl(224,30%,8%)] flex justify-center px-5 py-12">
      <div className="w-full max-w-[480px] flex flex-col items-center gap-4 animate-pulse">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full bg-white/10 mt-8" />
        {/* Name */}
        <div className="h-7 w-48 rounded-lg bg-white/10" />
        {/* Bio */}
        <div className="h-4 w-64 rounded bg-white/8" />
        <div className="h-4 w-40 rounded bg-white/8" />
        {/* Social icons */}
        <div className="flex gap-3 mt-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="w-7 h-7 rounded-full bg-white/10" />
          ))}
        </div>
        {/* Links */}
        <div className="w-full flex flex-col gap-3 mt-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="w-full h-14 rounded-xl bg-white/10" />
          ))}
        </div>
      </div>
    </div>
  );
}
