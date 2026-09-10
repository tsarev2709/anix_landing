import React from 'react';
import { ArrowRight } from 'lucide-react';
import './ProjectCta.css';

export default function ProjectCta({
  className = '',
  task,
  scope,
  cta = 'hero',
}) {
  return (
    <a
      className={`${className} project-cta`}
      href="#website-lead-form"
      onClick={() => {
        window.dispatchEvent(
          new CustomEvent('anix:brief-prefill', {
            detail: { task, scope, cta },
          })
        );
      }}
    >
      <span>
        Получить 3 формата и вилку бюджета<small>за 1 рабочий день</small>
      </span>
      <ArrowRight aria-hidden="true" />
    </a>
  );
}
