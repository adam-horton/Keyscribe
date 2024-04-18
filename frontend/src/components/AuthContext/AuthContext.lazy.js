import React, { lazy, Suspense } from 'react';

const LazyAuthContext = lazy(() => import('./AuthContext'));

const AuthContext = props => (
  <Suspense fallback={null}>
    <LazyAuthContext {...props} />
  </Suspense>
);

export default AuthContext;
