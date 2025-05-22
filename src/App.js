import React, { useState, useEffect } from 'react';
import Bird from './Bird';
import Pipe from './Pipe';

const BIRD_HEIGHT = 30;
const BIRD_WIDTH = 30; // Assuming bird width is same as height for collision
const BIRD_LEFT_POSITION = 50; // Bird's fixed horizontal position

const GAME_HEIGHT = 700;
const GAME_WIDTH = 500;
const GRAVITY = 0.5;
const FLAP_STRENGTH = -10;
const INITIAL_BIRD_POSITION = GAME_HEIGHT / 2 - BIRD_HEIGHT / 2;

const PIPE_WIDTH = 60;
const PIPE_GAP = 150;
const PIPE_SPEED = 2; // Pixels per game loop interval
const PIPE_GENERATION_INTERVAL = 1500; // Milliseconds

function App() {
  const [birdPosition, setBirdPosition] = useState(INITIAL_BIRD_POSITION);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [gameHasStarted, setGameHasStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [pipes, setPipes] = useState([]);
  const [score, setScore] = useState(0);

  const restartGame = () => {
    setBirdPosition(INITIAL_BIRD_POSITION);
    setBirdVelocity(0);
    setPipes([]);
    setScore(0);
    setGameOver(false);
    setGameHasStarted(false);
  };

  // Game loop - main physics and game logic
  useEffect(() => {
    let gameLoopInterval;
    if (gameHasStarted && !gameOver) {
      gameLoopInterval = setInterval(() => {
        // Bird physics
        setBirdVelocity(prevVelocity => {
          const newVelocity = prevVelocity + GRAVITY;
          setBirdPosition(prevPosition => {
            let newPosition = prevPosition + newVelocity;

            // Ceiling collision
            if (newPosition < 0) {
              setGameOver(true);
              return 0;
            }
            // Floor collision
            if (newPosition > GAME_HEIGHT - BIRD_HEIGHT) {
              setGameOver(true);
              return GAME_HEIGHT - BIRD_HEIGHT;
            }
            return newPosition;
          });
          return newVelocity;
        });

        // Pipe movement and scoring
        setPipes(prevPipes => {
          let newScore = score;
          const newPipes = prevPipes
            .map(pipe => ({ ...pipe, left: pipe.left - PIPE_SPEED }))
            .filter(pipe => pipe.left > -PIPE_WIDTH); // Remove off-screen pipes

          newPipes.forEach(pipe => {
            if (!pipe.scored && pipe.left + PIPE_WIDTH < BIRD_LEFT_POSITION) {
              newScore++;
              pipe.scored = true; // Mark as scored
            }
          });
          if (newScore !== score) setScore(newScore); // Update score if changed
          return newPipes;
        });

        // Collision detection: Bird vs Pipes
        pipes.forEach(pipe => {
          const birdRight = BIRD_LEFT_POSITION + BIRD_WIDTH;
          const pipeRight = pipe.left + PIPE_WIDTH;

          // Check X overlap
          if (birdRight > pipe.left && BIRD_LEFT_POSITION < pipeRight) {
            // Check Y overlap
            const birdBottom = birdPosition + BIRD_HEIGHT;
            if (birdPosition < pipe.height || birdBottom > pipe.height + PIPE_GAP) {
              setGameOver(true);
            }
          }
        });
      }, 20); // Approx 50 FPS
    }
    return () => clearInterval(gameLoopInterval);
  }, [gameHasStarted, gameOver, birdPosition, pipes, score]); // Added birdPosition, pipes, score to dependencies

  // Pipe generation
  useEffect(() => {
    let pipeGenerationTimer;
    if (gameHasStarted && !gameOver) {
      pipeGenerationTimer = setInterval(() => {
        setPipes(prevPipes => {
          const newPipeHeight = Math.floor(Math.random() * (GAME_HEIGHT - PIPE_GAP - 100)) + 50; // 50 is min top/bottom margin
          return [
            ...prevPipes,
            {
              id: Date.now(),
              left: GAME_WIDTH,
              height: newPipeHeight,
              scored: false,
            },
          ];
        });
      }, PIPE_GENERATION_INTERVAL);
    }
    return () => clearInterval(pipeGenerationTimer);
  }, [gameHasStarted, gameOver]);

  // Flap mechanism
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space' && !gameOver) {
        if (!gameHasStarted) {
          setGameHasStarted(true);
        }
        setBirdVelocity(FLAP_STRENGTH);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameHasStarted, gameOver]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
      <div
        className="game-area"
        style={{
          position: 'relative', // Needed for absolute positioning of children
          overflow: 'hidden', // To hide pipes moving outside
          width: `${GAME_WIDTH}px`, // Ensure game-area dimensions are applied
          height: `${GAME_HEIGHT}px`,
          // backgroundColor is now handled by index.css
          border: '1px solid black', // Already in index.css but good for explicitness
        }}
      >
        <div style={{
          position: 'absolute',
          top: '20px', // Adjusted for better spacing
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '30px', // Slightly larger score
          fontWeight: 'bold',
          color: 'white',
          zIndex: 100, // Ensure score is above pipes
          fontFamily: 'Arial, sans-serif',
          textShadow: '2px 2px 3px rgba(0,0,0,0.5)', // Text shadow for better readability
        }}>
          Score: {score}
        </div>

        {!gameHasStarted && !gameOver && (
          <div style={{
            position: 'absolute',
            top: '40%', // Positioned below score
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: 'white',
            fontSize: '20px',
            fontFamily: 'Arial, sans-serif',
            zIndex: 150, // Above pipes, below score if overlap
            textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
          }}>
            <p>Press Spacebar to Flap</p>
            <p>Avoid the Pipes!</p>
          </div>
        )}

        <Bird top={birdPosition} />
        {pipes.map(pipe => (
          <Pipe
            key={pipe.id}
            pipeHeight={pipe.height}
            pipeWidth={PIPE_WIDTH}
            left={pipe.left}
            gap={PIPE_GAP}
            gameHeight={GAME_HEIGHT}
          />
        ))}

        {gameOver && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.75)', // Slightly darker overlay
            padding: '30px', // More padding
            borderRadius: '10px',
            zIndex: 200, // Ensure game over message is on top
            fontFamily: 'Arial, sans-serif',
            color: 'white', // Default text color for this box
          }}>
            <h2 style={{ margin: '0 0 15px 0', fontSize: '32px', fontWeight: 'bold' }}>Game Over!</h2>
            <p style={{ margin: '0 0 20px 0', fontSize: '18px' }}>Final Score: {score}</p>
            <button
              onClick={restartGame}
              style={{
                padding: '12px 25px', // Larger button
                fontSize: '18px',
                color: 'white',
                backgroundColor: '#4CAF50', // Green
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold',
                boxShadow: '0px 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              Restart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
