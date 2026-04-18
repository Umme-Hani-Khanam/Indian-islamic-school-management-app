import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { api } from '@/utils/api';
import { useLocalSearchParams, useRouter } from 'expo-router';

interface StudentData {
  id: string;
  name: string;
  rollNumber: string;
}

export default function StudentListScreen() {
  const { classId } = useLocalSearchParams();
  const [students, setStudents] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await api.get(`/school/classes/${classId}/students`);
        setStudents(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load students.');
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [classId]);

  if (loading) return <View style={styles.centered}><ActivityIndicator size="large" color="#0066cc" /></View>;
  if (error) return <View style={styles.centered}><Text style={styles.errorText}>{error}</Text></View>;
  if (students.length === 0) return <View style={styles.centered}><Text style={styles.emptyText}>No students in this class.</Text></View>;

  return (
    <FlatList
      data={students}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <TouchableOpacity 
          style={styles.card}
          onPress={() => router.push(`/(protected)/(tabs)/classes/${classId}/student/${item.id}`)}
        >
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardSubtitle}>Roll No: {item.rollNumber}</Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  list: { padding: 16 },
  card: { backgroundColor: '#ffffff', padding: 20, borderRadius: 12, marginBottom: 12, elevation: 2, borderWidth: 1, borderColor: '#eee' },
  cardTitle: { fontSize: 18, fontWeight: 'bold' },
  cardSubtitle: { fontSize: 14, color: '#555', marginTop: 4 },
  errorText: { color: '#dc3545', fontSize: 16 },
  emptyText: { color: '#888', fontSize: 16 }
});
