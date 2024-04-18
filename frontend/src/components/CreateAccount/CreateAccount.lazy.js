import React, { lazy, Suspense } from 'react';

const LazyCreateAccount = lazy(() => import('./CreateAccount'));

const CreateAccount = props => (
  <Suspense fallback={null}>
    <LazyCreateAccount {...props} />
  </Suspense>
);

export default CreateAccount;
