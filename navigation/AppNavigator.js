import * as React  from'react';
import {NavigationContainer} from'@react-navigation/native';
import {createNativeStackNavigator} from'@react-navigation/native-stack';
import LoginScreen from'../screens/login';
import RegisterScreen from'../screens/register';
import HomeScreen from'../screens/home';

const Stack=createNativeStackNavigator();

export default function AppNavigator(){
  return(
    <NavigationContainer>
      <Stack.Navigator initialRouteName="login">
        <Stack.Screen name="login" component={LoginScreen} options={{headerShown:false}}/>
        <Stack.Screen name="register" component={RegisterScreen} options={{headerShown:false}}/>
        <Stack.Screen name="home" component={HomeScreen} options={{headerShown:false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}   