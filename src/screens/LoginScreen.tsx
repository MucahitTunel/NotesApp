import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useUser } from '../context/UserContext';
import { saveUser } from '../storage/mmkv';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const { setUsername: setContextUsername } = useUser();

  const handleContinue = () => {
    // Validate username
    if (!username.trim()) {
      Alert.alert('Hata', 'Lütfen kullanıcı adı giriniz');
      return;
    }

    if (username.length < 3) {
      Alert.alert('Hata', 'Kullanıcı adı en az 3 karakter olmalıdır');
      return;
    }

    if (username.length > 20) {
      Alert.alert('Hata', 'Kullanıcı adı en fazla 20 karakter olmalıdır');
      return;
    }

    // Save user data
    const userData = { username: username.trim() };
    saveUser(userData);
    setContextUsername(username.trim());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hoş Geldiniz</Text>
      <TextInput
        style={styles.input}
        placeholder="Kullanıcı adınızı giriniz"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Devam Et</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#000',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#f8f8f8',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LoginScreen; 