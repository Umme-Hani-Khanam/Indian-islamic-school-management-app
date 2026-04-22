import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { api } from '@/utils/api';
import { Stack } from 'expo-router';
import { BarChart } from '@/components/CommonCharts';

export default function PerformanceScreen() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const r = await api.get('/parent/child/performance');
      setData(r.data);
      setError(null);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to load performance data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  if (loading && !data) return <View style={s.centered}><ActivityIndicator size="large" color="#1b5e20" /></View>;
  if (error) return <View style={s.centered}><Text style={s.errorText}>{error}</Text></View>;
  if (!data) return <View style={s.centered}><Text style={s.emptyText}>No data available.</Text></View>;

  const { student, subjects, homework, positiveRemarks, negativeRemarks, assignedTeachers } = data;

  const compareData = subjects?.map((s: any) => ({
    label: s.subject.name.substring(0, 4),
    value: s.marks.length > 0 ? (s.marks[s.marks.length - 1].score / s.marks[s.marks.length - 1].total) * 100 : 0
  })) || [];

  return (
    <ScrollView 
      contentContainerStyle={s.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Stack.Screen options={{ title: `${student.name}'s Analysis` }} />

      {/* Analytics Overview */}
      <SectionLabel title="Subject Breakdown" subtitle="Relative performance comparison" />
      <View style={s.card}>
        <View style={s.chartBox}>
          <BarChart data={compareData} />
        </View>
      </View>

      {/* Homework Task Tracking */}
      <SectionLabel title="Task Completion" subtitle="Subject-wise homework status" />
      {(Array.isArray(homework) ? homework : []).map((hw: any, idx: number) => (
        <View key={idx} style={s.card}>
          <View style={s.row}>
            <Text style={s.subjectName}>{hw.subject}</Text>
            <View style={s.pctBadge}>
              <Text style={s.hwPct}>{hw.completionPct}%</Text>
            </View>
          </View>
          <View style={s.progressContainer}>
             <View style={[s.progressFill, { width: `${hw.completionPct}%` }]} />
          </View>
          <View style={s.taskList}>
            {hw.tasks.map((task: any, tIdx: number) => (
              <View key={tIdx} style={s.taskRow}>
                <View style={[s.taskCheck, task.isCompleted && s.checkActive]}>
                  {task.isCompleted && <Text style={s.checkSign}>✓</Text>}
                </View>
                <Text style={[s.taskText, task.isCompleted && s.taskCompleted]}>
                  {task.title}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ))}

      {/* Teacher Evaluation Cards */}
      <SectionLabel title="Faculty Guidance" subtitle="Teacher impact and ranking" />
      {assignedTeachers?.map((t: any, i: number) => (
        <View key={i} style={s.card}>
          <View style={s.teacherHeader}>
            <View style={s.teacherInfo}>
              <Text style={s.teacherDept}>{t.department}</Text>
              <Text style={s.teacherSub}>{t.subject}</Text>
            </View>
            <View style={s.scoreCircle}>
                <Text style={s.scoreNum}>{t.performanceScore}</Text>
                <Text style={s.scoreUnits}>Score</Text>
            </View>
          </View>
          <View style={s.metricGrid}>
            <MetricBox label="Ranking" value={`#${t.ranking}`} color="#1b5e20" />
            <MetricBox label="Guidance" value={`${t.guidanceEffectiveness}%`} color="#0066cc" />
            <MetricBox label="Status" value="Excellent" color="#ef6c00" />
          </View>
        </View>
      ))}

      {/* Behavioral Summary */}
      <SectionLabel title="Teacher Observations" subtitle="Guidance and behavioral notes" />
      <View style={s.card}>
        {positiveRemarks?.length > 0 ? positiveRemarks.map((r: any) => (
          <View key={r.id} style={s.remarkItem}>
            <Text style={s.remarkBullet}>★</Text>
            <Text style={s.remarkContent}>{r.comment}</Text>
          </View>
        )) : <Text style={s.emptyText}>No behavioral notes recorded.</Text>}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

function SectionLabel({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <View style={s.sectionHeader}>
      <Text style={s.sectionTitle}>{title}</Text>
      <Text style={s.sectionSubtitle}>{subtitle}</Text>
    </View>
  );
}

function MetricBox({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={s.metricBox}>
      <Text style={[s.metricVal, { color }]}>{value}</Text>
      <Text style={s.metricLbl}>{label}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fdfdfd' },
  container: { padding: 16, backgroundColor: '#fdfdfd' },
  sectionHeader: { marginBottom: 16, paddingLeft: 4, marginTop: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1a1a1a' },
  sectionSubtitle: { fontSize: 13, color: '#999', marginTop: 2 },
  card: { 
    backgroundColor: '#fff', 
    padding: 24, 
    borderRadius: 24, 
    marginBottom: 24, 
    borderWidth: 1, 
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2
  },
  chartBox: { height: 180, justifyContent: 'center', alignItems: 'center' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  subjectName: { fontSize: 16, fontWeight: '700', color: '#1a1a1a' },
  pctBadge: { backgroundColor: '#e8f5e9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  hwPct: { fontSize: 14, fontWeight: '800', color: '#2e7d32' },
  progressContainer: { height: 8, backgroundColor: '#f0f0f0', borderRadius: 4, overflow: 'hidden', marginBottom: 20 },
  progressFill: { height: '100%', backgroundColor: '#1b5e20', borderRadius: 4 },
  taskList: { gap: 10 },
  taskRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
  taskCheck: { width: 18, height: 18, borderRadius: 6, borderWidth: 1.5, borderColor: '#e0e0e0', marginRight: 12, justifyContent: 'center', alignItems: 'center' },
  checkActive: { backgroundColor: '#1b5e20', borderColor: '#1b5e20' },
  checkSign: { color: '#fff', fontSize: 10, fontWeight: '900' },
  taskText: { fontSize: 14, color: '#555', fontWeight: '500' },
  taskCompleted: { color: '#bbb', textDecorationLine: 'line-through' },
  teacherHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  teacherInfo: { flex: 1 },
  teacherDept: { fontSize: 15, fontWeight: '800', color: '#1a1a1a' },
  teacherSub: { fontSize: 12, color: '#888', fontWeight: '600', marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.5 },
  scoreCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#f1f8e9', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#c8e6c9' },
  scoreNum: { fontSize: 18, fontWeight: '900', color: '#1b5e20' },
  scoreUnits: { fontSize: 8, color: '#666', fontWeight: '700', textTransform: 'uppercase' },
  metricGrid: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 16, borderTopWidth: 1, borderTopColor: '#f8f9fa' },
  metricBox: { alignItems: 'center', flex: 1 },
  metricVal: { fontSize: 16, fontWeight: '800' },
  metricLbl: { fontSize: 10, color: '#999', fontWeight: '700', marginTop: 4, textTransform: 'uppercase' },
  remarkItem: { flexDirection: 'row', marginBottom: 12, paddingRight: 8 },
  remarkBullet: { color: '#ef6c00', marginRight: 10, fontSize: 16 },
  remarkContent: { flex: 1, fontSize: 14, color: '#444', lineHeight: 20, fontWeight: '500' },
  errorText: { color: '#dc3545', fontSize: 15, textAlign: 'center' },
  emptyText: { color: '#999', fontSize: 14, fontStyle: 'italic', textAlign: 'center' },
});
