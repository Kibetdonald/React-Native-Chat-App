import React, { createContext, useState, useEffect, useContext } from "react";
import { View , ActivityIndicator} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {onAuthStateChanged} from 'firebase/auth';
import { auth } from './src/Config/Firebase';
import ChatScreen from "./src/Screens/ChatScreen";
import HomeScreen from "./src/Screens/HomeScreen";
import LoginScreen from "./src/Screens/LoginScreen";
import SignUpScreen from "./src/Screens/SignUpScreen";

const Stack = createStackNavigator();
const AuthenticationUserContext = createContext({});

const AuthenticatedUserProvider = ({children})=>{
  const [user, setUser]= useState(null);
  return (
    <AuthenticationUserContext.Provider value={{user, setUser}}>
      {children}
    </AuthenticationUserContext.Provider>
  )
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
}

function ChatStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const { user, setUser } = useContext(AuthenticationUserContext);
  const [isLoading, setIsLoading] = useState(true);
useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(
      auth,
      async authenticatedUser => {
        authenticatedUser ? setUser(authenticatedUser) : setUser(null);
        setIsLoading(false);
      }
    );
    return unsubscribeAuth;
  }, [user]);
if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large' />
      </View>
    );
  }
  return (
    <NavigationContainer>
      {user ? <ChatStack /> : <AuthStack />}
    </NavigationContainer>
  );
  }

  export default function App() {
    return (
      <AuthenticatedUserProvider>
        <RootNavigator />
      </AuthenticatedUserProvider>
    );
  }