import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { fetchAllStudents, fetchStudentProfile } from '../services/api';

const roleLabels: Record<string, string> = {
  HEADMASTER: 'Headmaster dashboard',
  TEACHER: 'Teacher dashboard',
  PARENT: 'Parent dashboard',
};

export default function DashboardScreen({ route, navigation }: any) {
  const { user, token } = route.params;
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        if (user.role === 'PARENT') {
          const profile = await fetchStudentProfile(user.studentId, token);
          setStudents([profile]);
        } else {
          const data = await fetchAllStudents(token);
          setStudents(data);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token, user.role, user.studentId]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{roleLabels[user.role] || 'Dashboard'}</Text>
      <Text style={styles.subheader}>Welcome back, {user.name}</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 24 }} />
      ) : (
        <FlatList
          data={students}
          keyExtractor={(item) => item.studentId || item.id}
          contentContainerStyle={{ paddingBottom: 32 }}
          renderItem={({ item }) => (
            <Pressable style={styles.card} onPress={() => navigation.navigate('StudentProfile', { student: item, token })}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardText}>{item.grade} • Section {item.section}</Text>
              <Text style={styles.cardText}>Attendance: {item.attendance}%</Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eef2ff', padding: 20 },
  header: { fontSize: 28, fontWeight: '800', color: '#111827', marginTop: 12 },
  subheader: { color: '#374151', marginTop: 8, marginBottom: 20 },
  card: { backgroundColor: '#fff', borderRadius: 18, padding: 18, marginBottom: 14, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 18, elevation: 4 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 6 },
  cardText: { color: '#4b5563', fontSize: 14, marginBottom: 2 },
});
