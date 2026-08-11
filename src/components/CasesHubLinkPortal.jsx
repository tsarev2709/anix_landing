import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowRight } from 'lucide-react';
import './CasesHubLinkPortal.css';

export default function CasesHubLinkPortal({ path }) {
  const [mountNode, setMountNode] = useState(null);

  useEffect(() => {
    if (path !== '/') return undefined;

    let portalNode = null;
    let observer = null;

    const attach = () => {
      const casesHead = document.querySelector('.d1-cases .d1-section-head-row');
      if (!casesHead || portalNode) return false;

      portalNode = document.createElement('div');
      portalNode.dataset.casesHubLinkPortal = 'true';
      casesHead.parentNode.insertBefore(portalNode, casesHead.nextSibling);
      setMountNode(portalNode);
      return true;
    };

    if (!attach()) {
      observer = new MutationObserver(() => {
        if (attach() && observer) observer.disconnect();
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }

    return () => {
      if (observer) observer.disconnect();
      if (portalNode?.parentNode) portalNode.parentNode.removeChild(portalNode);
    };
  }, [path]);

  if (path !== '/' || !mountNode) return null;

  return createPortal(
    <div className="d1-cases-hub-link-wrap">
      <a className="d1-button d1-button-secondary d1-cases-hub-link" href="/cases/">
        Смотреть все кейсы
        <ArrowRight aria-hidden="true" />
      </a>
    </div>,
    mountNode,
  );
}
