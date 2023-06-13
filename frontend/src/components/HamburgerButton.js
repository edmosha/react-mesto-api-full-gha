import React from 'react';

function HamburgerButton(props) {
  const lineClass = `hamburger__line ${props.isOpen ? 'hamburger__line_opened' : ''}`;

  return (
    <button className="hamburger" onClick={props.handleClick}>
      <div className={lineClass} />
      <div className={lineClass} />
      <div className={lineClass} />
    </button>
  );
}

export default HamburgerButton;
