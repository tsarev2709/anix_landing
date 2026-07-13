import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import { resolveSeoRoute } from './SeoHead';

export default function RouteBreadcrumbsPortal({ path }) {
  const [host, setHost] = useState(null);
  const route = resolveSeoRoute(path);
  const hasBreadcrumbs = (route.breadcrumbs || []).length > 1;

  useEffect(() => {
    if (!hasBreadcrumbs) return undefined;

    let createdHost = null;
    let observer = null;

    const attach = () => {
      if (document.querySelector('.seo-breadcrumbs')) return true;
      const main = document.querySelector('main');
      if (!main) return false;

      const anchor = main.querySelector(':scope > header, :scope > nav, header, nav');
      createdHost = document.createElement('div');
      createdHost.className = 'seo-breadcrumbs-host';

      if (anchor?.parentNode) {
        anchor.parentNode.insertBefore(createdHost, anchor.nextSibling);
      } else {
        main.insertBefore(createdHost, main.firstChild);
      }

      setHost(createdHost);
      return true;
    };

    if (!attach()) {
      observer = new MutationObserver(() => {
        if (attach()) observer?.disconnect();
      });
      observer.observe(document.getElementById('root') || document.body, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      observer?.disconnect();
      if (createdHost?.parentNode) createdHost.parentNode.removeChild(createdHost);
      setHost(null);
    };
  }, [hasBreadcrumbs, path]);

  if (!host) return null;
  return createPortal(<Breadcrumbs path={path} />, host);
}
