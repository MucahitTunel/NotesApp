import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';
import EditNoteScreen from '../src/screens/EditNoteScreen';
import { RealmContext } from '../src/realm/config';
import '@testing-library/jest-native/extend-expect';

// Mock navigation
const mockNavigation = {
  goBack: jest.fn(),
};

// Mock route
const mockRoute = {
  params: {
    noteId: '1',
  },
};

// Mock note data
const mockNote = {
  _id: '1',
  title: 'Test Note',
  content: 'Test Content',
  importance: 3,
  createdAt: new Date('2024-01-01'),
};

// Mock realm context
const mockRealm = {
  write: jest.fn((callback) => callback()),
  objectForPrimaryKey: jest.fn(() => mockNote),
};

// Mock useRealm hook
jest.mock('@realm/react', () => ({
  ...jest.requireActual('@realm/react'),
  useRealm: () => mockRealm,
}));

const MockRealmProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <RealmContext.RealmProvider
      sync={10}
      fallback={<Text>Loading...</Text>}>
      {children}
    </RealmContext.RealmProvider>
  );
};

describe('EditNoteScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with existing note data', () => {
    const { getByPlaceholderText, getByText } = render(
      <MockRealmProvider>
        <EditNoteScreen navigation={mockNavigation} route={mockRoute} />
      </MockRealmProvider>
    );

    const titleInput = getByPlaceholderText('Başlık');
    const contentInput = getByPlaceholderText('Not içeriği (opsiyonel)...');
    
    expect(titleInput.props.value).toBe('Test Note');
    expect(contentInput.props.value).toBe('Test Content');
    expect(getByText('Orta öncelik')).toBeTruthy();
  });

  it('shows error when title is empty', async () => {
    const { getByPlaceholderText, getByText, findByText } = render(
      <MockRealmProvider>
        <EditNoteScreen navigation={mockNavigation} route={mockRoute} />
      </MockRealmProvider>
    );

    fireEvent.changeText(getByPlaceholderText('Başlık'), '');
    fireEvent.press(getByText('save-outline'));

    await waitFor(() => {
      expect(findByText('Lütfen bir başlık girin.')).toBeTruthy();
    });
  });

  it('shows error when title is too short', async () => {
    const { getByPlaceholderText, getByText, findByText } = render(
      <MockRealmProvider>
        <EditNoteScreen navigation={mockNavigation} route={mockRoute} />
      </MockRealmProvider>
    );

    fireEvent.changeText(getByPlaceholderText('Başlık'), 'ab');
    fireEvent.press(getByText('save-outline'));

    await waitFor(() => {
      expect(findByText('Başlık en az 3 karakter olmalıdır.')).toBeTruthy();
    });
  });

  it('shows error when content is less than 10 characters', async () => {
    const { getByPlaceholderText, getByText, findByText } = render(
      <MockRealmProvider>
        <EditNoteScreen navigation={mockNavigation} route={mockRoute} />
      </MockRealmProvider>
    );

    fireEvent.changeText(getByPlaceholderText('Not içeriği (opsiyonel)...'), '123456789');
    fireEvent.press(getByText('save-outline'));

    await waitFor(() => {
      expect(findByText('Not içeriği en az 10 karakter olmalıdır.')).toBeTruthy();
    });
  });

  it('successfully updates a note', async () => {
    const { getByPlaceholderText, getByText, findByText } = render(
      <MockRealmProvider>
        <EditNoteScreen navigation={mockNavigation} route={mockRoute} />
      </MockRealmProvider>
    );

    fireEvent.changeText(getByPlaceholderText('Başlık'), 'Updated Title');
    fireEvent.changeText(
      getByPlaceholderText('Not içeriği (opsiyonel)...'),
      'Updated content for testing'
    );
    fireEvent.press(getByText('save-outline'));

    await waitFor(() => {
      expect(mockRealm.write).toHaveBeenCalled();
      expect(findByText('Not başarıyla güncellendi.')).toBeTruthy();
    });

    // Check if navigation.goBack is called after successful save
    await waitFor(() => {
      expect(mockNavigation.goBack).toHaveBeenCalled();
    }, { timeout: 1500 });
  });

  it('changes importance level when clicked', () => {
    const { getByText } = render(
      <MockRealmProvider>
        <EditNoteScreen navigation={mockNavigation} route={mockRoute} />
      </MockRealmProvider>
    );

    fireEvent.press(getByText('5'));
    expect(getByText('En yüksek öncelik')).toBeTruthy();

    fireEvent.press(getByText('1'));
    expect(getByText('En düşük öncelik')).toBeTruthy();
  });
}); 