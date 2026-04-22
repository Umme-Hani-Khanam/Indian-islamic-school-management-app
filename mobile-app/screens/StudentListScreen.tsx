import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fetchClassStudents } from '../services/api';

export default function StudentListScreen({ route, navigation }: any) {
  const { classId, className, token } = route.params;
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string>('');

  const loadStudents = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchClassStudents(classId, token);
      setStudents(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Unable to load students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStudents();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{className}</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 24 }} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={students}
          keyExtractor={(item) => item.studentId}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={{ paddingBottom: 32 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('StudentProfile', { studentId: item.studentId, token })}
            >
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardMeta}>{item.class?.name} Section {item.class?.section}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={styles.empty}>No students found for this class.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 20 },
  header: { fontSize: 24, fontWeight: '800', color: '#111827', marginTop: 12, marginBottom: 12 },
  card: { backgroundColor: '#fff', borderRadius: 18, padding: 18, marginBottom: 14, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 14, elevation: 2 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  cardMeta: { color: '#475569', marginTop: 6 },
  error: { color: '#b91c1c', marginTop: 24, textAlign: 'center' },
  empty: { color: '#475569', marginTop: 24, textAlign: 'center' },
});
