import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
} from 'react-native';
import {COLORS, icons} from '../../constants';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const DocumentBuilderScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          navigation.goBack();
        }}>
        <Image source={icons.back} style={[styles.backIcon]} />
      </TouchableOpacity>
      <Text style={styles.headerText}>Document Builder</Text>
    </View>
  );

  const renderFooter = () => (
    <View style={[styles.footer, {bottom: insets.bottom}]}>
      <Text style={styles.footerText}>Powered by Indeed</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {renderHeader()}

      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 2,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 20,
        }}>
        <Image source={icons.robot} style={[styles.botIcon]} />
        <View style={styles.chatView}>
          <Text style={styles.botText}>
            Let's get your documents ready for your job!
          </Text>
        </View>
      </View>
      <View style={[styles.introView]}>
        <Text
          style={[
            styles.introText,
            {display: 'flex', flexDirection: 'row', gap: 5},
          ]}>
          Create your documents for pottential job oportunities with our
          document builder and get your dream job
        </Text>
      </View>

      <View style={{flex: 1, paddingHorizontal: 15}}>
        <TouchableOpacity style={styles.documentItem}>
          <View style={{flexDirection: 'row', gap: 1}}>
            <Image
              source={icons.resume}
              style={[styles.documentIcon, {tintColor: COLORS.green}]}
            />
            <Text style={styles.documentText}>Resume</Text>
          </View>
          <View style={styles.circle}>
            <Image source={icons.right} style={[styles.rightIcon]} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.documentItem}  onPress={() => navigation.navigate('CoverLetterStepper')}>
          <View style={{flexDirection: 'row', gap: 1}}>
            <Image
              source={icons.profile_built}
              style={[styles.documentIcon, {tintColor: COLORS.red}]}
            />
            <Text style={styles.documentText}>Cover Letter</Text>
          </View>
          <View style={styles.circle}>
            <Image source={icons.right} style={[styles.rightIcon]} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.documentItem}>
          <View style={{flexDirection: 'row', gap: 1}}>
            <Image
              source={icons.person_cv}
              style={[styles.documentIcon, {tintColor: COLORS.yellow}]}
            />
            <Text style={styles.documentText}>CV</Text>
          </View>
          <View style={styles.circle}>
            <Image source={icons.right} style={[styles.rightIcon]} />
          </View>
        </TouchableOpacity>
      </View>
      {renderFooter()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    height: 100,
    backgroundColor: COLORS.black,
    paddingTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  introView: {
    paddingTop: 30,
    marginBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  },
  introText: {
    textAlign: 'center',
    color: COLORS.black,
    fontSize: 17,
  },
  listContainer: {
    padding: 16,
    flexGrow: 1, // Ensures the FlatList takes up remaining space
  },
  documentItem: {
    padding: 30,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    gap: 10,
    marginBottom: 30,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',

    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,

    // Shadow for Android
    elevation: 3,
  },
  documentIcon: {
    width: 40,
    height: 40,
    marginRight: 16,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
  backButton: {
    left: '-25%',
    right: 0,
  },
  documentText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
  circle: {
    height: 40,
    width: 40,
    backgroundColor: COLORS.black,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
  },
  footer: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  footerText: {
    fontSize: 14,
    color: COLORS.black,
  },
  rightIcon: {
    tintColor: 'white',
    height: 20,
    width: 20,
  },
  botIcon: {
    height: 100,
    width: 100,
  },
  chatView: {
    backgroundColor: '#31cf71',
    width: 250,
    padding: 10,
    paddingVertical: 20,
    borderRadius: 10,
  },
  botText: {
    fontSize: 16,
  },
});

export default DocumentBuilderScreen;
