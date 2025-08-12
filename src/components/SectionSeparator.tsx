export default function SectionSeparator({position='bottom', variant='gradient'}:{
  position?: 'top'|'bottom', variant?: 'gradient'|'curve'
}) {
  return <div className={`sep sep--${position} sep--${variant}`} aria-hidden />;
}
