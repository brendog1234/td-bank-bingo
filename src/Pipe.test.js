import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Pipe from './Pipe';

describe('Pipe Component', () => {
  const defaultProps = {
    pipeHeight: 200, // Height of the top pipe
    pipeWidth: 60,
    left: 100,
    gap: 150,
    gameHeight: 700,
  };

  test('renders both top and bottom pipes', () => {
    const { container } = render(<Pipe {...defaultProps} />);
    // The Pipe component renders two divs directly
    const pipeDivs = container.querySelectorAll('div');
    expect(pipeDivs.length).toBe(2);
  });

  test('applies correct styles to the top pipe', () => {
    const { container } = render(<Pipe {...defaultProps} />);
    const topPipe = container.firstChild; // First div is the top pipe

    expect(topPipe).toHaveStyle(`position: absolute`);
    expect(topPipe).toHaveStyle(`left: ${defaultProps.left}px`);
    expect(topPipe).toHaveStyle(`top: 0px`); // Top pipe is always at the top
    expect(topPipe).toHaveStyle(`width: ${defaultProps.pipeWidth}px`);
    expect(topPipe).toHaveStyle(`height: ${defaultProps.pipeHeight}px`);
    expect(topPipe).toHaveStyle('backgroundColor: green');
  });

  test('applies correct styles to the bottom pipe', () => {
    const { container } = render(<Pipe {...defaultProps} />);
    const bottomPipe = container.childNodes[1]; // Second div is the bottom pipe

    const expectedBottomPipeHeight = defaultProps.gameHeight - defaultProps.pipeHeight - defaultProps.gap;

    expect(bottomPipe).toHaveStyle(`position: absolute`);
    expect(bottomPipe).toHaveStyle(`left: ${defaultProps.left}px`);
    expect(bottomPipe).toHaveStyle(`bottom: 0px`); // Bottom pipe is always at the bottom
    expect(bottomPipe).toHaveStyle(`width: ${defaultProps.pipeWidth}px`);
    expect(bottomPipe).toHaveStyle(`height: ${expectedBottomPipeHeight}px`);
    expect(bottomPipe).toHaveStyle('backgroundColor: green');
  });

  test('handles different prop values correctly for bottom pipe height', () => {
    const customProps = {
      ...defaultProps,
      pipeHeight: 300,
      gap: 100,
      gameHeight: 800,
    };
    const { container } = render(<Pipe {...customProps} />);
    const bottomPipe = container.childNodes[1];
    const expectedBottomPipeHeight = customProps.gameHeight - customProps.pipeHeight - customProps.gap;
    
    expect(bottomPipe).toHaveStyle(`height: ${expectedBottomPipeHeight}px`);
  });
});
