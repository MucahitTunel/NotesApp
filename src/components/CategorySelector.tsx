import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { RealmContext } from '../realm/config';
import { Category } from '../realm/models/Category';
import { COLORS } from '../constants/colors';

const { useRealm, useQuery } = RealmContext;

type CategorySelectorProps = {
  selectedCategory: Category | null;
  onSelect: (category: Category | null) => void;
};

const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  onSelect,
}) => {
  const realm = useRealm();
  const categories = useQuery<Category>('Category').sorted([
    ['isDefault', true],
    ['name', false]
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#FF5252');

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      Alert.alert('Hata', 'Kategori adı boş olamaz');
      return;
    }

    const existingCategory = categories.find(
      cat => cat.name.toLowerCase() === newCategoryName.trim().toLowerCase(),
    );

    if (existingCategory) {
      Alert.alert('Hata', 'Bu kategori zaten mevcut');
      return;
    }

    try {
      realm.write(() => {
        const newCategory = realm.create('Category', {
          _id: new Date().getTime().toString(),
          name: newCategoryName.trim(),
          color: newCategoryColor,
          isDefault: false,
          createdAt: new Date(),
        });
        onSelect(newCategory as unknown as Category);
      });
      setNewCategoryName('');
      setShowAddForm(false);
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Hata', 'Kategori eklenirken bir hata oluştu');
    }
  };

  const handleDeleteCategory = (category: Category) => {
    if (category.isDefault) {
      Alert.alert('Hata', 'Varsayılan kategoriler silinemez');
      return;
    }

    Alert.alert(
      'Kategori Sil',
      'Bu kategoriyi silmek istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => {
            try {
              if (selectedCategory?._id === category._id) {
                onSelect(null);
              }

              realm.write(() => {
                const notesWithCategory = realm
                  .objects('Note')
                  .filtered('category._id == $0', category._id);
                notesWithCategory.forEach(note => {
                  note.category = null;
                });

                realm.delete(category);
              });

              setModalVisible(false);
            } catch (error) {
              Alert.alert('Hata', 'Kategori silinirken bir hata oluştu');
            }
          },
        },
      ],
    );
  };

  const colors = [
    '#FF5252', '#FF4081', '#E040FB', '#7C4DFF',
    '#448AFF', '#40C4FF', '#18FFFF', '#64FFDA',
    '#69F0AE', '#B2FF59', '#EEFF41', '#FFD740',
  ];

  const renderCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory?._id === item._id && styles.selectedCategory,
      ]}
      onPress={() => {
        onSelect(item);
        setModalVisible(false);
      }}>
      <View style={styles.categoryHeader}>
        <View style={[styles.colorDot, { backgroundColor: item.color }]} />
        <Text style={styles.categoryName}>{item.name}</Text>
      </View>
      {!item.isDefault && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteCategory(item)}>
          <Icon name="trash-outline" size={20} color={COLORS.STATUS.ERROR} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Kategori</Text>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setModalVisible(true)}>
        {selectedCategory ? (
          <View style={styles.selectedView}>
            <View
              style={[
                styles.colorDot,
                { backgroundColor: selectedCategory.color },
              ]}
            />
            <Text style={styles.selectedText}>{selectedCategory.name}</Text>
          </View>
        ) : (
          <Text style={styles.placeholderText}>Kategori seçin</Text>
        )}
        <Icon name="chevron-down" size={20} color={COLORS.GRAY_DARK} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Kategori Seç</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}>
                <Icon name="close" size={24} color={COLORS.GRAY_DARK} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={categories}
              renderItem={renderCategory}
              keyExtractor={item => item._id}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              ListHeaderComponent={
                <TouchableOpacity
                  style={[
                    styles.categoryItem,
                    !selectedCategory && styles.selectedCategory,
                  ]}
                  onPress={() => {
                    onSelect(null);
                    setModalVisible(false);
                  }}>
                  <Text style={styles.categoryName}>Kategorisiz</Text>
                </TouchableOpacity>
              }
            />

            {showAddForm ? (
              <View style={styles.addForm}>
                <TextInput
                  style={styles.input}
                  placeholder="Yeni kategori adı"
                  value={newCategoryName}
                  onChangeText={setNewCategoryName}
                  autoFocus
                />
                <View style={styles.colorPicker}>
                  {colors.map(color => (
                    <TouchableOpacity
                      key={color}
                      style={[
                        styles.colorOption,
                        { backgroundColor: color },
                        newCategoryColor === color && styles.selectedColor,
                      ]}
                      onPress={() => setNewCategoryColor(color)}
                    />
                  ))}
                </View>
                <View style={styles.formButtons}>
                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={() => {
                      setShowAddForm(false);
                      setNewCategoryName('');
                    }}>
                    <Text style={styles.buttonText}>İptal</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.addButton]}
                    onPress={handleAddCategory}>
                    <Text style={[styles.buttonText, styles.addButtonText]}>
                      Ekle
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.addCategoryButton}
                onPress={() => setShowAddForm(true)}>
                <Icon name="add" size={24} color={COLORS.PRIMARY} />
                <Text style={styles.addCategoryText}>Yeni Kategori Ekle</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: COLORS.WHITE,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.GRAY_DARK,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: COLORS.GRAY_LIGHT,
    borderRadius: 8,
  },
  selectedView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  selectedText: {
    fontSize: 16,
    color: COLORS.BLACK,
  },
  placeholderText: {
    fontSize: 16,
    color: COLORS.GRAY_DARK,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GRAY_MEDIUM,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.BLACK,
  },
  closeButton: {
    padding: 4,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  selectedCategory: {
    backgroundColor: COLORS.GRAY_LIGHT,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 16,
    color: COLORS.BLACK,
  },
  deleteButton: {
    padding: 4,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.GRAY_MEDIUM,
  },
  addCategoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.GRAY_MEDIUM,
  },
  addCategoryText: {
    fontSize: 16,
    color: COLORS.PRIMARY,
    marginLeft: 8,
  },
  addForm: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.GRAY_MEDIUM,
  },
  input: {
    backgroundColor: COLORS.GRAY_LIGHT,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 12,
  },
  colorPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  colorOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  selectedColor: {
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: COLORS.GRAY_LIGHT,
  },
  addButton: {
    backgroundColor: COLORS.PRIMARY,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  addButtonText: {
    color: COLORS.WHITE,
  },
});

export default CategorySelector; 