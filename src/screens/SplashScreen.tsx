import React, { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useCheckUser } from '../hooks/useCheckUser';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type SplashScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

const SplashScreen = ({ navigation }: SplashScreenProps) => {
  const { checkUser } = useCheckUser();

  useEffect(() => {
    handleInitialNavigation();
  }, []);

  const handleInitialNavigation = () => {
    const userExists = checkUser();
    
    // Wait for 2 seconds before navigating
    setTimeout(() => {
      navigation.replace(userExists ? 'Home' : 'Login');
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ 
          uri: 'https://cdn-icons-png.flaticon.com/512/3176/3176396.png'
        }}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  image: {
    width: 200,
    height: 200,
  },
});

export default SplashScreen; 