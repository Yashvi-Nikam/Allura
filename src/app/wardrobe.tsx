import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import WardrobeItem from '@/components/WardrobeItem';
import { useWardrobe } from '@/hooks/useWardrobe';
import LoadingState from '@/components/LoadingState';
import { useTheme } from '@/context/ThemeContext';

const FILTERS = [
  'All',
  'Tops',
  'Bottoms',
  'Dresses',
  'Shoes',
  'Bags',
  'Accessories',
];

export default function Wardrobe() {
  const router = useRouter();
  const { colors } = useTheme();

  const {
    items,
    loading,
    fetchWardrobe,
  } = useWardrobe();

  const [filter, setFilter] = useState('All');

  useFocusEffect(
    useCallback(() => {
      fetchWardrobe();
    }, [])
  );

  const filtered =
    filter === 'All'
      ? items
      : items.filter(item => {
          const category =
            item.category?.toLowerCase() || '';

          const normalizedFilter =
            filter.toLowerCase();

          const aliases: Record<string, string[]> = {
            tops: ['top'],
            bottoms: ['bottom'],
            dresses: ['dress'],
            shoes: ['shoe', 'footwear'],
            bags: ['bag'],
            accessories: [
              'accessory',
              'accessories',
            ],
          };

          const possibleCategories =
            aliases[normalizedFilter] || [
              normalizedFilter,
            ];

          return possibleCategories.some(
            value =>
              category === value ||
              category.includes(value)
          );
        });

  if (loading && items.length === 0) {
    return (
      <LoadingState message="Loading your wardrobe..." />
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
        >
          <Text
            style={[
              styles.back,
              { color: colors.gold },
            ]}
          >
            ←
          </Text>
        </TouchableOpacity>

        <Text
          style={[
            styles.title,
            { color: colors.text },
          ]}
        >
          My Wardrobe
        </Text>

        <TouchableOpacity
          onPress={() =>
            router.push('/wardrobe-add')
          }
        >
          <Text
            style={[
              styles.addBtn,
              { color: colors.gold },
            ]}
          >
            + Add
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filter chips */}
      <FlatList
        data={FILTERS}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item}
        contentContainerStyle={styles.filterRow}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.filterChip,
              {
                borderColor: colors.border,
              },
              filter === item && {
                backgroundColor:
                  colors.surfaceElevated,
                borderColor: colors.gold,
              },
            ]}
            onPress={() => setFilter(item)}
          >
            <Text
              style={[
                styles.filterText,
                {
                  color:
                    filter === item
                      ? colors.gold
                      : colors.textMuted,
                },
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Wardrobe grid */}
      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <Text
            style={[
              styles.emptyText,
              { color: colors.textMuted },
            ]}
          >
            {items.length === 0
              ? 'No items yet.\nAdd your first piece!'
              : 'No items in this category.'}
          </Text>

          <TouchableOpacity
            style={[
              styles.emptyBtn,
              { borderColor: colors.border },
            ]}
            onPress={() =>
              router.push('/wardrobe-add')
            }
          >
            <Text
              style={[
                styles.emptyBtnText,
                { color: colors.gold },
              ]}
            >
              Add item ✦
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filtered}
          numColumns={2}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <WardrobeItem
              item={item}
              onPress={() => {}}
            />
          )}
        />
      )}

      {/* Add button */}
      <TouchableOpacity
        style={[
          styles.fab,
          { backgroundColor: colors.gold },
        ]}
        onPress={() =>
          router.push('/wardrobe-add')
        }
      >
        <Text
          style={[
            styles.fabText,
            { color: colors.background },
          ]}
        >
          + Add item
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingBottom: 16,
  },

  back: {
    fontSize: 22,
  },

  title: {
    fontFamily: 'CormorantGaramond_Reg',
    fontSize: 22,
  },

  addBtn: {
    fontFamily: 'Raleway',
    fontSize: 12,
    letterSpacing: 1,
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
    marginRight: 8,
  },

  filterText: {
    fontFamily: 'Jost',
    fontSize: 12,
  },

  grid: {
    padding: 24,
    paddingTop: 0,
    paddingBottom: 100,
  },

  row: {
    justifyContent: 'space-between',
  },

  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingBottom: 60,
  },

  emptyText: {
    fontFamily: 'Jost',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },

  emptyBtn: {
    borderWidth: 0.5,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 2,
  },

  emptyBtnText: {
    fontFamily: 'Raleway',
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },

  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 2,
  },

  fabText: {
    fontFamily: 'Raleway',
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});