import React, { lazy, Suspense } from 'react';

const LazySession = lazy(() => import('./Session'));

const Session = props => (
  <Suspense fallback={null}>
    <LazySession {...props} />
  </Suspense>
);

export default Session;
