import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../constants/colors';

const { width } = Dimensions.get('window');

type ImportanceSelectorProps = {
  importance: number;
  onSelect: (level: number) => void;
};

const ImportanceSelector: React.FC<ImportanceSelectorProps> = ({
  importance,
  onSelect,
}) => {
  const getImportanceText = (level: number) => {
    switch (level) {
      case 1:
        return 'En düşük öncelik';
      case 2:
        return 'Düşük öncelik';
      case 3:
        return 'Orta öncelik';
      case 4:
        return 'Yüksek öncelik';
      case 5:
        return 'En yüksek öncelik';
      default:
        return '';
    }
  };

  const getImportanceColor = (level: number) => {
    switch (level) {
      case 1:
        return COLORS.IMPORTANCE.LEVEL_1;
      case 2:
        return COLORS.IMPORTANCE.LEVEL_2;
      case 3:
        return COLORS.IMPORTANCE.LEVEL_3;
      case 4:
        return COLORS.IMPORTANCE.LEVEL_4;
      case 5:
        return COLORS.IMPORTANCE.LEVEL_5;
      default:
        return COLORS.IMPORTANCE.INACTIVE;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Önem Derecesi</Text>
      <View style={styles.buttons}>
        {[1, 2, 3, 4, 5].map((level) => (
          <TouchableOpacity
            key={level}
            onPress={() => onSelect(level)}
            style={[
              styles.button,
              level === importance && { backgroundColor: getImportanceColor(level) }
            ]}>
            <Text style={[
              styles.buttonText,
              level === importance && styles.selectedButtonText
            ]}>
              {level}
            </Text>
            {level === importance && (
              <View style={styles.selectedIndicator}>
                <Icon name="checkmark" size={12} color={COLORS.WHITE} />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.description}>
        {getImportanceText(importance)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: COLORS.WHITE,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.GRAY_DARK,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  button: {
    width: (width - 40 - 32) / 5,
    height: (width - 40 - 32) / 5,
    borderRadius: 12,
    backgroundColor: COLORS.GRAY_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.GRAY_DARK,
  },
  selectedButtonText: {
    color: COLORS.WHITE,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    fontSize: 13,
    color: COLORS.GRAY_DARK,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default ImportanceSelector; 