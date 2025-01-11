import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

type ImportanceLevel = 1 | 2 | 3 | 4 | 5;

interface ImportanceDotsProps {
  level: ImportanceLevel;
}

const ImportanceDots: React.FC<ImportanceDotsProps> = ({ level }) => {
  const getColor = (dotLevel: ImportanceLevel) => {
    switch (dotLevel) {
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
      {[1, 2, 3, 4, 5].map((dotLevel) => (
        <View
          key={dotLevel}
          style={[
            styles.dot,
            {
              backgroundColor: dotLevel <= level ? getColor(dotLevel as ImportanceLevel) : COLORS.IMPORTANCE.INACTIVE,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default ImportanceDots; 