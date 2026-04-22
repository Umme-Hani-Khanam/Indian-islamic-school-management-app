import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fetchClasses } from '../services/api';

export default function ClassListScreen({ route, navigation }: any) {
  const { user, token } = route.params;
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string>('');

  const loadClasses = async () => {
    if (user.role === 'PARENT') {
      return;
    }

    setLoading(true);
    setError('');
    try {
      const data = await fetchClasses(token);
      setClasses(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Unable to load classes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClasses();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadClasses();
    setRefreshing(false);
  };

  const renderClass = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Students', { classId: item.id, className: `${item.name} ${item.section}`, user, token })}
    >
      <Text style={styles.cardTitle}>{item.name}</Text>
      <Text style={styles.cardMeta}>Section {item.section}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Class dashboard</Text>
      <Text style={styles.subheader}>Welcome back, {user.name}</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 24 }} />
      ) : user.role === 'PARENT' ? (
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('StudentProfile', { studentId: user.studentId, token })}
        >
          <Text style={styles.cardTitle}>My child</Text>
          <Text style={styles.cardMeta}>Go to student profile</Text>
        </TouchableOpacity>
      ) : error ? (
        <View style={{ alignItems: 'center', marginTop: 24 }}>
          <Text style={styles.error}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadClasses}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={classes}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={{ paddingBottom: 32 }}
          renderItem={renderClass}
          ListEmptyComponent={<Text style={styles.empty}>No classes available</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eef2ff', padding: 20 },
  header: { fontSize: 28, fontWeight: '800', color: '#111827', marginTop: 12 },
  subheader: { color: '#374151', marginTop: 8, marginBottom: 20 },
  card: { backgroundColor: '#fff', borderRadius: 18, padding: 18, marginBottom: 14, shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 14, elevation: 3 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  cardMeta: { color: '#475569', marginTop: 8 },
  error: { color: '#b91c1c', marginTop: 24, textAlign: 'center' },
  empty: { color: '#475569', textAlign: 'center', marginTop: 24 },
});
