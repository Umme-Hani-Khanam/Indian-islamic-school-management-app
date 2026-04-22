import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert as RNAlert } from 'react-native';
import { api } from '@/utils/api';
import { Stack, useRouter } from 'expo-router';
import { useAuth } from '@/context/auth';

export default function CreateAlertScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  
  // Form State
  const [studentId, setStudentId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'CRITICAL' | 'HIGH' | 'MEDIUM'>('MEDIUM');

  const router = useRouter();

  useEffect(() => {
    // For Parents: only their children. For Teachers: students and classes are needed.
    // Simplified: Fetch students relevant to user
    const endpoint = user?.role === 'PARENT' ? '/parent/child' : '/teacher/students'; // Note: existing endpoints
    api.get(endpoint).then(r => {
      setStudents(Array.isArray(r.data) ? r.data : [r.data]);
      if (r.data && !Array.isArray(r.data)) setStudentId(r.data.id);
      else if (r.data.length > 0) setStudentId(r.data[0].id);
    }).catch(e => console.error('Failed to load students', e));
  }, []);

  const handleSubmit = async () => {
    if (!studentId || !title || !description) {
      RNAlert.alert('Error', 'Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      await api.post('/alerts', {
        studentId,
        title,
        description,
        priority,
        status: 'OPEN'
      });
      RNAlert.alert('Success', 'Alert raised successfully');
      router.back();
    } catch (e: any) {
      RNAlert.alert('Error', e.response?.data?.message || 'Failed to raise alert');
    } finally {
      setLoading(false);
    }
  };

  const parentCategories = ['Medical Support', 'Academic Concern', 'Counseling Request'];

  return (
    <ScrollView contentContainerStyle={s.container}>
      <Stack.Screen options={{ title: 'Raise Alert' }} />
      
      <Text style={s.label}>1. Select Student</Text>
      <View style={s.studentSelector}>
        {students.map(s => (
          <TouchableOpacity 
            key={s.id} 
            style={[s.studentChip, studentId === s.id && s.studentChipActive]} 
            onPress={() => setStudentId(s.id)}
          >
            <Text style={[s.studentChipText, studentId === s.id && s.textWhite]}>{s.name} (Roll: {s.rollNumber})</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={s.label}>2. Select Category / Title</Text>
      {user?.role === 'PARENT' ? (
        <View style={s.catGrid}>
          {parentCategories.map(cat => (
            <TouchableOpacity 
              key={cat} 
              style={[s.catChip, title === cat && s.catChipActive]} 
              onPress={() => setTitle(cat)}
            >
              <Text style={[s.catText, title === cat && s.textWhite]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <TextInput 
          style={s.input} 
          placeholder="e.g. Behavioral Issue, Medical Emergency" 
          value={title} 
          onChangeText={setTitle}
        />
      )}

      <Text style={s.label}>3. Priority Level</Text>
      <View style={s.priorityRow}>
        <PriorityBtn label="Medium" active={priority === 'MEDIUM'} onPress={() => setPriority('MEDIUM')} color="#2e7d32" />
        <PriorityBtn label="High" active={priority === 'HIGH'} onPress={() => setPriority('HIGH')} color="#ef6c00" />
        <PriorityBtn label="Critical" active={priority === 'CRITICAL'} onPress={() => setPriority('CRITICAL')} color="#c62828" />
      </View>

      <Text style={s.label}>4. Description & Details</Text>
      <TextInput 
        style={[s.input, s.textArea]} 
        placeholder="Provide as much detail as possible..." 
        value={description} 
        onChangeText={setDescription}
        multiline
        numberOfLines={6}
      />

      <TouchableOpacity style={s.submitBtn} onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.submitText}>Submit Alert Request</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

function PriorityBtn({ label, active, onPress, color }: { label: string; active: boolean; onPress: () => void; color: string }) {
  return (
    <TouchableOpacity 
      style={[s.pBtn, active && { backgroundColor: color, borderColor: color }]} 
      onPress={onPress}
    >
      <Text style={[s.pBtnText, active && s.textWhite, !active && { color }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fdfdfd' },
  label: { fontSize: 13, fontWeight: '800', color: '#1b5e20', textTransform: 'uppercase', marginBottom: 12, marginTop: 8 },
  studentSelector: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  studentChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, backgroundColor: '#f5f5f5', borderWidth: 1, borderColor: '#eee' },
  studentChipActive: { backgroundColor: '#1b5e20', borderColor: '#1b5e20' },
  studentChipText: { fontSize: 13, fontWeight: '600', color: '#666' },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  catChip: { flex: 1, minWidth: '45%', padding: 16, borderRadius: 16, borderWith: 1.5, borderColor: '#e0e0e0', alignItems: 'center', backgroundColor: '#fff' },
  catChipActive: { backgroundColor: '#0066cc', borderColor: '#0066cc' },
  catText: { fontSize: 13, fontWeight: '700', color: '#555' },
  input: { backgroundColor: '#fff', borderRadius: 16, padding: 16, fontSize: 15, borderWidth: 1.5, borderColor: '#f0f0f0', marginBottom: 20 },
  textArea: { height: 120, textAlignVertical: 'top' },
  priorityRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  pBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1.5, alignItems: 'center', borderColor: '#eee' },
  pBtnText: { fontSize: 13, fontWeight: '800' },
  submitBtn: { backgroundColor: '#1b5e20', padding: 20, borderRadius: 20, alignItems: 'center', elevation: 4, marginTop: 10 },
  submitText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  textWhite: { color: '#fff' },
});
