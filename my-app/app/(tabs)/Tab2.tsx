import { View, Text, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';

export default function Tab2() {
  const paddingTop = Platform.OS === 'android' ? StatusBar.currentHeight : 0; 
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, { paddingTop }]}> 
        <Text style={styles.whiteText}>TAB 2</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1, 
    paddingHorizontal: 20, 
  },
  whiteText: {
    color: 'white',
  },
});