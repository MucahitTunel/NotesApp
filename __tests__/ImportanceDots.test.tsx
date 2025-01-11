import React from 'react';
import { render } from '@testing-library/react-native';
import ImportanceDots from '../src/components/ImportanceDots';
import { COLORS } from '../src/constants/colors';

describe('ImportanceDots', () => {
  it('renders correctly with level 1', () => {
    const { getAllByTestId } = render(<ImportanceDots level={1} />);
    const dots = getAllByTestId('importance-dot');
    
    expect(dots).toHaveLength(5);
    expect(dots[0]).toHaveStyle({ backgroundColor: COLORS.IMPORTANCE.LEVEL_1 });
    expect(dots[1]).toHaveStyle({ backgroundColor: COLORS.IMPORTANCE.INACTIVE });
    expect(dots[2]).toHaveStyle({ backgroundColor: COLORS.IMPORTANCE.INACTIVE });
    expect(dots[3]).toHaveStyle({ backgroundColor: COLORS.IMPORTANCE.INACTIVE });
    expect(dots[4]).toHaveStyle({ backgroundColor: COLORS.IMPORTANCE.INACTIVE });
  });

  it('renders correctly with level 3', () => {
    const { getAllByTestId } = render(<ImportanceDots level={3} />);
    const dots = getAllByTestId('importance-dot');
    
    expect(dots).toHaveLength(5);
    expect(dots[0]).toHaveStyle({ backgroundColor: COLORS.IMPORTANCE.LEVEL_1 });
    expect(dots[1]).toHaveStyle({ backgroundColor: COLORS.IMPORTANCE.LEVEL_2 });
    expect(dots[2]).toHaveStyle({ backgroundColor: COLORS.IMPORTANCE.LEVEL_3 });
    expect(dots[3]).toHaveStyle({ backgroundColor: COLORS.IMPORTANCE.INACTIVE });
    expect(dots[4]).toHaveStyle({ backgroundColor: COLORS.IMPORTANCE.INACTIVE });
  });

  it('renders correctly with level 5', () => {
    const { getAllByTestId } = render(<ImportanceDots level={5} />);
    const dots = getAllByTestId('importance-dot');
    
    expect(dots).toHaveLength(5);
    expect(dots[0]).toHaveStyle({ backgroundColor: COLORS.IMPORTANCE.LEVEL_1 });
    expect(dots[1]).toHaveStyle({ backgroundColor: COLORS.IMPORTANCE.LEVEL_2 });
    expect(dots[2]).toHaveStyle({ backgroundColor: COLORS.IMPORTANCE.LEVEL_3 });
    expect(dots[3]).toHaveStyle({ backgroundColor: COLORS.IMPORTANCE.LEVEL_4 });
    expect(dots[4]).toHaveStyle({ backgroundColor: COLORS.IMPORTANCE.LEVEL_5 });
  });

  it('renders with default styles when level is invalid', () => {
    // @ts-ignore - Testing invalid input
    const { getAllByTestId } = render(<ImportanceDots level={6} />);
    const dots = getAllByTestId('importance-dot');
    
    expect(dots).toHaveLength(5);
    dots.forEach(dot => {
      expect(dot).toHaveStyle({ backgroundColor: COLORS.IMPORTANCE.INACTIVE });
    });
  });
}); 