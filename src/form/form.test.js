import React from 'react';
import {screen, render, fireEvent, waitFor} from '@testing-library/react';
import {Form} from './form';
import {rest} from 'msw';
import {setupServer} from 'msw/node';
import {CREATED_STATUS, ERROR_SERVER_STATUS} from '../consts/httpStatus';

const server = setupServer(
  rest.post('/products', (req, res, ctx) => {
    const {name, size, type} = req.body;
    if (name && size && type) {
      return res(ctx.status(CREATED_STATUS));
    }
    return res(ctx.status(ERROR_SERVER_STATUS));
  }),
);

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

beforeEach(() => render(<Form />));

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers());

describe('when the form is mounted', () => {
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
    expect(screen.queryByText(/name is required/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/size is required/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/type is required/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', {name: /submit/i}));
    expect(screen.queryByText(/name is required/i)).toBeInTheDocument();
    expect(screen.queryByText(/size is required/i)).toBeInTheDocument();
    expect(screen.queryByText(/type is required/i)).toBeInTheDocument();
  });
});

describe('when the user blurs an empty field', () => {
  it('should display a validation error message for the input name', () => {
    fireEvent.blur(screen.getByLabelText(/name/i), {
      target: {name: 'name', value: ''},
    });
    expect(screen.queryByText(/name is required/i)).toBeInTheDocument();
  });

  it('should display a validations error message for the input size', () => {
    fireEvent.blur(screen.getByLabelText(/size/i), {
      target: {name: 'size', value: ''},
    });
    expect(screen.queryByText(/size is required/i)).toBeInTheDocument();
  });
});

describe('when the user submits the form and the server returns created', () => {
  it('should the submit button be disabled until is done', async () => {
    const submitButton = screen.getByRole('button', {name: /submit/i});
    expect(submitButton).not.toBeDisabled();
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });

  it('the form page must display the success message "Product stored" and clean the fields values', async () => {
    const nameInput = screen.getByLabelText(/name/i);
    const sizeInput = screen.getByLabelText(/size/i);
    const typeInput = screen.getByLabelText(/type/i);

    expect(nameInput).toBeInTheDocument();
    expect(sizeInput).toBeInTheDocument();
    expect(typeInput).toBeInTheDocument();

    fireEvent.change(nameInput, {
      target: {name: 'name', value: 'my product'},
    });
    fireEvent.change(sizeInput, {
      target: {name: 'name', value: 10},
    });
    fireEvent.change(typeInput, {
      target: {name: 'name', value: 'electronic'},
    });

    fireEvent.click(screen.getByRole('button', {name: /submit/i}));
    await waitFor(() =>
      expect(screen.getByText(/product stored/i)).toBeInTheDocument(),
    );

    expect(nameInput).toHaveValue('');
    expect(sizeInput).toHaveValue('');
    expect(typeInput).toHaveValue('');
  });
});

describe('when the users submits the form and the server returns an unexpected error', () => {
  it('the form page must display the error message "Unexpected error, please try again"', async () => {
    fireEvent.click(screen.getByRole('button', {name: /submit/i}));
    await waitFor(() =>
      expect(screen.getByText(/unexpected error/i)).toBeInTheDocument(),
    );
  });
});

describe('when the users submits the form and the server returns an invalid  request error', () => {
  it('the form page must display the error message "The form is invalid, the fields [field1...fieldN] are required"', async () => {
    server.use(
      rest.post('/products', (req, res, ctx) => {
        // Respond with "500 Internal Server Error" status for this test.
        return res(
          ctx.status(400),
          ctx.json({
            message:
              'the form is invalid, the fields name, size, type are required',
          }),
        );
      }),
    );
    fireEvent.click(screen.getByRole('button', {name: /submit/i}));
    await waitFor(() =>
      expect(
        screen.getByText(
          /the form is invalid, the fields name, size, type are required/i,
        ),
      ).toBeInTheDocument(),
    );
  });
});

describe('when the users submits the form and the server returns unfound server', () => {
  it('the form page must display the error message "connection error please try later"', async () => {
    server.use(
      rest.post('/products', (req, res) =>
        res.networkError('Failed to connect'),
      ),
    );
    fireEvent.click(screen.getByRole('button', {name: /submit/i}));
    await waitFor(() =>
      expect(
        screen.getByText(/connection error, please try later/i),
      ).toBeInTheDocument(),
    );
  });
});
