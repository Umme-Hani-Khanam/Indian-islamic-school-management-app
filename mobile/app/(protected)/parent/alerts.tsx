import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image, TouchableOpacity, RefreshControl } from 'react-native';
import { api } from '@/utils/api';
import { Stack, useRouter } from 'expo-router';
import { Palette, Spacing, Radius } from '@/constants/Theme';
import { Card, H1, H2, Title, Body, Label, Badge, Shimmer, LoadingState, ErrorState } from '@/components/DesignSystem';
import { Ionicons } from '@expo/vector-icons';

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchData = useCallback(async () => {
    try {
      const r = await api.get('/parent/alerts');
      setAlerts(r.data);
      setError(null);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to sync alerts.');
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

  if (loading && !alerts.length) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={fetchData} />;

  const openAlerts = alerts.filter(a => a.status !== 'RESOLVED');
  const resolvedAlerts = alerts.filter(a => a.status === 'RESOLVED');

  return (
    <ScrollView 
      style={s.main}
      contentContainerStyle={s.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Palette.primary} />}
    >
      <Stack.Screen options={{ title: 'Safety & Care', headerShadowVisible: false }} />

      {/* Active Alerts */}
      <Label style={s.sectionLabel}>Pending Resolution</Label>
      {openAlerts.length > 0 ? openAlerts.map(alert => (
        <AlertCard key={alert.id} alert={alert} onPress={() => (router as any).push(`/(protected)/alerts/${alert.id}`)} />
      )) : (
        <Card style={s.emptyCard}>
           <Body style={{ color: Palette.muted, textAlign: 'center' }}>No active alerts requiring attention.</Body>
        </Card>
      )}

      {/* History */}
      <Label style={[s.sectionLabel, { marginTop: Spacing.xl }]}>Resolution History</Label>
      {resolvedAlerts.length > 0 ? resolvedAlerts.map(alert => (
        <AlertCard key={alert.id} alert={alert} onPress={() => (router as any).push(`/(protected)/alerts/${alert.id}`)} />
      )) : (
        <Card style={s.emptyCard}>
           <Body style={{ color: Palette.muted, textAlign: 'center' }}>No resolved cases found.</Body>
        </Card>
      )}
      
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

function AlertCard({ alert, onPress }: { alert: any; onPress: () => void }) {
  const isCritical = alert.priority === 'CRITICAL';
  const statusColor = alert.status === 'OPEN' ? Palette.danger : alert.status === 'RESOLVED' ? Palette.success : Palette.info;
  
  return (
    <Card pressable onPress={onPress} style={s.card}>
      <View style={s.cardHead}>
        <Badge 
          label={alert.priority} 
          type={isCritical ? 'danger' : alert.priority === 'HIGH' ? 'warning' : 'info'} 
        />
        <Label style={s.date}>{new Date(alert.createdAt).toLocaleDateString()}</Label>
      </View>
      
      <Title style={s.title}>{alert.title}</Title>
      <Body style={s.desc} numberOfLines={2}>{alert.description}</Body>
      
      <View style={s.footer}>
        <View style={s.statusRow}>
           <View style={[s.statusDot, { backgroundColor: statusColor }]} />
           <Label style={{ color: statusColor }}>{alert.status.replace('_', ' ')}</Label>
        </View>
        <Ionicons name="arrow-forward" size={16} color={Palette.primary} />
      </View>
    </Card>
  );
}

function LoadingState() {
  return (
    <View style={s.centered}>
      <ActivityIndicator color={Palette.primary} />
      <Body style={{ marginTop: Spacing.m }}>Fetching safety updates...</Body>
    </View>
  );
}

function ErrorState({ message, onRetry }: any) {
  return (
    <View style={s.centered}>
      <Ionicons name="alert-circle-outline" size={48} color={Palette.danger} />
      <H2 style={{ marginTop: Spacing.m }}>{message}</H2>
      <TouchableOpacity onPress={onRetry} style={s.retryBtn}>
        <Label style={{ color: Palette.primary }}>Try Again</Label>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  main: { flex: 1, backgroundColor: Palette.surface },
  content: { padding: Spacing.l },
  sectionLabel: { marginBottom: Spacing.m },
  card: { marginBottom: Spacing.m, paddingBottom: Spacing.m },
  cardHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.s },
  date: { fontSize: 11 },
  title: { marginBottom: Spacing.xs },
  desc: { color: Palette.muted, marginBottom: Spacing.m, lineHeight: 18 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: Spacing.m, borderTopWidth: 1, borderTopColor: Palette.border },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.s },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  emptyCard: { padding: Spacing.xl, backgroundColor: Palette.white, opacity: 0.8 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Palette.surface, padding: Spacing.xl },
  retryBtn: { marginTop: Spacing.l, padding: Spacing.m, borderRadius: Radius.m, borderWidth: 1, borderColor: Palette.border },
});
