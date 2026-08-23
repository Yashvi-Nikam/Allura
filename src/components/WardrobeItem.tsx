import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
  item: {
    id: string;
    subcategory: string;
    color: string;
    style: string;
    image_url?: string;
  };
  onPress?: () => void;
}

export default function WardrobeItem({ item, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.imageBox}>
        {item.image_url ? (
          <Image source={{ uri: item.image_url }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>✦</Text>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{item.subcategory}</Text>
        <Text style={styles.detail}>{item.color} · {item.style}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '48%',
    backgroundColor: '#1E1A2E',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(201,171,133,0.12)',
    marginBottom: 12,
  },
  imageBox: {
    width: '100%',
    height: 140,
    backgroundColor: '#2A2438',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 24,
    color: 'rgba(201,171,133,0.3)',
  },
  info: {
    padding: 10,
  },
  name: {
    fontFamily: 'Jost_Regular',
    fontSize: 13,
    color: '#F0ECE4',
    marginBottom: 2,
  },
  detail: {
    fontFamily: 'Jost',
    fontSize: 11,
    color: '#5A5650',
    textTransform: 'capitalize',
  },
});