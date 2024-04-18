import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CreateAccount from './CreateAccount';

describe('<CreateAccount />', () => {
  test('it should mount', () => {
    render(<CreateAccount />);
    
    const createAccount = screen.getByTestId('CreateAccount');

    expect(createAccount).toBeInTheDocument();
  });
});