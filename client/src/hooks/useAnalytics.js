import { useEffect } from 'react';
import { analyticsApi } from '../api';

export function usePageTracking() {
  useEffect(() => {
    if (import.meta.env.PROD) {
      analyticsApi.trackView({
        path: window.location.pathname,
        referrer: document.referrer || '',
      }).catch(() => {});
    }
  }, []);
}

export function trackEvent(event, element, label, page) {
  if (import.meta.env.PROD) {
    analyticsApi.trackEvent({
      event,
      element: element || '',
      label: label || '',
      page: page || window.location.pathname,
    }).catch(() => {});
  }
}
