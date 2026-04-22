import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { api } from '@/utils/api';
import { useRouter } from 'expo-router';
import { Palette, Spacing } from '@/constants/Theme';
import { 
  Surface, Card, Title, Body, Label, 
  SkeletonCard, EmptyState, ErrorState 
} from '@/components/DesignSystem';
import { Ionicons } from '@expo/vector-icons';

interface ClassData {
  id: string;
  name: string;
  section: string;
}

export default function ClassListScreen() {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchClasses = useCallback(async () => {
    try {
      const response = await api.get('/school/classes');
      setClasses(Array.isArray(response.data) ? response.data : []);
      setError(null);
    } catch (err: any) {
      if (__DEV__) console.log('[DEV] Class Fetch Error:', err.message, err.response?.data);
      setError(err.response?.data?.message || 'We encountered an error while retrieving the class records.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setClasses([]);
    fetchClasses();
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchClasses();
  };

  if (loading && classes.length === 0) {
    return (
      <Surface style={styles.container}>
        <View style={styles.header}>
            <Title>Academic Classes</Title>
            <Label style={{ color: Palette.muted }}>Listing all active sections</Label>
        </View>
        <View style={{ padding: Spacing.l }}>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      </Surface>
    );
  }

  if (error) {
    return (
      <Surface style={styles.container}>
        <ErrorState message={error} onRetry={handleRetry} />
      </Surface>
    );
  }

  const safeClasses = Array.isArray(classes) ? classes : [];

  return (
    <Surface style={styles.container}>
      <FlatList
        data={safeClasses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.header}>
            <Title>Academic Classes</Title>
            <Label style={{ color: Palette.muted }}>Listing all active sections</Label>
          </View>
        }
        ListEmptyComponent={
          <EmptyState 
            title="No Classes Found" 
            message="There are currently no active sections or categories recorded in the system." 
          />
        }
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor={Palette.primary} 
          />
        }
        renderItem={({ item }) => (
          <Card 
            style={styles.card}
            pressable
            onPress={() => router.push(`/(protected)/(tabs)/classes/${item.id}/student`)}
          >
            <View style={styles.cardRow}>
                <View style={styles.iconBox}>
                    <Ionicons name="school" size={24} color={Palette.primary} />
                </View>
                <View style={{ flex: 1 }}>
                    <Title style={styles.cardTitle}>{item.name}</Title>
                    <Body style={styles.cardSubtitle}>Section {item.section}</Body>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Palette.border} />
            </View>
          </Card>
        )}
      />
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: Spacing.l, paddingTop: Spacing.xl },
  list: { paddingBottom: Spacing.xl },
  card: { marginHorizontal: Spacing.l, marginBottom: Spacing.m },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.m },
  iconBox: { width: 48, height: 48, borderRadius: 12, backgroundColor: Palette.primary + '10', justifyContent: 'center', alignItems: 'center' },
  cardTitle: { fontSize: 18, color: Palette.text },
  cardSubtitle: { fontSize: 13, color: Palette.muted, marginTop: 2 },
});
