import React from 'react';

const Bird = ({ top }) => {
  const birdStyle = {
    position: 'absolute',
    left: '50px',
    top: `${top}px`,
    width: '30px',
    height: '30px',
    backgroundColor: 'yellow',
    borderRadius: '50%',
    boxShadow: '0px 2px 5px rgba(0,0,0,0.2)',
  };

  return <div style={birdStyle}></div>;
};

export default Bird;
