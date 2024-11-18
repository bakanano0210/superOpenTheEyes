import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import LoginScreen from './screen/loginScreen';
import RegistrationScreen from './screen/registrationScreen';
import {MainStackNavigator} from './component/navigator';
import {MainProvider} from './component/mainContext';
import ForgotPasswordScreen from './screen/forgotPasswordScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <MainProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Registration" component={RegistrationScreen} />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
            options={{
              title: '비밀번호 찾기',
              headerShown: 'true',
              headerTitleAlign: 'center',
              headerStyle: {backgroundColor: '#fdf7ff'},
              headerTintColor: '#000',
              headerTitleStyle: {fontWeight: 'bold'},
            }}
          />
          <Stack.Screen name="MainApp" component={MainStackNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </MainProvider>
  );
};
export default App;
