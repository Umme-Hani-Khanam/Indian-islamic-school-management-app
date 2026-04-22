import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { fetchStudentProfile } from '../services/api';

export default function StudentProfileScreen({ route }: any) {
  const { studentId, token } = route.params;
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchStudentProfile(studentId, token);
        setProfile(data);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Unable to load profile');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [studentId, token]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <View style={styles.headerCard}>
        <Text style={styles.title}>{profile.student.name}</Text>
        <Text style={styles.subtitle}>{profile.class.name} • Section {profile.class.section}</Text>
        {profile.parent ? <Text style={styles.subtitle}>Parent: {profile.parent.name}</Text> : null}
      </View>
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Attendance</Text>
        <Text style={styles.sectionValue}>Present: {profile.attendanceSummary?.present || 0}</Text>
        <Text style={styles.sectionValue}>Absent: {profile.attendanceSummary?.absent || 0}</Text>
        <Text style={styles.sectionValue}>Total: {profile.attendanceSummary?.total || 0}</Text>
      </View>
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Recent marks</Text>
        {profile.marks && profile.marks.length ? (
          profile.marks.map((mark: any) => (
            <View key={mark.id} style={styles.scoreRow}>
              <Text style={styles.subject}>{mark.subject.name}</Text>
              <Text style={styles.score}>{mark.marks}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.sectionValue}>No marks recorded yet.</Text>
        )}
      </View>
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Remarks</Text>
        {profile.remarks && profile.remarks.length ? (
          profile.remarks.map((remark: any) => (
            <View key={remark.id} style={styles.remarkRow}>
              <Text style={styles.remarkComment}>{remark.comment}</Text>
              <Text style={styles.remarkMeta}>{remark.teacher.name} • {remark.type}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.sectionValue}>No remarks yet.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' },
  headerCard: { backgroundColor: '#2563eb', borderRadius: 24, padding: 24, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '800', color: '#fff' },
  subtitle: { color: '#dbeafe', marginTop: 8, fontSize: 16 },
  sectionCard: { backgroundColor: '#fff', borderRadius: 20, padding: 18, marginBottom: 14, shadowColor: '#0f172a', shadowOpacity: 0.04, shadowRadius: 14, elevation: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 10 },
  sectionValue: { color: '#475569', fontSize: 15, marginBottom: 6 },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  subject: { color: '#334155', fontSize: 15 },
  score: { fontWeight: '700', color: '#0f172a' },
  remarkRow: { marginBottom: 14, borderBottomWidth: 1, borderBottomColor: '#e2e8f0', paddingBottom: 12 },
  remarkComment: { color: '#111827', fontSize: 15, marginBottom: 4 },
  remarkMeta: { color: '#64748b', fontSize: 13 },
  error: { color: '#b91c1c', textAlign: 'center', marginTop: 24 },
});
