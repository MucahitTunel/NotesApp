import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { STATUSBAR_HEIGHT } from '../constants/layout';

type CustomHeaderProps = {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightIcon?: string;
  onRightPress?: () => void;
  scrollY?: Animated.Value;
};

const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  showBackButton = false,
  onBackPress,
  rightIcon,
  onRightPress,
  scrollY = new Animated.Value(0),
}) => {

  const translateY = scrollY.interpolate({
    inputRange: [0, STATUSBAR_HEIGHT],
    outputRange: [0, -STATUSBAR_HEIGHT],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
      <View style={styles.gradient}>
        <StatusBar barStyle="light-content" backgroundColor="#2C3E50" />
        <View style={styles.content}>
          <View style={styles.leftContainer}>
            {showBackButton && (
              <TouchableOpacity
                style={styles.backButton}
                onPress={onBackPress}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Icon name="chevron-back" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            )}
            <View>
              <Text style={styles.title} numberOfLines={1}>
                {title}
              </Text>
              <View style={styles.titleUnderline} />
            </View>
          </View>

          {rightIcon && (
            <TouchableOpacity
              style={styles.rightButton}
              onPress={onRightPress}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Icon name={rightIcon} size={28} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2C3E50',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  gradient: {
    backgroundColor: '#2C3E50',
    paddingTop: STATUSBAR_HEIGHT,
  },
  content: {
    height: 65,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  leftContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  rightButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  titleUnderline: {
    height: 3,
    width: '40%',
    backgroundColor: '#3498DB',
    borderRadius: 2,
  },
});

export default CustomHeader; 