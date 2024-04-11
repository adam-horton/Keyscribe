import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Session from './Session';

describe('<Session />', () => {
  test('it should mount', () => {
    render(<Session />);
    
    const session = screen.getByTestId('Session');

    expect(session).toBeInTheDocument();
  });
});