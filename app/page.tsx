import { GameProvider } from '@/lib/gameStore';
import { GameTitle, LeftPanel, RightPanel, GameControls, GameStatusOverlay } from '@/components/UIPanels';
import './globals.css';

export default function Home() {
  return (
    <GameProvider>
      <main
        className="min-h-screen flex flex-col"
        style={{
          background: 'linear-gradient(135deg, #0a0a12 0%, #12121f 50%, #0a0a12 100%)',
        }}
      >
        <GameTitle />
        
        <div className="flex-1 flex justify-center items-start gap-8 px-8 py-4">
          <LeftPanel />
          
          {/* Game Board Placeholder - Will be replaced with 3D Canvas in future stories */}
          <div
            className="relative rounded-xl overflow-hidden"
            style={{
              width: 300,
              height: 600,
              background: 'rgba(10, 10, 18, 0.6)',
              border: '1px solid rgba(0, 240, 255, 0.2)',
              boxShadow: '0 0 40px rgba(0, 240, 255, 0.1), inset 0 0 60px rgba(0, 0, 0, 0.5)',
            }}
          >
            {/* Grid overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
                `,
                backgroundSize: '30px 30px',
              }}
            />
            
            {/* Center text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <p
                className="text-center px-8"
                style={{
                  color: 'var(--color-text-secondary)',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                Game Board
                <br />
                <span className="text-sm opacity-50">(3D Canvas coming soon)</span>
              </p>
            </div>
            
            <GameStatusOverlay />
          </div>
          
          <RightPanel />
        </div>
        
        <GameControls />
      </main>
    </GameProvider>
  );
}
