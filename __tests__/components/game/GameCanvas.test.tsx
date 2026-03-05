import { render, screen } from '@testing-library/react';
import GameCanvas from '@/components/game/GameCanvas';

// Mock Three.js and React Three Fiber
jest.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="r3f-canvas">{children}</div>
  ),
  useFrame: jest.fn(),
}));

jest.mock('@react-three/drei', () => ({
  OrbitControls: () => <div data-testid="orbit-controls">OrbitControls</div>,
}));

describe('GameCanvas Component', () => {
  it('renders the canvas container and orbit controls', () => {
    render(<GameCanvas />);
    expect(screen.getByTestId('r3f-canvas')).toBeInTheDocument();
    expect(screen.getByTestId('orbit-controls')).toBeInTheDocument();
  });
});
