import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { api } from '@/utils/api';
import { useRouter } from 'expo-router';

interface ClassData {
  id: string;
  name: string;
  section: string;
}

export default function ClassListScreen() {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await api.get('/school/classes');
        setClasses(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load classes.');
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (classes.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No classes to show.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={classes}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <TouchableOpacity 
          style={styles.card}
          onPress={() => router.push(`/(protected)/(tabs)/classes/${item.id}/students`)}
        >
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardSubtitle}>Section: {item.section}</Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderColor: '#eee',
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  errorText: {
    color: '#dc3545',
    fontSize: 16,
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
  }
});
