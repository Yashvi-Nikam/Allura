import { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, FlatList, SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import WardrobeItem from '@/components/WardrobeItem';
import { useWardrobe } from '@/hooks/useWardrobe';
import LoadingState from '@/components/LoadingState';

const FILTERS = ['All', 'Tops', 'Bottoms', 'Dresses', 'Shoes', 'Bags', 'Accessories'];

export default function Wardrobe() {
  const router = useRouter();
  const { items, loading, fetchWardrobe } = useWardrobe();
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchWardrobe('demo-user-001');
  }, []);

  const filtered = filter === 'All' ? items : items.filter(i =>
    i.category.toLowerCase().includes(filter.toLowerCase().slice(0, -1))
  );

  if (loading) return <LoadingState message="Loading your wardrobe..." />;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>My Wardrobe</Text>
        <TouchableOpacity onPress={() => router.push('/wardrobe-add')}>
          <Text style={styles.addBtn}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Filter chips */}
      <FlatList
        data={FILTERS}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={i => i}
        contentContainerStyle={styles.filterRow}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.filterChip, filter === item && styles.filterChipActive]}
            onPress={() => setFilter(item)}
          >
            <Text style={[styles.filterText, filter === item && styles.filterTextActive]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Wardrobe grid */}
      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No items yet.{'\n'}Add your first piece!</Text>
          <TouchableOpacity
            style={styles.emptyBtn}
            onPress={() => router.push('/wardrobe-add')}
          >
            <Text style={styles.emptyBtnText}>Add item ✦</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filtered}
          numColumns={2}
          keyExtractor={i => i.id}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <WardrobeItem item={item} onPress={() => {}} />
          )}
        />
      )}

      {/* Add button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/wardrobe-add')}
      >
        <Text style={styles.fabText}>+ Add item</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#13111A' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingBottom: 16,
  },
  back: { fontSize: 22, color: '#C9AB85' },
  title: {
    fontFamily: 'CormorantGaramond_Reg',
    fontSize: 22,
    color: '#F0ECE4',
  },
  addBtn: {
    fontFamily: 'Raleway',
    fontSize: 12,
    letterSpacing: 1,
    color: '#C9AB85',
  },
  filterRow: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    gap: 8,
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(201,171,133,0.2)',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: 'rgba(201,171,133,0.15)',
    borderColor: '#C9AB85',
  },
  filterText: {
    fontFamily: 'Jost',
    fontSize: 12,
    color: '#5A5650',
  },
  filterTextActive: { color: '#C9AB85' },
  grid: { padding: 24, paddingTop: 0 },
  row: { justifyContent: 'space-between' },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  emptyText: {
    fontFamily: 'Jost',
    fontSize: 14,
    color: '#5A5650',
    textAlign: 'center',
    lineHeight: 22,
  },
  emptyBtn: {
    borderWidth: 0.5,
    borderColor: 'rgba(201,171,133,0.3)',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 2,
  },
  emptyBtnText: {
    fontFamily: 'Raleway',
    fontSize: 10,
    letterSpacing: 2,
    color: '#C9AB85',
    textTransform: 'uppercase',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#C9AB85',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 2,
  },
  fabText: {
    fontFamily: 'Raleway',
    fontSize: 10,
    letterSpacing: 2,
    color: '#13111A',
    textTransform: 'uppercase',
  },
});