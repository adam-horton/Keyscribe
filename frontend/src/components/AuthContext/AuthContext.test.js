import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AuthContext from './AuthContext';

describe('<AuthContext />', () => {
  test('it should mount', () => {
    render(<AuthContext />);
    
    const authContext = screen.getByTestId('AuthContext');

    expect(authContext).toBeInTheDocument();
  });
});