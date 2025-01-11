import { Platform, StatusBar } from 'react-native';

export const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;
export const HEADER_HEIGHT = Platform.OS === 'ios' ? 109 : (StatusBar.currentHeight || 0) + 65;
export const FILTER_HEIGHT = 110; 