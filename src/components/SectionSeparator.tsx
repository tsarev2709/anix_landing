import React from 'react';

export default function SectionSeparator({
  position = 'bottom',
  variant = 'gradient',
}: {
  position?: 'top' | 'bottom';
  variant?: 'gradient' | 'curve';
}) {
  if (variant === 'gradient') {
    return null;
  }
  return <div className={`sep sep--${position} sep--${variant}`} aria-hidden />;
}
