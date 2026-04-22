import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ClassListScreen from '../screens/ClassListScreen';
import StudentListScreen from '../screens/StudentListScreen';
import StudentProfileScreen from '../screens/StudentProfileScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack({ route }: any) {
  const { user, token } = route.params;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Classes" component={ClassListScreen} initialParams={{ user, token }} />
      <Stack.Screen name="Students" component={StudentListScreen} />
      <Stack.Screen name="StudentProfile" component={StudentProfileScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator({ route }: any) {
  const { user, token } = route.params;

  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: { backgroundColor: '#ffffff' } }}>
      <Tab.Screen name="Home" component={HomeStack} initialParams={{ user, token }} options={{ title: 'Home' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} initialParams={{ user, token }} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}
