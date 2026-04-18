import { View, Text, StyleSheet, Button } from 'react-native';
import { useAuth } from '@/context/auth';

export default function DashboardScreen() {
  const { user, signOut } = useAuth();
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.subtitle}>Welcome {user?.name} ({user?.role})</Text>
      
      <View style={styles.buttonContainer}>
         <Button title="Logout" onPress={signOut} color="#dc3545" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 40,
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
    maxWidth: 200,
  }
});
