import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { api } from '@/utils/api';
import { useLocalSearchParams } from 'expo-router';

export default function StudentProfileScreen() {
  const { studentId } = useLocalSearchParams();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(`/school/students/${studentId}/profile`);
        setProfile(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load profile. You may not be authorized.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [studentId]);

  if (loading) return <View style={styles.centered}><ActivityIndicator size="large" color="#0066cc" /></View>;
  if (error) return <View style={styles.centered}><Text style={styles.errorText}>{error}</Text></View>;
  if (!profile) return <View style={styles.centered}><Text style={styles.emptyText}>Profile not found.</Text></View>;

  const { student, classDetails, subjects, attendance, remarks } = profile;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerCard}>
        <Text style={styles.nameText}>{student.name}</Text>
        <Text style={styles.subtitleText}>Roll No: {student.rollNumber}</Text>
        {classDetails && (
          <Text style={styles.subtitleText}>Class: {classDetails.name} - Sec {classDetails.section}</Text>
        )}
      </View>

      <Text style={styles.sectionTitle}>Academic Performance</Text>
      {subjects.length === 0 ? (
        <Text style={styles.emptyText}>No marks recorded.</Text>
      ) : (
        subjects.map((item: any) => (
          <View key={item.subject.id} style={styles.card}>
            <Text style={styles.cardHeader}>{item.subject.name} ({item.subject.code})</Text>
            {item.marks.length === 0 ? (
              <Text style={styles.emptyLabel}>No marks entry</Text>
            ) : (
              item.marks.map((m: any) => (
                <View key={m.id} style={styles.row}>
                  <Text style={styles.rowLabel}>{m.examType}</Text>
                  <Text style={styles.rowValue}>{m.score} / {m.total}</Text>
                </View>
              ))
            )}
          </View>
        ))
      )}

      <Text style={styles.sectionTitle}>Attendance</Text>
       {attendance.length === 0 ? (
        <Text style={styles.emptyText}>No attendance records.</Text>
      ) : (
        <View style={styles.card}>
          {attendance.map((a: any) => (
             <View key={a.id} style={styles.row}>
               <Text style={styles.rowLabel}>{new Date(a.date).toLocaleDateString()}</Text>
               <Text style={[
                 styles.statusBadge, 
                 a.status === 'PRESENT' ? styles.statusGreen : 
                 a.status === 'ABSENT' ? styles.statusRed : styles.statusOrange
               ]}>{a.status}</Text>
             </View>
          ))}
        </View>
      )}

      <Text style={styles.sectionTitle}>Teacher Remarks</Text>
       {remarks.length === 0 ? (
        <Text style={styles.emptyText}>No remarks available.</Text>
      ) : (
        <View style={styles.card}>
          {remarks.map((r: any) => (
             <View key={r.id} style={styles.remarkBox}>
               <Text style={styles.dateLabel}>{new Date(r.date).toLocaleDateString()}</Text>
               <Text style={styles.remarkText}>{r.comment}</Text>
             </View>
          ))}
        </View>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  container: { padding: 16 },
  headerCard: { backgroundColor: '#0066cc', padding: 20, borderRadius: 12, marginBottom: 20, elevation: 3 },
  nameText: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  subtitleText: { fontSize: 16, color: '#e0e0e0', marginBottom: 2 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 12, marginTop: 8 },
  card: { backgroundColor: '#ffffff', padding: 16, borderRadius: 12, marginBottom: 16, elevation: 2, borderWidth: 1, borderColor: '#eee' },
  cardHeader: { fontSize: 16, fontWeight: 'bold', color: '#444', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  rowLabel: { fontSize: 15, color: '#555' },
  rowValue: { fontSize: 15, fontWeight: 'bold', color: '#111' },
  emptyLabel: { fontStyle: 'italic', color: '#888' },
  statusBadge: { fontWeight: 'bold', fontSize: 12, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, overflow: 'hidden' },
  statusGreen: { backgroundColor: '#d4edda', color: '#155724' },
  statusRed: { backgroundColor: '#f8d7da', color: '#721c24' },
  statusOrange: { backgroundColor: '#fff3cd', color: '#856404' },
  remarkBox: { paddingVertical: 8 },
  dateLabel: { fontSize: 12, color: '#888', marginBottom: 4 },
  remarkText: { fontSize: 15, color: '#333', fontStyle: 'italic' },
  errorText: { color: '#dc3545', fontSize: 16, textAlign: 'center' },
  emptyText: { color: '#888', fontSize: 15, fontStyle: 'italic', marginBottom: 16 }
});
