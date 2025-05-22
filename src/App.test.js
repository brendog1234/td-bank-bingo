import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mocking constants to control game for testing
const GAME_HEIGHT = 700; // Must match App.js
const BIRD_HEIGHT = 30; // Must match App.js
const GRAVITY = 0.5; // Must match App.js, though not directly used in test logic below, it affects fall speed

describe('App Component', () => {
  test('renders initial game state correctly', () => {
    render(<App />);
    // Check initial score
    expect(screen.getByText(/Score: 0/i)).toBeInTheDocument();
    // Check that "Game Over!" message is not present
    expect(screen.queryByText(/Game Over!/i)).not.toBeInTheDocument();
    // Check for the bird (can be improved with a data-testid)
    // For now, we assume Bird component renders something visible if App renders.
  });

  test('handles game over and restart', async () => {
    render(<App />);

    // 1. Start the game by simulating a space press
    fireEvent.keyDown(window, { code: 'Space' });

    // 2. Wait for the bird to fall and hit the ground, triggering game over
    // This is a tricky part. The bird starts at INITIAL_BIRD_POSITION (approx 335).
    // It needs to fall to GAME_HEIGHT - BIRD_HEIGHT (670).
    // The game loop runs every 20ms.
    // We need to wait long enough for this to happen.
    // A more robust way would be to have a data-testid on the game over message.
    await waitFor(() => {
      expect(screen.getByText(/Game Over!/i)).toBeInTheDocument();
    }, { timeout: 5000 }); // Increased timeout for physics to play out

    // 3. Check if score is still 0 (or some value if pipes were passed, but we expect 0 if bird crashes immediately)
    // This depends on whether pipes are generated fast enough to be passed.
    // For a simple fall, score should ideally be 0.
    // Let's check that the "Game Over!" message is there.
    expect(screen.getByText(/Game Over!/i)).toBeInTheDocument();

    // 4. Find and click the restart button
    const restartButton = screen.getByRole('button', { name: /Restart/i });
    fireEvent.click(restartButton);

    // 5. Check if the game state is reset
    expect(screen.getByText(/Score: 0/i)).toBeInTheDocument();
    expect(screen.queryByText(/Game Over!/i)).not.toBeInTheDocument();

    // 6. Optional: Check if the game can be started again
    fireEvent.keyDown(window, { code: 'Space' });
    // Check that bird moves or some game activity happens (hard to assert without more specific selectors/state)
    // For now, ensuring no errors and the game over message is gone is a good sign.
  });
});
