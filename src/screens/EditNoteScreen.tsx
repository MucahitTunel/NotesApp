import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { RealmContext } from '../realm/config';
import { Note } from '../models/Note';
import { COLORS } from '../constants/colors';
import { HEADER_HEIGHT } from '../constants/layout';
import CustomHeader from '../components/CustomHeader';
import StatusDialog from '../components/StatusDialog';
import ImportanceSelector from '../components/ImportanceSelector';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const { useRealm } = RealmContext;

type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Home: undefined;
  AddNote: undefined;
  EditNote: { noteId: string };
};

type EditNoteScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'EditNote'>;
  route: {
    params: {
      noteId: string;
    };
  };
};

const EditNoteScreen: React.FC<EditNoteScreenProps> = ({ navigation, route }) => {
  const realm = useRealm();
  const { noteId } = route.params;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [importance, setImportance] = useState(1);
  const [statusDialog, setStatusDialog] = useState({
    visible: false,
    type: 'success' as 'success' | 'error',
    message: '',
  });

  useEffect(() => {
    const note = realm.objectForPrimaryKey<Note>('Note', noteId);
    if (note) {
      setTitle(note.title);
      setContent(note.content || '');
      setImportance(note.importance);
    }
  }, [noteId]);

  const validateInputs = () => {
    if (!title.trim()) {
      setStatusDialog({
        visible: true,
        type: 'error',
        message: 'Lütfen bir başlık girin.',
      });
      return false;
    }

    if (title.length < 3) {
      setStatusDialog({
        visible: true,
        type: 'error',
        message: 'Başlık en az 3 karakter olmalıdır.',
      });
      return false;
    }

    if (content.trim() && content.length < 10) {
      setStatusDialog({
        visible: true,
        type: 'error',
        message: 'Not içeriği en az 10 karakter olmalıdır.',
      });
      return false;
    }

    return true;
  };

  const handleSave = () => {
    if (!validateInputs()) return;

    try {
      realm.write(() => {
        const note = realm.objectForPrimaryKey<Note>('Note', noteId);
        if (note) {
          note.title = title.trim();
          note.content = content.trim();
          note.importance = importance;
        }
      });

      setStatusDialog({
        visible: true,
        type: 'success',
        message: 'Not başarıyla güncellendi.',
      });

      setTimeout(() => {
        navigation.goBack();
      }, 1000);
    } catch (error) {
      setStatusDialog({
        visible: true,
        type: 'error',
        message: 'Not güncellenirken bir hata oluştu.',
      });
    }
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        title="Not Düzenle"
        showBackButton
        rightIcon="save-outline"
        onRightPress={handleSave}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.titleInput}
            placeholder="Başlık"
            value={title}
            onChangeText={setTitle}
            maxLength={50}
          />
        </View>

        <ImportanceSelector 
          importance={importance}
          onSelect={setImportance}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.contentInput}
            placeholder="Not içeriği (opsiyonel)..."
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      <StatusDialog
        visible={statusDialog.visible}
        type={statusDialog.type}
        message={statusDialog.message}
        onClose={() => setStatusDialog({ ...statusDialog, visible: false })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  content: {
    flex: 1,
    marginTop: HEADER_HEIGHT,
  },
  inputContainer: {
    padding: 16,
    backgroundColor: COLORS.WHITE,
  },
  titleInput: {
    fontSize: 18,
    color: COLORS.BLACK,
    padding: 12,
    borderRadius: 8,
    backgroundColor: COLORS.GRAY_LIGHT,
  },
  contentInput: {
    height: 200,
    fontSize: 16,
    color: COLORS.BLACK,
    padding: 12,
    borderRadius: 8,
    backgroundColor: COLORS.GRAY_LIGHT,
  },
});

export default EditNoteScreen; 