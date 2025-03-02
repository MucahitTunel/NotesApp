import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  TextInput,
} from 'react-native';
import ImportanceDots from '../components/ImportanceDots';
import CustomHeader from '../components/CustomHeader';
import QuestionDialog from '../components/QuestionDialog';
import StatusDialog from '../components/StatusDialog';
import moment from 'moment';
import 'moment/locale/tr';
import { RealmContext } from '../realm/config';
import { useUser } from '../context/UserContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { STATUSBAR_HEIGHT, HEADER_HEIGHT, FILTER_HEIGHT } from '../constants/layout';
import { Note } from '../models/Note';

moment.locale('tr');

const { useRealm, useQuery } = RealmContext;

type SortType = 'date-desc' | 'date-asc' | 'importance-desc' | 'importance-asc';

const HomeScreen = ({ navigation }: any) => {
  const realm = useRealm();
  const notes = useQuery<Note>('Note');
  const { username } = useUser();
  const scrollY = new Animated.Value(0);
  const [searchText, setSearchText] = useState('');
  const [sortType, setSortType] = useState<SortType>('date-desc');
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [statusDialog, setStatusDialog] = useState<{
    visible: boolean;
    type: 'success' | 'error';
    message: string;
  }>({
    visible: false,
    type: 'success',
    message: '',
  });

  const filterTranslateY = scrollY.interpolate({
    inputRange: [0, STATUSBAR_HEIGHT],
    outputRange: [0, -STATUSBAR_HEIGHT],
    extrapolate: 'clamp',
  });

  const handleAddNote = () => {
    navigation.navigate('AddNote');
  };

  const handleLongPress = () => {
    if (!isSelectionMode) {
      setIsSelectionMode(true);
    }
  };

  const handleNoteSelect = (noteId: string) => {
    setSelectedNotes((prev) =>
      prev.includes(noteId)
        ? prev.filter((id) => id !== noteId)
        : [...prev, noteId],
    );
  };

  const handleNotePress = (noteId: string) => {
    if (isSelectionMode) {
      setSelectedNotes(prev => {
        if (prev.includes(noteId)) {
          const newSelected = prev.filter(id => id !== noteId);
          if (newSelected.length === 0) {
            setIsSelectionMode(false);
          }
          return newSelected;
        }
        return [...prev, noteId];
      });
    } else {
      navigation.navigate('EditNote', { noteId });
    }
  };

  const handleDeleteSelected = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    try {
      realm.write(() => {
        selectedNotes.forEach(noteId => {
          const note = realm.objectForPrimaryKey<Note>('Note', noteId);
          if (note) {
            realm.delete(note);
          }
        });
      });

      const count = selectedNotes.length;
      setSelectedNotes([]);
      setIsSelectionMode(false);
      setShowDeleteDialog(false);
      setStatusDialog({
        visible: true,
        type: 'success',
        message: count > 1 
          ? `${count} not başarıyla silindi.`
          : 'Not başarıyla silindi.',
      });
    } catch (error) {
      setStatusDialog({
        visible: true,
        type: 'error',
        message: 'Notlar silinirken bir hata oluştu. Lütfen tekrar deneyin.',
      });
    }
  };

  const handleCancelSelection = () => {
    setSelectedNotes([]);
    setIsSelectionMode(false);
  };

  const filteredAndSortedNotes = useMemo(() => {
    let filtered = Array.from(notes).map(note => note as Note);

    if (searchText) {
      filtered = filtered.filter(
        note =>
          note.title.toLowerCase().includes(searchText.toLowerCase()) ||
          note.content.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    switch (sortType) {
      case 'date-desc':
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'date-asc':
        filtered.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        break;
      case 'importance-desc':
        filtered.sort((a, b) => b.importance - a.importance);
        break;
      case 'importance-asc':
        filtered.sort((a, b) => a.importance - b.importance);
        break;
    }

    return filtered;
  }, [notes, searchText, sortType]);

  const renderSortButton = (type: SortType, icon: string, text: string) => (
    <TouchableOpacity
      style={[
        styles.sortButton,
        sortType === type && styles.activeSortButton,
      ]}
      onPress={() => setSortType(type)}
    >
      <Icon
        name={icon}
        size={16}
        color={sortType === type ? '#FFFFFF' : '#666666'}
      />
      <Text style={[
        styles.sortButtonText,
        sortType === type && styles.activeSortButtonText,
      ]}>
        {text}
      </Text>
    </TouchableOpacity>
  );

  const renderNoteItem = ({ item }: { item: Note }) => {
    const isSelected = selectedNotes.includes(item._id);

    const handlePress = () => {
      if (isSelectionMode) {
        handleNoteSelect(item._id);
      } else {
        navigation.navigate('EditNote', { noteId: item._id });
      }
    };

    const handleItemLongPress = () => {
      if (!isSelectionMode) {
        setIsSelectionMode(true);
        handleNoteSelect(item._id);
      }
    };

    return (
      <TouchableOpacity
        style={[styles.noteItem, isSelected && styles.selectedNoteItem]}
        onPress={handlePress}
        onLongPress={handleItemLongPress}
        testID="note-item">
        <View style={styles.noteHeader}>
          <Text style={styles.noteTitle} numberOfLines={1}>
            {item.title}
          </Text>
          {item.category && (
            <View
              style={[
                styles.categoryTag,
                { backgroundColor: item.category.color + '20' },
              ]}>
              <View
                style={[
                  styles.categoryDot,
                  { backgroundColor: item.category.color },
                ]}
              />
              <Text
                style={[
                  styles.categoryText,
                  { color: item.category.color },
                ]}>
                {item.category.name}
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.noteContent} numberOfLines={2}>
          {item.content}
        </Text>
        <View style={styles.noteFooter}>
          <ImportanceDots level={item.importance as 1 | 2 | 3 | 4 | 5} />
          <Text style={styles.noteDate}>
            {moment(item.createdAt).format('DD.MM.YYYY HH:mm')}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        title={isSelectionMode ? `${selectedNotes.length} not seçildi` : `${username}'in Notları`}
        rightIcon={isSelectionMode ? 'trash-outline' : 'add-circle-outline'}
        onRightPress={isSelectionMode ? handleDeleteSelected : handleAddNote}
        showBackButton={isSelectionMode}
        onBackPress={handleCancelSelection}
        scrollY={scrollY}
      />
      <Animated.View 
        style={[
          styles.filtersContainer,
          {
            transform: [{ translateY: filterTranslateY }]
          }
        ]}>
        <View style={styles.searchContainer}>
          <Icon name="search-outline" size={20} color="#666666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Not ara..."
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText ? (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Icon name="close-circle" size={20} color="#666666" />
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={styles.sortButtons}>
          {renderSortButton('date-desc', 'time', 'En Yeni')}
          {renderSortButton('date-asc', 'time-outline', 'En Eski')}
          {renderSortButton('importance-desc', 'alert-circle', 'Önemli')}
          {renderSortButton('importance-asc', 'alert-circle-outline', 'Önemsiz')}
        </View>
      </Animated.View>
      <Animated.FlatList
        contentContainerStyle={[styles.listContainer, { paddingTop: HEADER_HEIGHT + FILTER_HEIGHT + 20 }]}
        data={filteredAndSortedNotes}
        renderItem={renderNoteItem}
        keyExtractor={item => item._id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      />
      <QuestionDialog
        visible={showDeleteDialog}
        title="Notları Sil"
        message={`${selectedNotes.length} notu silmek istediğinize emin misiniz?`}
        onCancel={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        cancelText="İptal"
        confirmText="Sil"
      />
      <StatusDialog
        visible={statusDialog.visible}
        type={statusDialog.type}
        message={statusDialog.message}
        onClose={() => setStatusDialog(prev => ({ ...prev, visible: false }))}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  filtersContainer: {
    position: 'absolute',
    top: HEADER_HEIGHT,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    zIndex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    height: FILTER_HEIGHT,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 36,
    fontSize: 14,
    color: '#333333',
  },
  sortButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  activeSortButton: {
    backgroundColor: '#2C3E50',
  },
  sortButtonText: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 4,
  },
  activeSortButtonText: {
    color: '#FFFFFF',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  noteItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedNoteItem: {
    backgroundColor: '#E8F0FE',
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    flex: 1,
    marginRight: 8,
  },
  noteContent: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  noteDate: {
    fontSize: 12,
    color: '#999999',
  },
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  noteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default HomeScreen; 