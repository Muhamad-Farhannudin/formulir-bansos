import React from 'react';

export default function Button({ type, className, onClick, children, disabled }) {
  return (
    <button type={type} className={className} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
