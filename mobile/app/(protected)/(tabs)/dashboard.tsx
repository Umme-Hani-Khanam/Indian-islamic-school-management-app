import { View, StyleSheet, Button } from 'react-native';
import { useAuth } from '@/context/auth';
import TeacherDashboard from '@/components/TeacherDashboard';
import HeadmasterDashboard from '@/components/HeadmasterDashboard';
import ParentDashboard from '@/components/ParentDashboard';

export default function DashboardScreen() {
  const { user, signOut } = useAuth();

  if (user?.role === 'TEACHER') return (
    <View style={s.wrap}>
      <TeacherDashboard />
    </View>
  );

  if (user?.role === 'HEADMASTER') return (
    <View style={s.wrap}>
      <HeadmasterDashboard />
    </View>
  );

  if (user?.role === 'PARENT') return (
    <View style={s.wrap}>
      <ParentDashboard />
    </View>
  );

  return <View style={s.wrap} />;
}

const s = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: '#f5f5f5' },
});
