import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { api } from '@/utils/api';
import { useRouter } from 'expo-router';
import { Palette, Spacing, Radius, Shadows } from '@/constants/Theme';
import { Card, H1, Title, Body, Label, MetricCard, Surface, Badge, LoadingState, ErrorState } from '@/components/DesignSystem';
import { Ionicons } from '@expo/vector-icons';
import { TrendLine } from './CommonCharts';

export default function ParentDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchData = useCallback(async () => {
    try {
      const r = await api.get('/parent/dashboard');
      setData(r.data);
      setError(null);
    } catch (e: any) {
      if (__DEV__) console.log('[DEV] Parent Dashboard Sync Error:', e.message, e.response?.data);
      setError(e.response?.data?.message || 'Connection lost. Please try again.');
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

  if (loading && !data) return <LoadingState message="Greeting your student's profile..." />;
  if (error) return <ErrorState message={error} onRetry={fetchData} />;

  // Defensive fallback data
  const { 
    child = { name: 'Student' }, 
    attendancePct = 0, 
    alertsCount = 0, 
    latestMarks = [], 
    ratingScore = 'N/A', 
    trendData = [] 
  } = data || {};

  const classObj = child?.classDetails || child?.class || { name: 'Grade', section: 'A' };

  return (
    <Surface style={s.main}>
      <ScrollView 
        contentContainerStyle={s.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Palette.primary} />}
      >
        {/* Reassuring Profile Header */}
        <View style={s.header}>
          <View style={s.avatarPlaceholder}>
             <Ionicons name="person" size={32} color={Palette.primarySoft} />
          </View>
          <View style={{ flex: 1, marginLeft: Spacing.m }}>
            <Label style={{ color: Palette.muted }}>Academic Journey of</Label>
            <H1 style={{ fontSize: 24 }}>{child.name || 'Student'}</H1>
            <View style={s.classRow}>
              <Badge label={`${classObj?.name} • Sec ${classObj?.section}`} type="info" />
            </View>
          </View>
          <Card variant="premium" style={s.ratingCard}>
              <Title style={{ color: Palette.primary }}>{ratingScore}</Title>
              <Label style={{ fontSize: 8 }}>Rating</Label>
          </Card>
        </View>

        {/* Stats Row */}
        <View style={s.statsRow}>
           <MetricCard 
             label="Attendance" 
             value={`${attendancePct}%`} 
             trend={attendancePct >= 80 ? 'up' : 'down'}
             trendValue={attendancePct >= 80 ? 'Optimal' : 'Needs Care'}
             loading={loading}
           />
           <MetricCard 
             label="Alerts" 
             value={(alertsCount || 0).toString()} 
             icon={<Ionicons name="notifications" size={16} color={alertsCount > 0 ? Palette.danger : Palette.success} />}
             loading={loading}
           />
        </View>

        {/* Academic pulse */}
        <SectionLabel title="Academic Pulse" subtitle="Recent evaluation performance" />
        <Card style={s.listCard}>
          {Array.isArray(latestMarks) && latestMarks.length > 0 ? latestMarks.map((m: any, i: number) => (
            <View key={i} style={[s.row, i === latestMarks.length - 1 && { borderBottomWidth: 0 }]}>
              <Body style={{ fontWeight: '600' }}>{m.subject}</Body>
              <View style={s.scoreBox}>
                <Title style={{ color: Palette.primary }}>{m.score}</Title>
                <Label style={{ marginLeft: 2, textTransform: 'none' }}>/{m.total}</Label>
              </View>
            </View>
          )) : <Body style={s.emptyText}>No recent marks available.</Body>}
          
          <TouchableOpacity 
            style={s.moreBtn}
            onPress={() => (router as any).push('/(protected)/parent/performance')}
          >
            <Label style={{ color: Palette.primary }}>View Full Analytics</Label>
            <Ionicons name="arrow-forward" size={14} color={Palette.primary} />
          </TouchableOpacity>
        </Card>

        {/* Learning Trajectory */}
        <SectionLabel title="Growth Trajectory" subtitle="Performance momentum" />
        <Card style={s.chartCard}>
           <TrendLine data={Array.isArray(trendData) ? trendData : []} height={120} />
           <View style={s.reassuranceBatch}>
              <Ionicons name="sparkles" size={14} color={Palette.success} />
              <Body style={s.reassuranceText}>The student is blooming beautifully.</Body>
           </View>
        </Card>

        {/* Support Actions */}
        <View style={s.footerActions}>
           <TouchableOpacity 
             style={s.primaryAction} 
             onPress={() => (router as any).push('/(protected)/alerts/create')}
           >
              <Title style={{ color: Palette.white, fontSize: 16 }}>Request Support</Title>
              <Ionicons name="chatbubbles" size={20} color={Palette.white} />
           </TouchableOpacity>
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </Surface>
  );
}

function SectionLabel({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <View style={s.sectionHeader}>
      <Title style={s.sectionTitle}>{title}</Title>
      <Label style={s.sectionSubtitle}>{subtitle}</Label>
    </View>
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
  avatarPlaceholder: { 
    width: 64, 
    height: 64, 
    borderRadius: Radius.xl, 
    backgroundColor: Palette.white, 
    borderWidth: 1, 
    borderColor: Palette.border,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.soft
  },
  classRow: { marginTop: Spacing.xs },
  ratingCard: { padding: Spacing.s, alignItems: 'center', minWidth: 60 },
  statsRow: { flexDirection: 'row', gap: Spacing.m, marginBottom: Spacing.xl },
  sectionHeader: { marginBottom: Spacing.m, marginTop: Spacing.s },
  sectionTitle: { fontSize: 18, fontWeight: '800' },
  sectionSubtitle: { color: Palette.muted, fontSize: 12, marginTop: 2, textTransform: 'none' },
  listCard: { padding: 0, overflow: 'hidden' },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: Spacing.l, 
    borderBottomWidth: 1, 
    borderBottomColor: Palette.surfaceAlt 
  },
  scoreBox: { flexDirection: 'row', alignItems: 'baseline' },
  moreBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: Spacing.s, 
    padding: Spacing.m, 
    backgroundColor: Palette.surfaceAlt 
  },
  chartCard: { padding: Spacing.l },
  reassuranceBatch: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: Spacing.s, 
    marginTop: Spacing.m, 
    backgroundColor: Palette.success + '10', 
    padding: Spacing.s, 
    borderRadius: Radius.m 
  },
  reassuranceText: { fontSize: 12, color: Palette.success, fontWeight: '700' },
  footerActions: { marginTop: Spacing.m },
  primaryAction: { 
    backgroundColor: Palette.primary, 
    padding: Spacing.l, 
    borderRadius: Radius.full, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: Spacing.m,
    ...Shadows.medium
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { textAlign: 'center', color: Palette.muted, marginVertical: Spacing.xl, fontStyle: 'italic' },
  retryBtn: { marginTop: Spacing.xl, paddingVertical: Spacing.m, paddingHorizontal: Spacing.xl, borderRadius: Radius.full, borderWidth: 1, borderColor: Palette.primary },
});
