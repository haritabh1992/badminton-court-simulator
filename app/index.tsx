import BadmintonCourt from '../components/BadmintonCourt';
import { View, StyleSheet } from 'react-native';

export default function Index() {
  return (
    <View style={styles.container}>
      <BadmintonCourt />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});