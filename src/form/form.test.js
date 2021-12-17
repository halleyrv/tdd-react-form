import React from 'react';
import {screen, render, fireEvent} from '@testing-library/react';
import {Form} from './form';

describe('when the form is mounted', () => {
  beforeEach(() => render(<Form />));
  it('there must be a create product from page', () => {
    expect(
      screen.getByRole('heading', {name: /create product/i}),
    ).toBeInTheDocument();
  });

  it('should exist the fields: name, size, type (electronic, furniture, clothing', () => {
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/size/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/type/i)).toBeInTheDocument();

    expect(screen.queryByText(/electronic/i)).toBeInTheDocument();
    expect(screen.queryByText(/furniture/i)).toBeInTheDocument();
    expect(screen.queryByText(/clothing/i)).toBeInTheDocument();
  });

  it('should exists submit button', () => {
    expect(screen.getByRole('button', {name: /submit/i})).toBeInTheDocument();
  });
});

describe('when the user submits the form without values', () => {
  it('should display validation messages', () => {
    render(<Form />);
    expect(screen.queryByText(/name is required/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/size is required/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/type is required/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', {name: /submit/i}));
    expect(screen.queryByText(/name is required/i)).toBeInTheDocument();
    expect(screen.queryByText(/size is required/i)).toBeInTheDocument();
    expect(screen.queryByText(/type is required/i)).toBeInTheDocument();
  });
});
