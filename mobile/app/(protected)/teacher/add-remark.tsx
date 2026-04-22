import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { api } from '@/utils/api';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function AddRemarkScreen() {
  const { studentId } = useLocalSearchParams();
  const router = useRouter();
  const [type, setType] = useState<'POSITIVE' | 'NEGATIVE'>('POSITIVE');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // Ensure studentId is a string
    const id = Array.isArray(studentId) ? studentId[0] : studentId;
    
    if (!id) {
      Alert.alert('Error', 'Student ID missing.');
      return;
    }
    if (!comment.trim()) {
      Alert.alert('Required', 'Please enter a comment.');
      return;
    }
    setLoading(true);
    try {
      console.log('SAVING REMARK:', { studentId: id, comment: comment.trim(), type });
      await api.post('/teacher/remarks', { studentId: id, comment: comment.trim(), type });
      Alert.alert('Success', 'Remark added!', [{ text: 'OK', onPress: () => router.back() }]);
    } catch (e: any) {
      console.error('SAVE REMARK ERROR:', e.response?.data || e.message);
      Alert.alert('Error', e.response?.data?.message || 'Failed to save remark.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={s.container}>
      <Text style={s.title}>Add Remark</Text>

      <Text style={s.label}>Remark Type</Text>
      <View style={s.typeRow}>
        {(['POSITIVE', 'NEGATIVE'] as const).map((t) => (
          <TouchableOpacity
            key={t}
            style={[
              s.chip,
              type === t && (t === 'POSITIVE' ? s.chipPos : s.chipNeg),
            ]}
            onPress={() => setType(t)}
          >
            <Text style={[s.chipText, type === t && s.chipTextActive]}>
              {t === 'POSITIVE' ? '👍 Positive' : '⚠️ Negative'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={s.label}>Comment</Text>
      <TextInput
        style={s.input}
        value={comment}
        onChangeText={setComment}
        placeholder="Write your remark here..."
        multiline
        numberOfLines={4}
      />

      <TouchableOpacity
        style={[s.btn, type === 'NEGATIVE' && s.btnNeg]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={s.btnText}>Save Remark</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '600', color: '#444', marginBottom: 8, marginTop: 16 },
  typeRow: { flexDirection: 'row', gap: 12 },
  chip: { flex: 1, paddingVertical: 12, borderRadius: 10, borderWidth: 1.5, borderColor: '#ccc', backgroundColor: '#fff', alignItems: 'center' },
  chipPos: { backgroundColor: '#2e7d32', borderColor: '#2e7d32' },
  chipNeg: { backgroundColor: '#c62828', borderColor: '#c62828' },
  chipText: { fontSize: 14, fontWeight: '600', color: '#555' },
  chipTextActive: { color: '#fff' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, backgroundColor: '#fff', minHeight: 100, textAlignVertical: 'top', marginTop: 4 },
  btn: { backgroundColor: '#2e7d32', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 24 },
  btnNeg: { backgroundColor: '#c62828' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
