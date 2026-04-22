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

  const { 
    student, classDetails, subjects, attendance, 
    positiveRemarks, negativeRemarks, disciplineRecord, redAlerts,
    dailyPerformance, monthlyProgress, assignedTeachers, ratingScore 
  } = profile;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header & Rating */}
      <View style={styles.headerCard}>
        <View style={styles.headerInfo}>
          <Text style={styles.nameText}>{student.name}</Text>
          <Text style={styles.subtitleText}>Roll No: {student.rollNumber}</Text>
          {classDetails && (
            <Text style={styles.subtitleText}>Class: {classDetails.name} - Sec {classDetails.section}</Text>
          )}
        </View>
        <View style={styles.ratingCircle}>
          <Text style={styles.ratingText}>{ratingScore}</Text>
          <Text style={styles.ratingLabel}>Score</Text>
        </View>
      </View>

      {/* Red Alerts */}
      {redAlerts && redAlerts.length > 0 && (
        <View style={[styles.card, styles.alertCard]}>
          <Text style={styles.alertHeader}>⚠️ RED ALERTS</Text>
          {redAlerts.map((a: any) => (
            <View key={a.id} style={styles.row}>
              <Text style={styles.alertText}>{new Date(a.date).toLocaleDateString()}: {a.description}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Daily Performance */}
      <Text style={styles.sectionTitle}>Daily Performance</Text>
      <View style={styles.card}>
        {dailyPerformance && dailyPerformance.length > 0 ? (
          dailyPerformance.map((p: any, idx: number) => (
            <View key={idx} style={styles.row}>
              <Text style={styles.rowLabel}>{new Date(p.date).toLocaleDateString()}</Text>
              <Text style={styles.rowValue}>{p.score}%</Text>
            </View>
          ))
        ) : <Text style={styles.emptyText}>No daily data.</Text>}
      </View>

      {/* Monthly Progress */}
      <Text style={styles.sectionTitle}>Monthly Progress</Text>
      <View style={styles.card}>
        {monthlyProgress && monthlyProgress.length > 0 ? (
          monthlyProgress.map((m: any, idx: number) => (
            <View key={idx} style={styles.row}>
              <Text style={styles.rowLabel}>{m.month}</Text>
              <Text style={styles.rowValue}>{m.score}%</Text>
            </View>
          ))
        ) : <Text style={styles.emptyText}>No monthly data.</Text>}
      </View>

      {/* Subject-wise Scores */}
      <Text style={styles.sectionTitle}>Subject Scores</Text>
      {subjects && subjects.length > 0 ? (
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
      ) : <Text style={styles.emptyText}>No subject scores.</Text>}

      {/* Attendance */}
      <Text style={styles.sectionTitle}>Attendance</Text>
      <View style={styles.card}>
        {attendance && attendance.length > 0 ? (
          attendance.map((a: any) => (
            <View key={a.id} style={styles.row}>
              <Text style={styles.rowLabel}>{new Date(a.date).toLocaleDateString()}</Text>
              <Text style={[
                styles.statusBadge, 
                a.status === 'PRESENT' ? styles.statusGreen : 
                a.status === 'ABSENT' ? styles.statusRed : styles.statusOrange
              ]}>{a.status}</Text>
            </View>
          ))
        ) : <Text style={styles.emptyText}>No attendance records.</Text>}
      </View>

      {/* Remarks */}
      <Text style={styles.sectionTitle}>Remarks</Text>
      <View style={styles.card}>
        <Text style={[styles.cardHeader, { color: '#2e7d32' }]}>Positive Remarks</Text>
        {positiveRemarks && positiveRemarks.length > 0 ? (
          positiveRemarks.map((r: any) => (
            <View key={r.id} style={styles.remarkBox}>
              <Text style={styles.dateLabel}>{new Date(r.date).toLocaleDateString()}</Text>
              <Text style={styles.remarkText}>{r.comment}</Text>
            </View>
          ))
        ) : <Text style={styles.emptyLabel}>No positive remarks.</Text>}
        
        <View style={{ height: 16 }} />

        <Text style={[styles.cardHeader, { color: '#c62828' }]}>Negative Remarks</Text>
        {negativeRemarks && negativeRemarks.length > 0 ? (
          negativeRemarks.map((r: any) => (
            <View key={r.id} style={styles.remarkBox}>
              <Text style={styles.dateLabel}>{new Date(r.date).toLocaleDateString()}</Text>
              <Text style={styles.remarkText}>{r.comment}</Text>
            </View>
          ))
        ) : <Text style={styles.emptyLabel}>No negative remarks.</Text>}
      </View>

      {/* Discipline & Issue History */}
      <Text style={styles.sectionTitle}>Discipline History</Text>
      <View style={styles.card}>
        {disciplineRecord && disciplineRecord.length > 0 ? (
          disciplineRecord.map((d: any) => (
            <View key={d.id} style={styles.row}>
              <Text style={styles.rowLabel}>{new Date(d.date).toLocaleDateString()}</Text>
              <Text style={{flex: 1, marginHorizontal: 8, color: '#333'}}>{d.description}</Text>
              <Text style={[
                styles.statusBadge, 
                d.severity === 'MINOR' ? styles.statusOrange : styles.statusRed
              ]}>{d.severity}</Text>
            </View>
          ))
        ) : <Text style={styles.emptyText}>Clean discipline record.</Text>}
      </View>

      {/* Assigned Teachers */}
      <Text style={styles.sectionTitle}>Assigned Teachers</Text>
      <View style={styles.card}>
        {assignedTeachers && assignedTeachers.length > 0 ? (
          assignedTeachers.map((at: any, idx: number) => (
            <View key={idx} style={styles.row}>
              <Text style={styles.rowLabel}>{at.subject.name}</Text>
              <Text style={styles.rowValue}>Emp {at.teacher.employeeId} ({at.teacher.department})</Text>
            </View>
          ))
        ) : <Text style={styles.emptyText}>No assigned teachers found.</Text>}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  container: { padding: 16 },
  headerCard: { backgroundColor: '#0066cc', padding: 20, borderRadius: 12, marginBottom: 20, elevation: 3, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerInfo: { flex: 1 },
  nameText: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  subtitleText: { fontSize: 14, color: '#e0e0e0', marginBottom: 2 },
  ratingCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 4 },
  ratingText: { fontSize: 22, fontWeight: 'bold', color: '#0066cc' },
  ratingLabel: { fontSize: 10, color: '#666', fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 12, marginTop: 8 },
  card: { backgroundColor: '#ffffff', padding: 16, borderRadius: 12, marginBottom: 16, elevation: 2, borderWidth: 1, borderColor: '#eee' },
  alertCard: { backgroundColor: '#ffebee', borderColor: '#ffcdd2', borderWidth: 2 },
  alertHeader: { fontSize: 16, fontWeight: 'bold', color: '#c62828', marginBottom: 8 },
  alertText: { fontSize: 15, color: '#b71c1c', fontWeight: 'bold' },
  cardHeader: { fontSize: 16, fontWeight: 'bold', color: '#444', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  rowLabel: { fontSize: 15, color: '#555' },
  rowValue: { fontSize: 15, fontWeight: 'bold', color: '#111' },
  emptyLabel: { fontStyle: 'italic', color: '#888', fontSize: 14 },
  statusBadge: { fontWeight: 'bold', fontSize: 11, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, overflow: 'hidden' },
  statusGreen: { backgroundColor: '#d4edda', color: '#155724' },
  statusRed: { backgroundColor: '#f8d7da', color: '#721c24' },
  statusOrange: { backgroundColor: '#fff3cd', color: '#856404' },
  remarkBox: { paddingVertical: 6 },
  dateLabel: { fontSize: 12, color: '#888', marginBottom: 2 },
  remarkText: { fontSize: 15, color: '#333', fontStyle: 'italic' },
  errorText: { color: '#dc3545', fontSize: 16, textAlign: 'center' },
  emptyText: { color: '#888', fontSize: 15, fontStyle: 'italic', marginBottom: 8 }
});
