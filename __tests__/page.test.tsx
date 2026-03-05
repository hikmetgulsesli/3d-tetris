import { render, screen } from '@testing-library/react';
import Home from '../app/page';

// Mock the GameCanvas component since it uses Three.js which requires WebGL
jest.mock('@/components/game/GameCanvas', () => {
  return function MockGameCanvas() {
    return <div data-testid="game-canvas">Game Canvas Mock</div>;
  };
});

describe('Home Page', () => {
  it('renders the main heading', () => {
    render(<Home />);
    expect(screen.getByText('DevTool Pro')).toBeInTheDocument();
  });

  it('renders the subheading', () => {
    render(<Home />);
    expect(screen.getByText('Next.js 14 + Three.js Interactive Experience')).toBeInTheDocument();
  });

  it('renders the 3D canvas section', () => {
    render(<Home />);
    expect(screen.getByTestId('game-canvas')).toBeInTheDocument();
  });

  it('renders the interactive scene heading', () => {
    render(<Home />);
    expect(screen.getByText('Interactive 3D Scene')).toBeInTheDocument();
  });

  it('renders feature cards', () => {
    render(<Home />);
    // These texts appear in both feature cards and tech stack tags
    expect(screen.getAllByText('Next.js 14').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Three.js').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Design Tokens')).toBeInTheDocument();
  });

  it('renders the tech stack section', () => {
    render(<Home />);
    expect(screen.getByText('Tech Stack')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Tailwind CSS')).toBeInTheDocument();
  });
});
