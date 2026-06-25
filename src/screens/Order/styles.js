import {Dimensions, StyleSheet} from 'react-native';
const {width, height} = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#E0F7FA', // Light blue background
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 24,
    color: '#01579B',
    marginLeft: 120,
    marginTop: 20,
  },
  scrollView: {
    marginTop: 16,
    paddingTop: 16,
  },
  ViewBottomContainer: {
    flexDirection: 'row',
    width: width,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    borderTopWidth: 0.25,
    borderColor: 'gray',

  },
  ViewButtom: {
    width: width * 0.9,
    backgroundColor: '#00a46c',
    height: 45,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
  