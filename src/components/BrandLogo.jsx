import React from 'react';
import logo from '../images/logoanix.png';

export default function BrandLogo({ className = '', alt = 'Anix Studio', width = 120, height = 44 }) {
  return (
    <img
      className={className}
      src={logo}
      alt={alt}
      width={width}
      height={height}
      style={{ display: 'block', objectFit: 'contain', filter: 'none', opacity: 1 }}
    />
  );
}
