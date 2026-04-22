import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Palette, Radius, Spacing } from '@/constants/Theme';
import { Body, Label } from './DesignSystem';

export function BarChart({ data = [], height = 150 }: { data: { label: string; value: number; color?: string }[]; height?: number }) {
  const safeData = Array.isArray(data) ? data : [];
  if (safeData.length === 0) {
    return (
      <View style={[s.container, { height, justifyContent: 'center', alignItems: 'center' }]}>
        <Body style={{ color: Palette.muted }}>No data for chart projection</Body>
      </View>
    );
  }

  const maxVal = Math.max(...safeData.map(d => d.value), 10);

  return (
    <View style={[s.container, { height }]}>
      <View style={s.chartBody}>
        {safeData.map((item, i) => (
          <View key={i} style={s.barContainer}>
            <View style={s.barTrack}>
               <View 
                 style={[
                   s.barFill, 
                   { height: `${(item.value / maxVal) * 100}%`, backgroundColor: item.color || Palette.primary }
                 ]} 
               />
            </View>
            <Text style={s.barLabel} numberOfLines={1}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export function TrendLine({ data = [], height = 100 }: { data: { label: string; value: number }[]; height?: number }) {
  const safeData = Array.isArray(data) ? data : [];
  if (safeData.length === 0) {
    return (
      <View style={[s.container, { height, justifyContent: 'center', alignItems: 'center' }]}>
        <Body style={{ color: Palette.muted }}>No trends recorded yet</Body>
      </View>
    );
  }

  const maxVal = Math.max(...safeData.map(d => d.value), 10);

  return (
    <View style={[s.container, { height }]}>
      <View style={s.trendBody}>
        {safeData.map((item, i) => (
          <View key={i} style={s.trendPointContainer}>
             <View style={s.trendBar}>
                <View 
                  style={[
                    s.trendFill, 
                    { height: `${(item.value / maxVal) * 100}%` }
                  ]} 
                />
             </View>
             <Text style={s.trendLabel}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { width: '100%', marginVertical: Spacing.s },
  chartBody: { flex: 1, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', paddingBottom: 20 },
  barContainer: { alignItems: 'center', flex: 1, marginHorizontal: 4 },
  barTrack: { height: '100%', width: 20, backgroundColor: Palette.surfaceAlt, borderRadius: Radius.s, justifyContent: 'flex-end', overflow: 'hidden' },
  barFill: { width: '100%', borderRadius: Radius.s },
  barLabel: { fontSize: 10, color: Palette.muted, marginTop: 4, textAlign: 'center' },
  trendBody: { flex: 1, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  trendPointContainer: { flex: 1, alignItems: 'center' },
  trendBar: { width: 4, height: '100%', backgroundColor: Palette.surfaceAlt, borderRadius: Radius.s, justifyContent: 'flex-end' },
  trendFill: { width: '100%', backgroundColor: Palette.primary, borderRadius: Radius.s },
  trendLabel: { fontSize: 9, color: Palette.muted, marginTop: 4 }
});
