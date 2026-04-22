import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { api } from '@/utils/api';
import { useRouter } from 'expo-router';

export default function TeacherStudentsScreen() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    api.get('/teacher/students')
      .then(r => setStudents(r.data))
      .catch(e => setError(e.response?.data?.message || 'Failed to load students'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <View style={s.centered}><ActivityIndicator size="large" color="#0066cc" /></View>;
  if (error) return <View style={s.centered}><Text style={s.errorText}>{error}</Text></View>;
  if (students.length === 0) return <View style={s.centered}><Text style={s.emptyText}>No assigned students.</Text></View>;

  return (
    <FlatList
      data={students}
      keyExtractor={item => item.id}
      contentContainerStyle={s.list}
      renderItem={({ item }) => (
        <TouchableOpacity style={s.card} onPress={() => (router as any).push({ pathname: '/(protected)/teacher/student/[studentId]', params: { studentId: item.id } })}>          <Text style={s.name}>{item.name}</Text>
          <Text style={s.sub}>Roll No: {item.rollNumber}</Text>
        </TouchableOpacity>
      )}
    />
  );
}

const s = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  list: { padding: 16 },
  card: { backgroundColor: '#fff', padding: 18, borderRadius: 12, marginBottom: 12, elevation: 2, borderWidth: 1, borderColor: '#eee' },
  name: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  sub: { fontSize: 14, color: '#666', marginTop: 4 },
  errorText: { color: '#dc3545', fontSize: 15 },
  emptyText: { color: '#888', fontSize: 15 },
});
