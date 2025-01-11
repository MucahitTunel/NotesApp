import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Animated } from 'react-native';
import CustomHeader from '../src/components/CustomHeader';

describe('CustomHeader', () => {
  const defaultProps = {
    title: 'Test Title',
    scrollY: new Animated.Value(0),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with title', () => {
    const { getByText } = render(<CustomHeader {...defaultProps} />);
    expect(getByText('Test Title')).toBeTruthy();
  });

  it('renders right icon when provided', () => {
    const mockOnRightPress = jest.fn();
    const { getByTestId } = render(
      <CustomHeader
        {...defaultProps}
        rightIcon="add-circle-outline"
        onRightPress={mockOnRightPress}
      />
    );
    
    const rightIcon = getByTestId('right-icon');
    expect(rightIcon).toBeTruthy();
    
    fireEvent.press(rightIcon);
    expect(mockOnRightPress).toHaveBeenCalledTimes(1);
  });

  it('does not render right icon when not provided', () => {
    const { queryByTestId } = render(
      <CustomHeader {...defaultProps} />
    );
    expect(queryByTestId('right-icon')).toBeNull();
  });
}); 