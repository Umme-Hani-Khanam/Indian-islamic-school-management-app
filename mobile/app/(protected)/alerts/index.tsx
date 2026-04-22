import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, RefreshControl, TextInput } from 'react-native';
import { api } from '@/utils/api';
import { Stack, useRouter } from 'expo-router';
import { Palette, Spacing, Radius, Shadows } from '@/constants/Theme';
import { Card, H1, H2, Title, Body, Label, Badge, Shimmer } from '@/components/DesignSystem';
import { Ionicons } from '@expo/vector-icons';

export default function AlertsListScreen() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const router = useRouter();

  const fetchData = useCallback(async () => {
    try {
      const r = await api.get('/alerts');
      setAlerts(r.data);
      setError(null);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to load alerts');
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

  const filteredAlerts = alerts.filter(a => {
    const matchStatus = statusFilter === 'ALL' || a.status === statusFilter;
    const matchPriority = priorityFilter === 'ALL' || a.priority === priorityFilter;
    const matchSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          a.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchPriority && matchSearch;
  });

  if (loading && !alerts.length) return <View style={s.centered}><ActivityIndicator color={Palette.primary} /></View>;

  return (
    <View style={s.main}>
      <Stack.Screen options={{ 
        title: 'Safety Board',
        headerStyle: { backgroundColor: Palette.surface },
        headerShadowVisible: false
      }} />
      
      {/* Filters Section */}
      <View style={s.filterHeader}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filterScroll}>
          <FilterChip label="All Status" active={statusFilter === 'ALL'} onPress={() => setStatusFilter('ALL')} />
          <FilterChip label="Open" active={statusFilter === 'OPEN'} onPress={() => setStatusFilter('OPEN')} />
          <FilterChip label="Resolved" active={statusFilter === 'RESOLVED'} onPress={() => setStatusFilter('RESOLVED')} />
        </ScrollView>
        <TextInput 
          style={s.searchBar} 
          placeholder="Search safety records..." 
          placeholderTextColor={Palette.muted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView 
        contentContainerStyle={s.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Palette.primary} />}
      >
        {filteredAlerts.length > 0 ? filteredAlerts.map(alert => (
          <AlertItem key={alert.id} alert={alert} onPress={() => (router as any).push(`/(protected)/alerts/${alert.id}`)} />
        )) : (
          <View style={{ padding: Spacing.xl, alignItems: 'center' }}>
            <Ionicons name="search-outline" size={48} color={Palette.border} />
            <Body style={{ marginTop: Spacing.m, color: Palette.muted }}>No safety records found.</Body>
          </View>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB for creation */}
      <TouchableOpacity style={s.fab} onPress={() => (router as any).push('/(protected)/alerts/create')}>
        <Ionicons name="add" size={32} color={Palette.white} />
      </TouchableOpacity>
    </View>
  );
}

function FilterChip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity 
      style={[s.chip, active && s.chipActive]} 
      onPress={onPress}
    >
      <Label style={[s.chipText, active && s.chipTextActive]}>{label}</Label>
    </TouchableOpacity>
  );
}

function AlertItem({ alert, onPress }: { alert: any; onPress: () => void }) {
  const pColor = alert.priority === 'CRITICAL' ? Palette.danger : alert.priority === 'HIGH' ? Palette.warning : Palette.success;
  return (
    <Card pressable onPress={onPress} style={s.item}>
      <View style={s.itemMain}>
        <View style={s.itemHead}>
          <View style={s.tagRow}>
            <Badge label={alert.priority} type={alert.priority === 'CRITICAL' ? 'danger' : 'warning'} />
            <Label style={s.itemDate}>{new Date(alert.createdAt).toLocaleDateString()}</Label>
          </View>
          <Text style={s.idText}>#{alert.id}</Text>
        </View>
        <Title style={s.itemTitle}>{alert.title}</Title>
        <Body style={s.itemDesc} numberOfLines={1}>{alert.description}</Body>
        <View style={s.itemFooter}>
          <View style={s.statusRow}>
            <View style={[s.dot, { backgroundColor: alert.status === 'OPEN' ? Palette.danger : Palette.success }]} />
            <Label style={{ color: alert.status === 'OPEN' ? Palette.danger : Palette.success }}>{alert.status}</Label>
          </View>
          <Ionicons name="chevron-forward" size={16} color={Palette.border} />
        </View>
      </View>
    </Card>
  );
}

const s = StyleSheet.create({
  main: { flex: 1, backgroundColor: Palette.surface },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Palette.surface },
  filterHeader: { padding: Spacing.m, backgroundColor: Palette.surface, borderBottomWidth: 1, borderBottomColor: Palette.border, gap: Spacing.s },
  filterScroll: { gap: Spacing.s, paddingBottom: Spacing.xs },
  chip: { paddingHorizontal: Spacing.m, paddingVertical: Spacing.s, borderRadius: Radius.xl, backgroundColor: Palette.white, borderWidth: 1, borderColor: Palette.border },
  chipActive: { backgroundColor: Palette.primary, borderColor: Palette.primary },
  chipText: { color: Palette.muted },
  chipTextActive: { color: Palette.white },
  searchBar: { backgroundColor: Palette.surfaceAlt, paddingHorizontal: Spacing.m, paddingVertical: Spacing.s, borderRadius: Radius.m, fontSize: 14, borderWidth: 1, borderColor: Palette.border, color: Palette.text },
  container: { padding: Spacing.m },
  item: { marginBottom: Spacing.m, padding: Spacing.m },
  itemMain: { flex: 1 },
  itemHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.s },
  tagRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.s },
  itemTitle: { marginBottom: Spacing.xs },
  itemDate: { fontSize: 10 },
  itemDesc: { color: Palette.muted, marginBottom: Spacing.m },
  itemFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: Spacing.s, borderTopWidth: 1, borderTopColor: Palette.surfaceAlt },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.s },
  dot: { width: 6, height: 6, borderRadius: 3 },
  idText: { fontSize: 10, color: Palette.border, fontWeight: '700' },
  fab: { position: 'absolute', bottom: 32, right: 32, width: 64, height: 64, borderRadius: 32, backgroundColor: Palette.primary, justifyContent: 'center', alignItems: 'center', ...Shadows.medium },
});
