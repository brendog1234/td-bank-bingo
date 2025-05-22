import React from 'react';

const Pipe = ({ pipeHeight, pipeWidth, left, gap, gameHeight }) => {
  const topPipeStyle = {
    position: 'absolute',
    left: `${left}px`,
    top: 0,
    width: `${pipeWidth}px`,
    height: `${pipeHeight}px`,
    backgroundColor: 'green',
    border: '2px solid #000',
  };

  const bottomPipeHeight = gameHeight - pipeHeight - gap;
  const bottomPipeStyle = {
    position: 'absolute',
    left: `${left}px`,
    bottom: 0,
    width: `${pipeWidth}px`,
    height: `${bottomPipeHeight}px`,
    backgroundColor: 'green',
    border: '2px solid #000',
  };

  return (
    <>
      <div style={topPipeStyle}></div>
      <div style={bottomPipeStyle}></div>
    </>
  );
};

export default Pipe;
