import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { api } from '@/utils/api';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

export default function TeacherStudentDetailScreen() {
  const { studentId } = useLocalSearchParams();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchData = useCallback(() => {
    api.get(`/teacher/student/${studentId}`)
      .then(r => setProfile(r.data))
      .catch(e => {
        console.error('FETCH PROFILE ERROR:', e.response?.data || e.message);
        setError(e.response?.data?.message || 'Access denied or student not found.');
      })
      .finally(() => setLoading(false));
  }, [studentId]);

  useFocusEffect(fetchData);

  if (loading && !profile) return <View style={s.centered}><ActivityIndicator size="large" color="#0066cc" /></View>;
  if (error) return <View style={s.centered}><Text style={s.errorText}>{error}</Text></View>;
  if (!profile) return <View style={s.centered}><Text style={s.emptyText}>No profile data.</Text></View>;

  const { student, classDetails, subjects, attendance, positiveRemarks, negativeRemarks, ratingScore } = profile;

  return (
    <ScrollView contentContainerStyle={s.container}>
      {/* Header Profile Card */}
      <View style={s.headerCard}>
        <View style={{ flex: 1 }}>
          <Text style={s.name}>{student.name}</Text>
          <Text style={s.sub}>Roll Number: {student.rollNumber}</Text>
          {classDetails && (
            <Text style={s.sub}>Class: {classDetails.name} – {classDetails.section}</Text>
          )}
        </View>
        <View style={s.badge}>
          <Text style={s.badgeNum}>{ratingScore}</Text>
          <Text style={s.badgeLbl}>Rating</Text>
        </View>
      </View>

      {/* Subject Marks Section */}
      <Text style={s.section}>Academic Performance</Text>
      {subjects?.filter((i: any) => i.marks.length > 0).map((item: any) => (
        <View key={item.subject.id} style={s.card}>
          <Text style={s.cardHeader}>{item.subject.name}</Text>
          {item.marks.map((m: any) => (
            <View key={m.id} style={s.row}>
              <View style={s.labelRow}>
                 <Text style={s.rowLabel}>{m.examType}</Text>
                 <Text style={s.dateSub}>{new Date(m.date).toLocaleDateString()}</Text>
              </View>
              <Text style={s.rowVal}>{m.score} / {m.total}</Text>
            </View>
          ))}
        </View>
      ))}
      {subjects?.every((i: any) => i.marks.length === 0) && (
        <View style={s.emptyCard}>
          <Text style={s.emptyText}>No marks recorded for this student.</Text>
        </View>
      )}

      {/* Attendance Summary */}
      <Text style={s.section}>Attendance Log</Text>
      <View style={s.card}>
        {attendance?.length > 0 ? attendance.slice(0, 5).map((a: any) => (
          <View key={a.id} style={s.row}>
            <Text style={s.rowLabel}>{new Date(a.date).toLocaleDateString()}</Text>
            <View style={[s.badgeSmall, a.status === 'PRESENT' ? s.bgGreen : a.status === 'ABSENT' ? s.bgRed : s.bgOrange]}>
              <Text style={[s.statusText, a.status === 'PRESENT' ? s.textGreen : a.status === 'ABSENT' ? s.textRed : s.textOrange]}>
                {a.status}
              </Text>
            </View>
          </View>
        )) : <Text style={s.emptyText}>No recent records found.</Text>}
      </View>

      {/* Insights / Remarks */}
      <Text style={s.section}>Behavioral Insights</Text>
      <View style={s.card}>
        <Text style={[s.cardHeader, { color: '#2e7d32' }]}>Positive Observations</Text>
        {positiveRemarks?.length > 0 ? positiveRemarks.map((r: any) => (
          <Text key={r.id} style={s.remarkText}>• {r.comment}</Text>
        )) : <Text style={s.emptyText}>No positive remarks yet.</Text>}
        
        <View style={s.divider} />
        
        <Text style={[s.cardHeader, { color: '#c62828' }]}>Improvement Areas</Text>
        {negativeRemarks?.length > 0 ? negativeRemarks.map((r: any) => (
          <Text key={r.id} style={s.remarkText}>• {r.comment}</Text>
        )) : <Text style={s.emptyText}>No areas for improvement noted.</Text>}
      </View>

      {/* Control Actions */}
      <View style={s.actionBox}>
        <TouchableOpacity style={s.btn} onPress={() => (router as any).push({ pathname: '/(protected)/teacher/add-mark', params: { studentId } })}>
          <Text style={s.btnText}>Add Academic Mark</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.btn, s.btnSecondary]} onPress={() => (router as any).push({ pathname: '/(protected)/teacher/add-remark', params: { studentId } })}>
          <Text style={s.btnText}>Submit New Remark</Text>
        </TouchableOpacity>
      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  container: { padding: 16, backgroundColor: '#f8f9fa' },
  headerCard: { backgroundColor: '#0066cc', padding: 24, borderRadius: 16, marginBottom: 20, flexDirection: 'row', alignItems: 'center', elevation: 4 },
  name: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  sub: { color: '#cce0ff', fontSize: 13, marginTop: 4 },
  badge: { width: 66, height: 66, borderRadius: 33, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginLeft: 12 },
  badgeNum: { fontSize: 22, fontWeight: 'bold', color: '#0066cc' },
  badgeLbl: { fontSize: 9, color: '#888', textTransform: 'uppercase', fontWeight: '700' },
  section: { fontSize: 16, fontWeight: '800', color: '#1a1a1a', marginBottom: 12, marginTop: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 16, elevation: 2, borderWidth: 1, borderColor: '#eee' },
  emptyCard: { padding: 20, alignItems: 'center' },
  cardHeader: { fontSize: 15, fontWeight: '700', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f1f1f1' },
  labelRow: { flex: 1 },
  rowLabel: { fontSize: 14, fontWeight: '600', color: '#333' },
  dateSub: { fontSize: 11, color: '#999', marginTop: 2 },
  rowVal: { fontSize: 15, fontWeight: 'bold', color: '#1a1a1a' },
  badgeSmall: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  bgGreen: { backgroundColor: '#e8f5e9' },
  bgRed: { backgroundColor: '#ffebee' },
  bgOrange: { backgroundColor: '#fff3e0' },
  statusText: { fontSize: 10, fontWeight: '800' },
  textGreen: { color: '#2e7d32' },
  textRed: { color: '#c62828' },
  textOrange: { color: '#ef6c00' },
  remarkText: { fontSize: 13, color: '#555', paddingVertical: 4, lineHeight: 18 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 12 },
  actionBox: { marginTop: 8 },
  btn: { backgroundColor: '#0066cc', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  btnSecondary: { backgroundColor: '#2e7d32' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  errorText: { color: '#dc3545', fontSize: 15, textAlign: 'center' },
  emptyText: { color: '#999', fontSize: 14, fontStyle: 'italic' },
});
