import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import LoginScreen from './screen/loginScreen';
import RegistrationScreen from './screen/registrationScreen';
import {MainStackNavigator} from './component/Navigator';

const Stack = createNativeStackNavigator();

const App = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Registration" component={RegistrationScreen} />
        <Stack.Screen name="MainApp">
          {() => (
            <MainStackNavigator
              menuVisible={menuVisible}
              setMenuVisible={setMenuVisible}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default App;
