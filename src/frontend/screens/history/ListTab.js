import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions } from 'react-native';
import React from 'react';
import { COLORS, icons, FONTS } from '../../constants';

const { width } = Dimensions.get('window'); // Get device width for responsive layout

const ListTab = () => {
  return (
    <View style={styles.container}>
      {/* Category items: Saved Jobs, Applied Jobs, Chat Activity, Job Previewing, Job Searching */}
      <View style={styles.categories}>
        <View style={styles.itemLine}>
          {/* Item 1 */}
          <View style={styles.item}>
            <Image source={icons.disk} style={[styles.saveIcon, styles.icon]} />
            <Text style={styles.text}>Saved Jobs</Text>
          </View>
          {/* Item 2 */}
          <View style={styles.item}>
            <Image source={icons.bag} style={[styles.appliedIcon, styles.icon]} />
            <Text style={styles.text}>Jobs Applied</Text>
          </View>
        </View>
        <View style={styles.itemLine}>
          {/* Item 3 */}
          <View style={styles.item}>
            <Image source={icons.chats} style={[styles.chatIcon, styles.icon]} />
            <Text style={styles.text}>Chats Activity</Text>
          </View>
          {/* Item 4 */}
          <View style={styles.item}>
            <Image source={icons.find} style={[styles.searchIcon, styles.icon]} />
            <Text style={styles.text}>Jobs Search</Text>
          </View>
        </View>
        <View style={styles.itemLine}>
          {/* Item 5 */}
          <View style={styles.item}>
            <Image source={icons.preview} style={[styles.previewIcon, styles.icon]} />
            <Text style={styles.text}>Jobs Previews</Text>
          </View>
        </View>
      </View>
      <View>
      </View>
    </View>
  );
};

export default ListTab;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingTop: 5,
  },
  itemLine: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  item: {
    backgroundColor: COLORS.white,
    paddingVertical: 20,
    width: width * 0.46, // 45% of screen width
    height: width * 0.2, // Maintain relative height
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4.65,
    elevation: 5,
    flexDirection: 'row',
    gap: 10,
  },
  text: {
    ...FONTS.h4,
    color: COLORS.black,
    fontSize: 14,
    textAlign: 'center',
  },
  icon: {
    height: width * 0.06, // 6% of screen width
    width: width * 0.06, // Maintain aspect ratio
  },
  previewIcon: {
    tintColor: '#FDB643',
  },
  searchIcon: {
    tintColor: '#B65FCF',
  },
  chatIcon: {
    tintColor: '#FC635B',
  },
  saveIcon: {
    tintColor: '#81D3E4',
  },
  appliedIcon: {
    tintColor: '#018154',
  },
});
