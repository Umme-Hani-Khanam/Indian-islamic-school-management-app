import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { api } from '@/utils/api';
import { useLocalSearchParams, useRouter } from 'expo-router';

const SUBJECTS = [
  { id: '1', name: 'Mathematics' },
  { id: '2', name: 'Islamic Studies' },
  { id: '3', name: 'Physics' },
];

export default function AddMarkScreen() {
  const { studentId } = useLocalSearchParams();
  const router = useRouter();
  const [subjectId, setSubjectId] = useState('1');
  const [marks, setMarks] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // Ensure studentId is a string (handle array case)
    const id = Array.isArray(studentId) ? studentId[0] : studentId;
    const marksNum = parseInt(marks, 10);
    
    if (!id) {
      Alert.alert('Error', 'Student ID missing.');
      return;
    }

    if (isNaN(marksNum) || marksNum < 0 || marksNum > 100) {
      Alert.alert('Invalid', 'Marks must be between 0 and 100.');
      return;
    }

    setLoading(true);
    try {
      console.log('SAVING MARK:', { studentId: id, subjectId, marks: marksNum });
      await api.post('/teacher/marks', { studentId: id, subjectId, marks: marksNum });
      Alert.alert('Success', 'Mark saved!', [{ text: 'OK', onPress: () => router.back() }]);
    } catch (e: any) {
      console.error('SAVE MARK ERROR:', e.response?.data || e.message);
      Alert.alert('Error', e.response?.data?.message || 'Failed to save mark.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={s.container}>
      <Text style={s.title}>Add / Update Mark</Text>
      <Text style={s.label}>Subject</Text>
      <View style={s.subjectRow}>
        {SUBJECTS.map((sub) => (
          <TouchableOpacity
            key={sub.id}
            style={[s.chip, subjectId === sub.id && s.chipActive]}
            onPress={() => setSubjectId(sub.id)}
          >
            <Text style={[s.chipText, subjectId === sub.id && s.chipTextActive]}>
              {sub.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={s.label}>Marks (0–100)</Text>
      <TextInput
        style={s.input}
        value={marks}
        onChangeText={setMarks}
        keyboardType="numeric"
        placeholder="e.g. 87"
        maxLength={3}
      />
      <Text style={s.info}>
        Note: If a mark already exists for today's date, it will be updated.
      </Text>
      <TouchableOpacity style={s.btn} onPress={handleSubmit} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={s.btnText}>Save Mark</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '600', color: '#444', marginBottom: 8, marginTop: 16 },
  subjectRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, borderColor: '#0066cc', backgroundColor: '#fff' },
  chipActive: { backgroundColor: '#0066cc' },
  chipText: { color: '#0066cc', fontSize: 13, fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 12, fontSize: 18, backgroundColor: '#fff', marginTop: 4 },
  info: { fontSize: 12, color: '#888', fontStyle: 'italic', marginTop: 12 },
  btn: { backgroundColor: '#0066cc', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 24 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
