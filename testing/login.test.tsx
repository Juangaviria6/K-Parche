import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../app/login';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { Alert } from 'react-native';

jest.mock('../config/firebase', () => ({
  auth: {}
}));

jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: {} })),
  updateProfile: jest.fn(),
}));

jest.mock('expo-linear-gradient', () => {
  const { View } = require('react-native');
  return {
    LinearGradient: View,
  };
});

jest.spyOn(Alert, 'alert');

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly in login mode', () => {
    const { getByText, getByPlaceholderText, queryByPlaceholderText } = render(<LoginScreen />);
    
    expect(getByText("ENTRAR A K'PARCHE")).toBeTruthy();
    expect(getByPlaceholderText('Correo electrónico')).toBeTruthy();
    expect(getByPlaceholderText('Contraseña')).toBeTruthy();
    
    expect(queryByPlaceholderText('Nombre completo')).toBeNull();
  });

  it('toggles to register mode', () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);
    
    const toggleButton = getByText('¿No tienes cuenta? Regístrate gratis');
    fireEvent.press(toggleButton);

    expect(getByText("CREAR CUENTA")).toBeTruthy();
    expect(getByPlaceholderText('Nombre completo')).toBeTruthy();
  });

  it('handles login form submission', async () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    
    const emailInput = getByPlaceholderText('Correo electrónico');
    const passwordInput = getByPlaceholderText('Contraseña');
    const submitBtn = getByText("ENTRAR A K'PARCHE");

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(submitBtn);

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(expect.anything(), 'test@example.com', 'password123');
    });
  });

  it('shows error alert when trying to login without credentials', () => {
    const { getByText } = render(<LoginScreen />);
    const submitBtn = getByText("ENTRAR A K'PARCHE");

    fireEvent.press(submitBtn);

    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Ingresa correo y contraseña');
  });
});
