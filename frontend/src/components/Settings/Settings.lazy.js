import React, { lazy, Suspense } from 'react';

const LazySettings = lazy(() => import('./Settings'));

const Settings = props => (
  <Suspense fallback={null}>
    <LazySettings {...props} />
  </Suspense>
);

export default Settings;
