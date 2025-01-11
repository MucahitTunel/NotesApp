/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { UserProvider } from './src/context/UserContext';
import { RealmContext } from './src/realm/config';

const { RealmProvider } = RealmContext;

const App = () => {
  return (
    <RealmProvider>
      <SafeAreaProvider>
        <UserProvider>
          <AppNavigator />
        </UserProvider>
      </SafeAreaProvider>
    </RealmProvider>
  );
};

export default App;
