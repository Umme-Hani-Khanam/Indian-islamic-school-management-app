import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { api } from '@/utils/api';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/auth';
import { Palette, Spacing, Radius, Shadows } from '@/constants/Theme';
import { Card, H1, Title, Body, Label, MetricCard, Surface, LoadingState, ErrorState } from '@/components/DesignSystem';
import { Ionicons } from '@expo/vector-icons';

export default function TeacherDashboard() {
  const { signOut } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchData = useCallback(async () => {
    try {
      const r = await api.get('/teacher/dashboard');
      setData(r.data);
      setError(null);
    } catch (e: any) {
      if (__DEV__) console.log('[DEV] Teacher Dashboard Sync Error:', e.message, e.response?.data);
      setError(e.response?.data?.message || 'Failed to sync with school records.');
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

  if (loading && !data) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={fetchData} />;

  // Defensive fallback data
  const { 
    teacher = { name: 'Teacher' }, 
    summary = { totalStudents: 0 }, 
    pendingItems = [], 
    classes = [] 
  } = data || {};

  return (
    <Surface style={s.main}>
      <ScrollView 
        contentContainerStyle={s.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Palette.primary} />}
      >
        <View style={s.header}>
          <View style={{ flex: 1 }}>
            <Label style={{ color: Palette.primary, marginBottom: 4 }}>Academy Faculty</Label>
            <H1>Salam, {(teacher.name || 'Teacher').split(' ')[0]}</H1>
          </View>
          <TouchableOpacity style={s.logoutBtn} onPress={signOut}>
             <Ionicons name="log-out-outline" size={20} color={Palette.muted} />
          </TouchableOpacity>
        </View>

        {/* Priority Workspace - High Efficiency Grid */}
        <Label style={s.sectionLabel}>Priority Workspace</Label>
        <View style={s.actionGrid}>
          <QuickAction 
            label="Marks" 
            icon="stats-chart" 
            color={Palette.primary}
            onPress={() => (router as any).push('/(protected)/teacher/students')} 
          />
          <QuickAction 
            label="Remarks" 
            icon="chatbubble-ellipses" 
            color={Palette.info}
            onPress={() => (router as any).push('/(protected)/teacher/students')} 
          />
          <QuickAction 
            label="Alert" 
            icon="warning" 
            color={Palette.danger}
            onPress={() => (router as any).push('/(protected)/alerts/create')} 
          />
          <QuickAction 
            label="Reports" 
            icon="document-text" 
            color={Palette.success}
            onPress={() => {}} 
          />
        </View>

        {/* Status Metrics */}
        <View style={s.metricContainer}>
           <MetricCard 
             label="My Students" 
             value={(summary?.totalStudents ?? 0).toString()} 
             icon={<Ionicons name="people" size={14} color={Palette.muted} />}
             loading={loading}
           />
           <MetricCard 
             label="Attendance" 
             value="94%" 
             trend="up" 
             trendValue="+1%" 
             loading={loading}
           />
        </View>

        {/* Actionable Tasks */}
        <Label style={s.sectionLabel}>Needs Attention</Label>
        {Array.isArray(pendingItems) && pendingItems.length > 0 ? pendingItems.map((item: string, i: number) => (
          <Card key={i} variant="flat" style={s.priorityCard} pressable onPress={() => {}}>
             <View style={s.priorityRow}>
                <View style={[s.priorityDot, { backgroundColor: i === 0 ? Palette.danger : Palette.warning }]} />
                <Body style={{ flex: 1, fontSize: 14 }}>{item}</Body>
                <Ionicons name="chevron-forward" size={16} color={Palette.border} />
             </View>
          </Card>
        )) : <Body style={{ color: Palette.muted, marginVertical: Spacing.s }}>Clear workflow. No tasks pending.</Body>}

        {/* Class Overview */}
        <Label style={s.sectionLabel}>Class Assignments</Label>
        <View style={s.classesList}>
          {Array.isArray(classes) && classes.length > 0 ? classes.map((c: any) => (
            <Card key={c.id} style={s.classCard} pressable onPress={() => {}}>
               <View style={s.classIconBox}>
                  <Ionicons name="school" size={20} color={Palette.primarySoft} />
               </View>
               <Title style={{ fontSize: 15 }}>{c.name}</Title>
               <Label style={{ marginTop: 2, color: Palette.muted }}>Sect {c.section}</Label>
            </Card>
          )) : <Body style={{ color: Palette.muted, marginVertical: Spacing.s }}>No assigned classes.</Body>}
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </Surface>
  );
}

function QuickAction({ label, icon, onPress, color }: any) {
  return (
    <TouchableOpacity style={s.qAction} onPress={onPress} activeOpacity={0.7}>
       <View style={[s.qIconBox, { backgroundColor: color + '10', borderColor: color + '20' }]}>
          <Ionicons name={icon} size={26} color={color} />
       </View>
       <Label style={{ color: Palette.text, marginTop: Spacing.s, fontSize: 10 }}>{label}</Label>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  main: { flex: 1 },
  content: { padding: Spacing.l },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center',
    marginBottom: Spacing.xl,
    marginTop: Spacing.m
  },
  logoutBtn: { backgroundColor: Palette.surfaceAlt, padding: Spacing.s, borderRadius: Radius.m },
  actionGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.xl },
  qAction: { alignItems: 'center', width: '22%' },
  qIconBox: { 
    width: 60, 
    height: 60, 
    borderRadius: Radius.xl, 
    backgroundColor: Palette.white, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: Palette.border,
    ...Shadows.soft
  },
  metricContainer: { flexDirection: 'row', gap: Spacing.m, marginBottom: Spacing.xl },
  sectionLabel: { marginBottom: Spacing.m, marginTop: Spacing.s, color: Palette.muted },
  priorityCard: { marginBottom: Spacing.s, paddingVertical: Spacing.m, paddingHorizontal: Spacing.m },
  priorityRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.m },
  priorityDot: { width: 8, height: 8, borderRadius: 4 },
  classesList: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.m },
  classCard: { width: '47%', padding: Spacing.m, backgroundColor: Palette.white },
  classIconBox: { marginBottom: Spacing.s },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  retryBtn: { marginTop: Spacing.xl, paddingVertical: Spacing.m, paddingHorizontal: Spacing.xl, borderRadius: Radius.full, borderWidth: 1, borderColor: Palette.primary },
});
