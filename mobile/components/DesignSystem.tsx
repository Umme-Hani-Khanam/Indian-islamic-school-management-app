import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Animated, 
  ViewStyle, 
  TextStyle, 
  Pressable,
  Easing
} from 'react-native';
import { Palette, Spacing, Radius, Typography, Shadows } from '@/constants/Theme';
import { Ionicons } from '@expo/vector-icons';

// --- Typography Components ---

export const H1 = ({ children, style }: { children: React.ReactNode; style?: TextStyle }) => (
  <Text style={[Typography.h1, style]}>{children}</Text>
);

export const H2 = ({ children, style }: { children: React.ReactNode; style?: TextStyle }) => (
  <Text style={[Typography.h2, style]}>{children}</Text>
);

export const Title = ({ children, style }: { children: React.ReactNode; style?: TextStyle }) => (
  <Text style={[Typography.title, style]}>{children}</Text>
);

export const Body = ({ children, style }: { children: React.ReactNode; style?: TextStyle }) => (
  <Text style={[Typography.body, style]}>{children}</Text>
);

export const Label = ({ children, style }: { children: React.ReactNode; style?: TextStyle }) => (
  <Text style={[Typography.label, style]}>{children}</Text>
);

// --- Layout & Surface Components ---

export const Surface = ({ children, style, alt }: { children: React.ReactNode; style?: ViewStyle; alt?: boolean }) => (
  <View style={[s.surface, alt && { backgroundColor: Palette.surfaceAlt }, style]}>
    {children}
  </View>
);

export const Card = ({ children, style, pressable, onPress, variant = 'default' }: { children: React.ReactNode; style?: ViewStyle; pressable?: boolean; onPress?: () => void; variant?: 'default' | 'premium' | 'flat' }) => {
  const cardStyle = [
    s.card, 
    variant === 'premium' && s.cardPremium,
    variant === 'flat' && s.cardFlat,
    style
  ];

  if (pressable && onPress) {
    return (
      <Pressable onPress={onPress}>
        {({ pressed }) => (
          <Animated.View style={[cardStyle, { transform: [{ scale: pressed ? 0.98 : 1 }], opacity: pressed ? 0.9 : 1 }]}>
            {children}
          </Animated.View>
        )}
      </Pressable>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

// --- Interactive Components ---

export const PrimaryButton = ({ title, onPress, loading, icon, style }: { title: string; onPress: () => void; loading?: boolean; icon?: React.ReactNode; style?: ViewStyle }) => (
  <TouchableOpacity 
    style={[s.btn, style]} 
    onPress={onPress} 
    activeOpacity={0.85}
    disabled={loading}
  >
    <View style={s.btnContent}>
      {icon}
      <Text style={s.btnText}>{loading ? 'Processing...' : title}</Text>
    </View>
  </TouchableOpacity>
);

export const SecondaryButton = ({ title, onPress, style }: { title: string; onPress: () => void; style?: ViewStyle }) => (
  <TouchableOpacity 
    style={[s.btnSecondary, style]} 
    onPress={onPress} 
    activeOpacity={0.7}
  >
    <Text style={s.btnSecondaryText}>{title}</Text>
  </TouchableOpacity>
);

export const Badge = ({ label, type = 'info' }: { label: string; type?: 'success' | 'warning' | 'danger' | 'info' }) => {
  const color = Palette[type];
  return (
    <View style={[s.badge, { backgroundColor: color + '10', borderColor: color + '25' }]}>
      <Text style={[s.badgeText, { color }]}>{label.toUpperCase()}</Text>
    </View>
  );
};

// --- Analytical Components ---

export const MetricCard = ({ label, value, trend, trendValue, icon, loading }: { label: string; value: string; trend?: 'up' | 'down'; trendValue?: string; icon?: React.ReactNode; loading?: boolean }) => (
  <Card style={s.metricCard}>
    <View style={s.metricHeader}>
      <Label style={{ color: Palette.muted }}>{label}</Label>
      {icon}
    </View>
    {loading ? (
      <Skeleton width="60%" height={24} style={{ marginVertical: Spacing.xs }} />
    ) : (
      <H2 style={{ color: Palette.primary, marginVertical: Spacing.xs }}>{value}</H2>
    )}
    {!loading && trend && (
      <View style={s.trendRow}>
        <Text style={[s.trendText, { color: trend === 'up' ? Palette.success : Palette.danger }]}>
          {trend === 'up' ? '↗' : '↘'} {trendValue}
        </Text>
      </View>
    )}
    {loading && <Skeleton width="40%" height={12} />}
  </Card>
);

// --- Feedback & Loading Components ---

export const Shimmer = ({ style }: { style?: ViewStyle }) => {
  const opacity = React.useRef(new Animated.Value(0.3)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    ).start();
  }, []);

  return <Animated.View style={[s.shimmer, { opacity }, style]} />;
};

export const Skeleton = ({ width, height, radius = Radius.s, style }: { width?: any; height?: any; radius?: number; style?: ViewStyle }) => (
  <Shimmer style={[{ width, height, borderRadius: radius }, style]} />
);

export const SkeletonCard = ({ style }: { style?: ViewStyle }) => (
  <Card style={[s.skeletonCard, style]}>
    <Skeleton width="60%" height={24} style={{ marginBottom: Spacing.m }} />
    <Skeleton width="40%" height={16} />
  </Card>
);

export const EmptyState = ({ title, message, icon }: { title: string; message: string; icon?: string }) => (
  <View style={s.centerBlock}>
    <H2 style={s.centerTitle}>{title}</H2>
    <Body style={s.centerMsg}>{message}</Body>
  </View>
);

export const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <View style={s.centerBlock}>
    <Ionicons name="alert-circle-outline" size={48} color={Palette.danger} />
    <H2 style={[s.centerTitle, { color: Palette.danger, marginTop: Spacing.m }]}>Sync Interrupted</H2>
    <Body style={s.centerMsg}>{message || 'An unexpected error occurred.'}</Body>
    <SecondaryButton title="Retry Sync" onPress={onRetry} style={{ marginTop: Spacing.l }} />
  </View>
);

export const LoadingState = ({ message = 'Synchronizing...' }: { message?: string }) => (
  <Surface style={s.centerBlock}>
    <Skeleton width={120} height={120} radius={Radius.xl} style={{ marginBottom: Spacing.xl }} />
    <Title style={s.centerTitle}>Refining Institutional Pulse</Title>
    <Body style={s.centerMsg}>{message}</Body>
  </Surface>
);

const s = StyleSheet.create({
  surface: { flex: 1, backgroundColor: Palette.surface },
  card: {
    backgroundColor: Palette.white,
    borderRadius: Radius.l,
    padding: Spacing.l,
    borderWidth: 1,
    borderColor: Palette.border,
    ...Shadows.soft,
  },
  cardPremium: {
    backgroundColor: Palette.cream,
    borderColor: Palette.sand,
    ...Shadows.premium,
  },
  cardFlat: {
    backgroundColor: Palette.surfaceAlt,
    borderWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  btn: {
    backgroundColor: Palette.primary,
    borderRadius: Radius.full,
    paddingVertical: Spacing.m,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.medium,
  },
  btnSecondary: {
    backgroundColor: Palette.white,
    borderRadius: Radius.full,
    paddingVertical: Spacing.m,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Palette.border,
  },
  btnContent: { flexDirection: 'row', alignItems: 'center', gap: Spacing.s },
  btnText: { color: Palette.white, fontWeight: '700', fontSize: 16, letterSpacing: 0.3 },
  btnSecondaryText: { color: Palette.text, fontWeight: '700', fontSize: 16 },
  badge: {
    paddingHorizontal: Spacing.s,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.s,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  badgeText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.8 },
  shimmer: { backgroundColor: Palette.border },
  skeletonCard: { marginBottom: Spacing.m, padding: Spacing.l },
  centerBlock: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  centerTitle: { textAlign: 'center', marginBottom: Spacing.s },
  centerMsg: { textAlign: 'center', color: Palette.muted },
  metricCard: { flex: 1, minWidth: 100, padding: Spacing.m },
  metricHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  trendRow: { marginTop: Spacing.xs },
  trendText: { fontSize: 12, fontWeight: '700' },
});
