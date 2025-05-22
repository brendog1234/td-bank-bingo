import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Bird from './Bird';

describe('Bird Component', () => {
  test('renders correctly and applies top style', () => {
    const topPosition = 250;
    render(<Bird top={topPosition} />);
    
    // The Bird component renders a single div. We can get it by role or testId if added.
    // For now, let's assume it's the only div or add a testId to Bird.js for robustness.
    // Let's try to find it by its style, though this is not ideal.
    // A better way would be to add data-testid="bird" to the div in Bird.js
    // For this exercise, we'll check its style.
    
    const birdElement = screen.getByRole('generic'); // This will get the div if it has no specific role
    // This is a bit fragile. If Bird.js div had a role or test id, it'd be better.
    // Let's assume Bird component is <div style={birdStyle}></div>
    
    // Check if the element is in the document
    expect(birdElement).toBeInTheDocument();
    
    // Check style
    // The actual div is a child of the fragment rendered by Bird, so we need to be more specific or add a test id.
    // If Bird.js is: const Bird = () => <div style={birdStyle} data-testid="bird"></div>;
    // Then we could do: screen.getByTestId('bird');

    // Given Bird.js is: return <div style={birdStyle}></div>;
    // And birdStyle has position: 'absolute', etc.
    // We need to ensure we are selecting the correct div.
    // Let's assume it's the only div rendered directly by the component.
    // The `getByRole('generic')` might be too broad.
    // A common pattern is to use a test-id. Let's write the test assuming we'd add `data-testid="bird"` to Bird.js
    // render(<Bird top={topPosition} data-testid="bird-component" />); //This won't work as data-testid is not a prop of Bird
    
    // Let's find the div by its default role if it's the only one.
    // The default role for a div is 'generic' if it doesn't have other specific roles.
    // However, RTL might not find it easily without a more specific selector if there are other divs.
    // For simplicity, let's assume it's the primary div rendered.
    // We will try to get it and check its style.
    // If Bird.js is just `return <div style={birdStyle}></div>;`, then screen.getByRole('generic') might be too loose.
    // Let's assume the `div` is the root element rendered by `Bird`.
    // A more direct way:
    const { container } = render(<Bird top={topPosition} />);
    const birdDiv = container.firstChild; // Gets the root div of the Bird component

    expect(birdDiv).toBeInTheDocument();
    expect(birdDiv).toHaveStyle(`top: ${topPosition}px`);
    expect(birdDiv).toHaveStyle('position: absolute');
    expect(birdDiv).toHaveStyle('left: 50px');
    expect(birdDiv).toHaveStyle('width: 30px');
    expect(birdDiv).toHaveStyle('height: 30px');
    expect(birdDiv).toHaveStyle('backgroundColor: yellow');
  });
});
