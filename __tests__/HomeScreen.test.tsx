import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import HomeScreen from '../src/screens/HomeScreen';
import { RealmContext } from '../src/realm/config';

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
};

// Mock notes data
const mockNotes = [
  {
    _id: '1',
    title: 'Test Note 1',
    content: 'Test Content 1',
    importance: 3,
    createdAt: new Date('2024-01-01'),
  },
  {
    _id: '2',
    title: 'Test Note 2',
    content: 'Test Content 2',
    importance: 5,
    createdAt: new Date('2024-01-02'),
  },
];

// Mock realm context
const mockRealm = {
  write: jest.fn((callback) => callback()),
  delete: jest.fn(),
  objectForPrimaryKey: jest.fn((_, id) => mockNotes.find(note => note._id === id)),
};

// Mock user context
jest.mock('../src/context/UserContext', () => ({
  useUser: () => ({ username: 'Test User', setUsername: jest.fn() })
}));

const MockProviders = ({ children }: { children: React.ReactNode }) => {
  const { RealmProvider } = RealmContext;
  return (
    <RealmProvider>
      {children}
    </RealmProvider>
  );
};

// Mock useRealm and useQuery hooks
jest.mock('@realm/react', () => ({
  ...jest.requireActual('@realm/react'),
  useRealm: () => mockRealm,
  useQuery: () => mockNotes,
}));

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(
      <MockProviders>
        <HomeScreen navigation={mockNavigation} />
      </MockProviders>
    );

    expect(getByText('Test User\'in Notları')).toBeTruthy();
    expect(getByPlaceholderText('Not ara...')).toBeTruthy();
    expect(getByText('Test Note 1')).toBeTruthy();
    expect(getByText('Test Note 2')).toBeTruthy();
  });

  it('filters notes by search text', () => {
    const { getByPlaceholderText, getByText, queryByText } = render(
      <MockProviders>
        <HomeScreen navigation={mockNavigation} />
      </MockProviders>
    );

    const searchInput = getByPlaceholderText('Not ara...');
    fireEvent.changeText(searchInput, 'Note 1');

    expect(getByText('Test Note 1')).toBeTruthy();
    expect(queryByText('Test Note 2')).toBeNull();
  });

  it('sorts notes by importance', () => {
    const { getByText, getAllByTestId } = render(
      <MockProviders>
        <HomeScreen navigation={mockNavigation} />
      </MockProviders>
    );

    fireEvent.press(getByText('Önemli'));
    const notes = getAllByTestId('note-item');
    expect(notes[0]).toHaveTextContent('Test Note 2'); // importance: 5
    expect(notes[1]).toHaveTextContent('Test Note 1'); // importance: 3
  });

  it('deletes selected notes', async () => {
    const { getByText, getAllByTestId } = render(
      <MockProviders>
        <HomeScreen navigation={mockNavigation} />
      </MockProviders>
    );

    // Select first note
    const note = getAllByTestId('note-item')[0];
    fireEvent(note, 'longPress');

    // Verify selection mode is active
    expect(getByText('1 not seçildi')).toBeTruthy();

    // Press delete button
    fireEvent.press(getByText('trash-outline'));

    // Confirm deletion
    fireEvent.press(getByText('Sil'));

    await waitFor(() => {
      expect(mockRealm.write).toHaveBeenCalled();
      expect(mockRealm.delete).toHaveBeenCalled();
      expect(getByText('Not başarıyla silindi.')).toBeTruthy();
    });
  });

  it('navigates to add note screen', () => {
    const { getByText } = render(
      <MockProviders>
        <HomeScreen navigation={mockNavigation} />
      </MockProviders>
    );

    fireEvent.press(getByText('add-circle-outline'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('AddNote');
  });

  it('cancels selection mode', () => {
    const { getByText, getAllByTestId, queryByText } = render(
      <MockProviders>
        <HomeScreen navigation={mockNavigation} />
      </MockProviders>
    );

    // Select first note
    const note = getAllByTestId('note-item')[0];
    fireEvent(note, 'longPress');

    // Verify selection mode is active
    expect(getByText('1 not seçildi')).toBeTruthy();

    // Press back button to cancel selection
    fireEvent.press(getByText('back'));

    // Verify selection mode is deactivated
    expect(queryByText('1 not seçildi')).toBeNull();
  });
}); 