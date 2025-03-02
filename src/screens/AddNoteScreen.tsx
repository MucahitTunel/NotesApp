import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { RealmContext } from '../realm/config';
import { COLORS } from '../constants/colors';
import { HEADER_HEIGHT } from '../constants/layout';
import CustomHeader from '../components/CustomHeader';
import StatusDialog from '../components/StatusDialog';
import ImportanceSelector from '../components/ImportanceSelector';
import CategorySelector from '../components/CategorySelector';
import { Category } from '../realm/models/Category';

const { useRealm } = RealmContext;

const AddNoteScreen = ({ navigation }: any) => {
  const realm = useRealm();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [importance, setImportance] = useState(1);
  const [category, setCategory] = useState<Category | null>(null);
  const [statusDialog, setStatusDialog] = useState({
    visible: false,
    type: 'success' as 'success' | 'error',
    message: '',
  });

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
        realm.create('Note', {
          _id: new Date().getTime().toString(),
          title: title.trim(),
          content: content.trim(),
          importance,
          category,
          createdAt: new Date(),
        });
      });

      setStatusDialog({
        visible: true,
        type: 'success',
        message: 'Not başarıyla eklendi.',
      });

      setTimeout(() => {
        navigation.goBack();
      }, 1000);
    } catch (error) {
      setStatusDialog({
        visible: true,
        type: 'error',
        message: 'Not eklenirken bir hata oluştu.',
      });
    }
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        title="Not Ekle"
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

        <CategorySelector
          selectedCategory={category}
          onSelect={setCategory}
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

export default AddNoteScreen; 