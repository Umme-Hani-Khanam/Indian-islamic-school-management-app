import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, TextInput, Alert as RNAlert } from 'react-native';
import { api } from '@/utils/api';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@/context/auth';

export default function AlertDetailScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const [alertData, setAlertData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [note, setNote] = useState('');
  
  const router = useRouter();

  const fetchData = useCallback(async () => {
    try {
      const r = await api.get(`/alerts/${id}`);
      setAlertData(r.data);
    } catch (e: any) {
      RNAlert.alert('Error', e.response?.data?.message || 'Failed to load alert details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdateStatus = async (newStatus: string) => {
    if (!note) {
      RNAlert.alert('Note Required', 'Please provide a brief note for this update.');
      return;
    }

    setUpdating(true);
    try {
      await api.patch(`/alerts/${id}`, {
        status: newStatus,
        description: note // Service wraps this into history
      });
      setNote('');
      fetchData();
      RNAlert.alert('Success', `Status updated to ${newStatus}`);
    } catch (e: any) {
      RNAlert.alert('Error', e.response?.data?.message || 'Update failed');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <View style={s.centered}><ActivityIndicator size="large" color="#1b5e20" /></View>;
  if (!alertData) return <View style={s.centered}><Text>Alert not found.</Text></View>;

  const priorityColor = alertData.priority === 'CRITICAL' ? '#c62828' : alertData.priority === 'HIGH' ? '#ef6c00' : '#2e7d32';
  const isStaff = user?.role === 'HEADMASTER' || user?.role === 'TEACHER';

  return (
    <ScrollView contentContainerStyle={s.container}>
      <Stack.Screen options={{ title: 'Alert Case File' }} />
      
      {/* Detail Header */}
      <View style={s.headerCard}>
        <View style={s.headerTop}>
          <View style={[s.pBadge, { backgroundColor: priorityColor }]}>
            <Text style={s.pText}>{alertData.priority}</Text>
          </View>
          <Text style={s.statusText}>{alertData.status}</Text>
        </View>
        <Text style={s.title}>{alertData.title}</Text>
        <Text style={s.createdAt}>Raised on {new Date(alertData.createdAt).toLocaleString()}</Text>
        <View style={s.divider} />
        <Text style={s.description}>{alertData.description}</Text>
      </View>

      {/* Timeline Section */}
      <Text style={s.sectionLabel}>Resolution Timeline</Text>
      <View style={s.timeline}>
        {alertData.history.map((h: any, i: number) => (
          <View key={i} style={s.timelineItem}>
            <View style={s.timelinePre}>
              <View style={s.timelineDot} />
              {i < alertData.history.length - 1 && <View style={s.timelineLine} />}
            </View>
            <View style={s.timelineContent}>
               <Text style={s.historyDate}>{h.date}</Text>
               <Text style={s.historyStatus}>{h.status}</Text>
               <Text style={s.historyNote}>{h.note}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Staff Controls */}
      {isStaff && alertData.status !== 'RESOLVED' && (
        <View style={s.controls}>
          <Text style={s.sectionLabel}>Case Management</Text>
          <TextInput 
            style={s.noteInput} 
            placeholder="Add a progress note..." 
            value={note}
            onChangeText={setNote}
            multiline
          />
          <View style={s.actionRow}>
            {alertData.status === 'OPEN' && (
              <TouchableOpacity style={[s.actionBtn, s.bgBlue]} onPress={() => handleUpdateStatus('IN_PROGRESS')} disabled={updating}>
                <Text style={s.actionBtnText}>Mark In-Progress</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={[s.actionBtn, s.bgGreen]} onPress={() => handleUpdateStatus('RESOLVED')} disabled={updating}>
              <Text style={s.actionBtnText}>Resolve Case</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fdfdfd' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerCard: { backgroundColor: '#fff', padding: 24, borderRadius: 24, elevation: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, borderWidth: 1, borderColor: '#f0f0f0' },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  pBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
  pText: { color: '#fff', fontSize: 11, fontWeight: '900', textTransform: 'uppercase' },
  statusText: { fontSize: 13, fontWeight: '700', color: '#666', textTransform: 'uppercase' },
  title: { fontSize: 22, fontWeight: '800', color: '#1a1a1a', marginBottom: 6 },
  createdAt: { fontSize: 12, color: '#aaa', fontWeight: '500' },
  divider: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 16 },
  description: { fontSize: 15, color: '#444', lineHeight: 22 },
  sectionLabel: { fontSize: 14, fontWeight: '800', color: '#1b5e20', textTransform: 'uppercase', marginBottom: 16, marginTop: 24, paddingLeft: 4 },
  timeline: { paddingLeft: 8 },
  timelineItem: { flexDirection: 'row', minHeight: 60 },
  timelinePre: { width: 20, alignItems: 'center' },
  timelineDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#1b5e20', zIndex: 1 },
  timelineLine: { width: 2, flex: 1, backgroundColor: '#e0e0e0', marginVertical: -2 },
  timelineContent: { flex: 1, paddingLeft: 16, paddingBottom: 20 },
  historyDate: { fontSize: 11, color: '#aaa', fontWeight: '600' },
  historyStatus: { fontSize: 12, fontWeight: '800', color: '#1b5e20', marginVertical: 2 },
  historyNote: { fontSize: 14, color: '#555' },
  controls: { marginTop: 10 },
  noteInput: { backgroundColor: '#fff', borderRadius: 16, padding: 16, fontSize: 14, borderWidth: 1.5, borderColor: '#f0f0f0', minHeight: 80, textAlignVertical: 'top' },
  actionRow: { flexDirection: 'row', gap: 12, marginTop: 16 },
  actionBtn: { flex: 1, padding: 16, borderRadius: 16, alignItems: 'center', elevation: 2 },
  actionBtnText: { color: '#fff', fontWeight: 'bold' },
  bgBlue: { backgroundColor: '#0066cc' },
  bgGreen: { backgroundColor: '#2e7d32' },
});
