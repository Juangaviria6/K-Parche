import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../app/login';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
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

describe('Register Flow in LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('navigates to register view and displays correct fields', () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);
    
    fireEvent.press(getByText('¿No tienes cuenta? Regístrate gratis'));

    expect(getByText('CREAR CUENTA')).toBeTruthy();
    expect(getByPlaceholderText('Nombre completo')).toBeTruthy();
    expect(getByPlaceholderText('Correo electrónico')).toBeTruthy();
    expect(getByPlaceholderText('Contraseña')).toBeTruthy();
  });

  it('shows error alert when trying to register without complete name', () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);
    
    fireEvent.press(getByText('¿No tienes cuenta? Regístrate gratis'));

    const emailInput = getByPlaceholderText('Correo electrónico');
    const passwordInput = getByPlaceholderText('Contraseña');
    const submitBtn = getByText('CREAR CUENTA');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(submitBtn);

    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Ingresa tu nombre completo');
  });

  it('handles successful registration submission', async () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);
    
    fireEvent.press(getByText('¿No tienes cuenta? Regístrate gratis'));

    const nameInput = getByPlaceholderText('Nombre completo');
    const emailInput = getByPlaceholderText('Correo electrónico');
    const passwordInput = getByPlaceholderText('Contraseña');
    const submitBtn = getByText('CREAR CUENTA');

    fireEvent.changeText(nameInput, 'Juan Perez');
    fireEvent.changeText(emailInput, 'juan@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    
    fireEvent.press(submitBtn);

    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(expect.anything(), 'juan@example.com', 'password123');
      expect(updateProfile).toHaveBeenCalledWith(expect.anything(), { displayName: 'Juan Perez' });
    });
  });
});
