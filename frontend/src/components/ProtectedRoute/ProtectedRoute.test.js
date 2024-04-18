import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ProtectedRoute from './ProtectedRoute';

describe('<ProtectedRoute />', () => {
  test('it should mount', () => {
    render(<ProtectedRoute />);
    
    const protectedRoute = screen.getByTestId('ProtectedRoute');

    expect(protectedRoute).toBeInTheDocument();
  });
});