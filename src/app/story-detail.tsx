import { StyleSheet, Text, View } from 'react-native';

export default function StoryDetailScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Hier kommt später die gespeicherte Geschichte hin.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  text: { fontSize: 16, textAlign: 'center' },
});