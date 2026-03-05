import GameCanvas from '@/components/game/GameCanvas';

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <main className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text font-display">
            DevTool Pro
          </h1>
          <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto font-body">
            Next.js 14 + Three.js Interactive Experience
          </p>
        </div>

        {/* 3D Canvas Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-[var(--neon-primary)] font-display">
            Interactive 3D Scene
          </h2>
          <p className="text-[var(--text-secondary)] mb-6">
            Drag to rotate • Scroll to zoom • Right-click to pan
          </p>
          <GameCanvas />
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] hover:border-[var(--neon-primary)] transition-colors">
            <div className="w-12 h-12 rounded-lg bg-[var(--neon-primary)]/10 flex items-center justify-center mb-4">
              <span className="text-2xl text-[var(--neon-primary)]">⚡</span>
            </div>
            <h3 className="text-lg font-semibold mb-2 font-display">Next.js 14</h3>
            <p className="text-[var(--text-secondary)] text-sm">
              App Router with React Server Components and optimized performance.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] hover:border-[var(--neon-secondary)] transition-colors">
            <div className="w-12 h-12 rounded-lg bg-[var(--neon-secondary)]/10 flex items-center justify-center mb-4">
              <span className="text-2xl text-[var(--neon-secondary)]">🎨</span>
            </div>
            <h3 className="text-lg font-semibold mb-2 font-display">Three.js</h3>
            <p className="text-[var(--text-secondary)] text-sm">
              React Three Fiber for declarative 3D scenes with React components.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] hover:border-[var(--neon-accent)] transition-colors">
            <div className="w-12 h-12 rounded-lg bg-[var(--neon-accent)]/10 flex items-center justify-center mb-4">
              <span className="text-2xl text-[var(--neon-accent)]">🎯</span>
            </div>
            <h3 className="text-lg font-semibold mb-2 font-display">Design Tokens</h3>
            <p className="text-[var(--text-secondary)] text-sm">
              Neon-themed CSS custom properties for consistent theming.
            </p>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-12 p-6 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)]">
          <h2 className="text-xl font-semibold mb-4 font-display">Tech Stack</h2>
          <div className="flex flex-wrap gap-3">
            {['Next.js 14', 'TypeScript', 'Three.js', 'React Three Fiber', 'Tailwind CSS', 'Google Fonts'].map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-secondary)] text-sm border border-[var(--border-primary)]"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
