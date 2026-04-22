import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen({ route, navigation }: any) {
  const { user } = route.params;

  const handleLogout = () => {
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{user.name}</Text>
        <Text style={styles.subtitle}>{user.role.charAt(0) + user.role.slice(1).toLowerCase()}</Text>
        <Text style={styles.detail}>ID: {user.id}</Text>
        {user.studentId ? <Text style={styles.detail}>Student ID: {user.studentId}</Text> : null}
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
      <View style={styles.helpCard}>
        <Text style={styles.helpTitle}>Mobile-first school app</Text>
        <Text style={styles.helpText}>Use class cards and student cards to move through the learning hierarchy. Pull down to refresh data.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eef2ff', padding: 20 },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 24, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 14, elevation: 4 },
  title: { fontSize: 28, fontWeight: '800', color: '#111827' },
  subtitle: { color: '#2563eb', marginTop: 8, fontSize: 16 },
  detail: { marginTop: 10, color: '#475569' },
  helpCard: { backgroundColor: '#fff', borderRadius: 20, padding: 18, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 14, elevation: 2 },
  helpTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 8 },
  helpText: { color: '#475569', lineHeight: 22 },
}}