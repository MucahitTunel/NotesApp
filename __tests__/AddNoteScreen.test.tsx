import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AddNoteScreen from '../src/screens/AddNoteScreen';
import { RealmContext } from '../src/realm/config';

// Mock navigation
const mockNavigation = {
  goBack: jest.fn(),
};

// Mock realm context
const mockRealm = {
  write: jest.fn((callback) => callback()),
  create: jest.fn(),
};

// Mock useRealm hook
jest.mock('@realm/react', () => ({
  ...jest.requireActual('@realm/react'),
  useRealm: () => mockRealm,
}));

const MockRealmProvider = ({ children }: { children: React.ReactNode }) => {
  const { RealmProvider } = RealmContext;
  return (
    <RealmProvider>
      {children}
    </RealmProvider>
  );
};

describe('AddNoteScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByPlaceholderText, getByText } = render(
      <MockRealmProvider>
        <AddNoteScreen navigation={mockNavigation} />
      </MockRealmProvider>
    );

    expect(getByPlaceholderText('Başlık')).toBeTruthy();
    expect(getByPlaceholderText('Not içeriği (opsiyonel)...')).toBeTruthy();
    expect(getByText('Önem Derecesi')).toBeTruthy();
  });

  it('shows error when title is empty', async () => {
    const { getByText, findByText } = render(
      <MockRealmProvider>
        <AddNoteScreen navigation={mockNavigation} />
      </MockRealmProvider>
    );

    fireEvent.press(getByText('save-outline'));

    await waitFor(() => {
      expect(findByText('Lütfen bir başlık girin.')).toBeTruthy();
    });
  });

  it('shows error when title is too short', async () => {
    const { getByPlaceholderText, getByText, findByText } = render(
      <MockRealmProvider>
        <AddNoteScreen navigation={mockNavigation} />
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
        <AddNoteScreen navigation={mockNavigation} />
      </MockRealmProvider>
    );

    fireEvent.changeText(getByPlaceholderText('Başlık'), 'Test Başlık');
    fireEvent.changeText(getByPlaceholderText('Not içeriği (opsiyonel)...'), '123456789');
    fireEvent.press(getByText('save-outline'));

    await waitFor(() => {
      expect(findByText('Not içeriği en az 10 karakter olmalıdır.')).toBeTruthy();
    });
  });

  it('successfully creates a note', async () => {
    const { getByPlaceholderText, getByText, findByText } = render(
      <MockRealmProvider>
        <AddNoteScreen navigation={mockNavigation} />
      </MockRealmProvider>
    );

    fireEvent.changeText(getByPlaceholderText('Başlık'), 'Test Başlık');
    fireEvent.changeText(
      getByPlaceholderText('Not içeriği (opsiyonel)...'),
      'Bu bir test notudur.'
    );
    fireEvent.press(getByText('save-outline'));

    await waitFor(() => {
      expect(mockRealm.write).toHaveBeenCalled();
      expect(mockRealm.create).toHaveBeenCalled();
      expect(findByText('Not başarıyla kaydedildi.')).toBeTruthy();
    });

    // Check if navigation.goBack is called after successful save
    await waitFor(() => {
      expect(mockNavigation.goBack).toHaveBeenCalled();
    }, { timeout: 1500 });
  });

  it('allows creating note without content', async () => {
    const { getByPlaceholderText, getByText, findByText } = render(
      <MockRealmProvider>
        <AddNoteScreen navigation={mockNavigation} />
      </MockRealmProvider>
    );

    fireEvent.changeText(getByPlaceholderText('Başlık'), 'Sadece Başlık');
    fireEvent.press(getByText('save-outline'));

    await waitFor(() => {
      expect(mockRealm.write).toHaveBeenCalled();
      expect(mockRealm.create).toHaveBeenCalled();
      expect(findByText('Not başarıyla kaydedildi.')).toBeTruthy();
    });
  });

  it('changes importance level when clicked', () => {
    const { getByText } = render(
      <MockRealmProvider>
        <AddNoteScreen navigation={mockNavigation} />
      </MockRealmProvider>
    );

    fireEvent.press(getByText('5'));
    expect(getByText('En yüksek öncelik')).toBeTruthy();

    fireEvent.press(getByText('1'));
    expect(getByText('En düşük öncelik')).toBeTruthy();
  });
}); 