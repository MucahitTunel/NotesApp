import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import StatusDialog from '../src/components/StatusDialog';

describe('StatusDialog', () => {
  const mockOnClose = jest.fn();
  const defaultProps = {
    visible: true,
    type: 'success' as const,
    message: 'Test Message',
    onClose: mockOnClose,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when visible with success type', () => {
    const { getByText, getByTestId } = render(<StatusDialog {...defaultProps} />);

    expect(getByText('Başarılı')).toBeTruthy();
    expect(getByText('Test Message')).toBeTruthy();
    expect(getByTestId('status-icon')).toBeTruthy();
    expect(getByText('Tamam')).toBeTruthy();
  });

  it('renders correctly when visible with error type', () => {
    const { getByText, getByTestId } = render(
      <StatusDialog {...defaultProps} type="error" />
    );

    expect(getByText('Hata')).toBeTruthy();
    expect(getByText('Test Message')).toBeTruthy();
    expect(getByTestId('status-icon')).toBeTruthy();
    expect(getByText('Tamam')).toBeTruthy();
  });

  it('does not render when not visible', () => {
    const { queryByText } = render(
      <StatusDialog {...defaultProps} visible={false} />
    );

    expect(queryByText('Başarılı')).toBeNull();
    expect(queryByText('Test Message')).toBeNull();
  });

  it('calls onClose when confirm button is pressed', () => {
    const { getByText } = render(<StatusDialog {...defaultProps} />);
    
    fireEvent.press(getByText('Tamam'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
}); 