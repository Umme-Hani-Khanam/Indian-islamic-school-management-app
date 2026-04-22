import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { api } from '@/utils/api';
import { useAuth } from '@/context/auth';
import { Palette, Spacing, Radius } from '@/constants/Theme';
import { 
  Card, H1, Title, Body, Label, MetricCard, Surface, 
  Skeleton, ErrorState 
} from '@/components/DesignSystem';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function HeadmasterDashboard() {
  const { signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchData = useCallback(async () => {
    try {
      const response = await api.get('/school/overview');
      setData(response.data);
      setError(null);
    } catch (e: any) {
      if (__DEV__) console.log('[DEV] Headmaster Dashboard Sync Error:', e.message, e.response?.data);
      setError('Unable to sync institutional pulse. Please check your connectivity.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setData(null); // Full reset for retry
    fetchData();
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  if (loading && !data) return <DashboardSkeleton />;
  if (error) return <Surface style={s.centered}><ErrorState message={error} onRetry={handleRetry} /></Surface>;

  // Defensive fallback data
  const { 
    enrollmentCount = 0, 
    teacherCount = 0, 
    classCount = 0, 
    criticalAlerts = 0, 
    staffAttendance = '0%', 
    weakPerformanceClasses = [] 
  } = data || {};

  return (
    <Surface style={s.main}>
      <ScrollView 
        contentContainerStyle={s.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Palette.primary} />}
      >
        <View style={s.header}>
          <View>
            <Label style={{ color: Palette.primary, marginBottom: 4 }}>Institutional Hub</Label>
            <H1>Dashboard Overview</H1>
          </View>
          <View style={s.headerActions}>
             <Card variant="flat" style={s.iconBtn} pressable onPress={() => {}}>
                <Ionicons name="notifications-outline" size={24} color={Palette.text} />
             </Card>
             <Card variant="flat" style={[s.iconBtn, { marginLeft: Spacing.s }]} pressable onPress={signOut}>
                <Ionicons name="log-out-outline" size={24} color={Palette.danger} />
             </Card>
          </View>
        </View>

        {/* Dynamic Critical Alerts */}
        {criticalAlerts > 0 && (
          <Card 
            variant="premium" 
            pressable 
            onPress={() => (router as any).push('/(protected)/alerts')} 
            style={s.criticalCard}
          >
            <View style={s.criticalRow}>
              <View style={s.alertIconContainer}>
                <Ionicons name="alert-circle" size={28} color={Palette.danger} />
              </View>
              <View style={{ flex: 1 }}>
                <Title style={{ color: Palette.text }}>{criticalAlerts} Critical Disruptions</Title>
                <Body style={{ color: Palette.muted, fontSize: 13 }}>Administrative intervention required</Body>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Palette.border} />
            </View>
          </Card>
        )}

        {/* Global KPIs */}
        <Label style={s.sectionLabel}>Institutional Health</Label>
        <View style={s.metricContainer}>
            <MetricCard 
              label="Enrollment" 
              value={enrollmentCount.toString()} 
              icon={<Ionicons name="people" size={16} color={Palette.muted} />}
              loading={loading}
            />
            <MetricCard 
              label="Teachers" 
              value={teacherCount.toString()} 
              icon={<Ionicons name="briefcase" size={16} color={Palette.muted} />}
              loading={loading}
            />
        </View>
        <View style={s.metricContainer}>
            <MetricCard 
              label="Classes" 
              value={classCount.toString()} 
              icon={<Ionicons name="business" size={16} color={Palette.muted} />}
              loading={loading}
            />
            <MetricCard 
              label="Staff Presence" 
              value={staffAttendance} 
              icon={<Ionicons name="calendar-check" size={16} color={Palette.muted} />}
              loading={loading}
            />
        </View>

        {/* Priority Watchlist */}
        <View style={s.splitRows}>
          <View style={{ flex: 1 }}>
            <Label style={s.sectionLabel}>Risk Watchlist</Label>
            {Array.isArray(weakPerformanceClasses) && weakPerformanceClasses.length > 0 ? (
              weakPerformanceClasses.map((c: string, i: number) => (
                <Card key={i} style={s.subCard}>
                   <Body style={{ fontWeight: '700' }}>{c}</Body>
                   <Label style={{ color: Palette.danger, fontSize: 10, marginTop: 2 }}>Attention Needed</Label>
                </Card>
              ))
            ) : (
              <Body style={{ color: Palette.muted, marginVertical: Spacing.s }}>No classes currently flagged for low performance.</Body>
            )}
          </View>
        </View>

        <Label style={s.sectionLabel}>System Modules</Label>
        <View style={s.shortcutGrid}>
            <Shortcut label="Calendar" icon="calendar-outline" />
            <Shortcut label="HR Hub" icon="people-outline" />
            <Shortcut label="Supplies" icon="cube-outline" />
            <Shortcut label="Reports" icon="bar-chart-outline" />
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </Surface>
  );
}

function Shortcut({ label, icon }: { label: string, icon: any }) {
  return (
    <Card pressable onPress={() => {}} style={s.shortcutItem}>
       <Ionicons name={icon} size={24} color={Palette.primary} />
       <Label style={{ marginTop: Spacing.s, color: Palette.text, fontSize: 10 }}>{label}</Label>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <Surface style={s.main}>
      <View style={s.content}>
        <View style={s.header}>
            <View><Skeleton width={200} height={32} /><Skeleton width={120} height={16} style={{ marginTop: 8 }} /></View>
        </View>
        <Skeleton width="100%" height={80} radius={Radius.l} style={{ marginBottom: Spacing.xl }} />
        <View style={{ flexDirection: 'row', gap: Spacing.m, marginBottom: Spacing.m }}>
            <Skeleton width="48%" height={100} radius={Radius.l} />
            <Skeleton width="48%" height={100} radius={Radius.l} />
        </View>
        <View style={{ flexDirection: 'row', gap: Spacing.m, marginBottom: Spacing.xl }}>
            <Skeleton width="48%" height={100} radius={Radius.l} />
            <Skeleton width="48%" height={100} radius={Radius.l} />
        </View>
        <Skeleton width={150} height={20} style={{ marginBottom: Spacing.m }} />
        <Skeleton width="100%" height={60} radius={Radius.l} style={{ marginBottom: Spacing.s }} />
        <Skeleton width="100%" height={60} radius={Radius.l} />
      </View>
    </Surface>
  );
}

const s = StyleSheet.create({
  main: { flex: 1 },
  content: { padding: Spacing.l },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: Spacing.xl,
    marginTop: Spacing.m
  },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: { padding: Spacing.s, borderRadius: Radius.m },
  metricContainer: { flexDirection: 'row', gap: Spacing.m, marginBottom: Spacing.m },
  sectionLabel: { marginBottom: Spacing.m, marginTop: Spacing.s },
  criticalCard: { marginBottom: Spacing.xl, borderLeftWidth: 4, borderLeftColor: Palette.danger, padding: Spacing.m },
  criticalRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.m },
  alertIconContainer: { width: 48, height: 48, borderRadius: Radius.m, backgroundColor: Palette.danger + '10', justifyContent: 'center', alignItems: 'center' },
  splitRows: { flexDirection: 'row', gap: Spacing.m, marginBottom: Spacing.xl },
  subCard: { marginBottom: Spacing.s, padding: Spacing.m },
  shortcutGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.m },
  shortcutItem: { width: '22%', alignItems: 'center', padding: Spacing.s, justifyContent: 'center' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
