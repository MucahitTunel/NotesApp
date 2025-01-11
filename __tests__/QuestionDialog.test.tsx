import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import QuestionDialog from '../src/components/QuestionDialog';

describe('QuestionDialog', () => {
  const mockOnCancel = jest.fn();
  const mockOnConfirm = jest.fn();
  const defaultProps = {
    visible: true,
    title: 'Test Title',
    message: 'Test Message',
    onCancel: mockOnCancel,
    onConfirm: mockOnConfirm,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when visible', () => {
    const { getByText } = render(<QuestionDialog {...defaultProps} />);

    expect(getByText('Test Title')).toBeTruthy();
    expect(getByText('Test Message')).toBeTruthy();
    expect(getByText('İptal')).toBeTruthy();
    expect(getByText('Sil')).toBeTruthy();
  });

  it('does not render when not visible', () => {
    const { queryByText } = render(
      <QuestionDialog {...defaultProps} visible={false} />
    );

    expect(queryByText('Test Title')).toBeNull();
    expect(queryByText('Test Message')).toBeNull();
  });

  it('calls onCancel when cancel button is pressed', () => {
    const { getByText } = render(<QuestionDialog {...defaultProps} />);
    
    fireEvent.press(getByText('İptal'));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
    expect(mockOnConfirm).not.toHaveBeenCalled();
  });

  it('calls onConfirm when confirm button is pressed', () => {
    const { getByText } = render(<QuestionDialog {...defaultProps} />);
    
    fireEvent.press(getByText('Sil'));
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    expect(mockOnCancel).not.toHaveBeenCalled();
  });
}); 