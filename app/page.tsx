import GameCanvas from '@/components/game/GameCanvas';

// Tech stack data
const TECH_STACK = [
  'Next.js 14',
  'TypeScript', 
  'Three.js',
  'React Three Fiber',
  'Tailwind CSS',
  'Google Fonts'
];

// Feature card data
const FEATURES = [
  {
    icon: '⚡',
    iconColor: 'var(--neon-primary)',
    title: 'Next.js 14',
    description: 'App Router with React Server Components and optimized performance.',
  },
  {
    icon: '🎨',
    iconColor: 'var(--neon-secondary)',
    title: 'Three.js',
    description: 'React Three Fiber for declarative 3D scenes with React components.',
  },
  {
    icon: '🎯',
    iconColor: 'var(--neon-accent)',
    title: 'Design Tokens',
    description: 'Neon-themed CSS custom properties for consistent theming.',
  },
];

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
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="p-6 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] hover:border-[var(--neon-primary)] transition-colors"
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: `${feature.iconColor}10` }}
              >
                <span className="text-2xl" style={{ color: feature.iconColor }}>
                  {feature.icon}
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-2 font-display">{feature.title}</h3>
              <p className="text-[var(--text-secondary)] text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Tech Stack */}
        <div className="mt-12 p-6 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)]">
          <h2 className="text-xl font-semibold mb-4 font-display">Tech Stack</h2>
          <div className="flex flex-wrap gap-3">
            {TECH_STACK.map((tech) => (
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
