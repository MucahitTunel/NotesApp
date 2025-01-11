require('react-native-reanimated').setUpTests();

// Mock EventEmitter and Animated
jest.mock('react-native/Libraries/Animated/Animated', () => ({
  Value: jest.fn(),
  timing: jest.fn(() => ({ start: jest.fn() })),
  spring: jest.fn(() => ({ start: jest.fn() })),
  createAnimatedComponent: (component) => component,
}));

// Suppress warning messages
jest.spyOn(console, 'warn').mockImplementation(() => {});
jest.spyOn(console, 'error').mockImplementation(() => {});

// Mock Dimensions
jest.mock('react-native/Libraries/Utilities/Dimensions', () => ({
  get: jest.fn().mockReturnValue({ width: 375, height: 812 }),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
})); 