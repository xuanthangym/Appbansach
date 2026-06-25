import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TouchableHighlight,
  Alert,
  //   TouchableOpacity,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import styles from './styles';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/Ionicons';
import { uuidv4 } from "@firebase/util";
import { auth, db } from '../../../firebaseConfig';
import { collection, getDocs,deleteDoc ,updateDoc,doc } from 'firebase/firestore';

import DataProduct from '../../Data/DataProduct';
import {convertToNumberCommas} from '../../utilities';

const {width, height} = Dimensions.get('window');

const DataProducts = DataProduct;

const ShoppingCart = ({navigation}) => {
  const [numberProduct, setNumberProduct] = useState(1);
  const [dataShopping, setDataShopping] = useState([]);
  const [dataItemAll, setDataItemAll] = useState([]);
  const [count, setCount] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  
  useEffect(() => {
    const users = auth.currentUser;
    const getShoppingByUser = async () => {
      try {
        const shoppingCart = await getDocs(collection(db, 'ShoppingCart'));
        let box = shoppingCart.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        let shoppingbyUser = box.filter(element => element.email === users?.email);

        for (let i = 0; i < shoppingbyUser.length; i++) {
          for (let y = 0; y < DataProducts.length; y++) {
            if (shoppingbyUser[i].idProduct === DataProducts[y].menuId) {
              let avatarImage = DataProducts[y].avatarImage;
              shoppingbyUser[i] = { ...shoppingbyUser[i], avatarImage };
            }
          }
        }

        setDataShopping(shoppingbyUser);
        converTotalPrice(shoppingbyUser);
      } catch (error) {
        console.log('error_error', error);
      }
    };
    getShoppingByUser();
  }, []);


  const handledel = async (item, index) => {
    let newDataShopping = [];
    for (let i = 0; i < dataShopping.length; i++) {
      if (item.idProduct !== dataShopping[i].menuId || i !== index) {
        newDataShopping.push(dataShopping[i]);
      }
    }
    try {
      // Update local state
      setDataShopping(newDataShopping);
      converTotalPrice(newDataShopping);
      // Delete from Firestore
      await deleteDoc(doc(db, 'ShoppingCart', item.id));
      
      for (let i = 0; i < dataShopping.length; i++) {
        if (item.idProduct !== dataShopping[i].menuId || i !== index) {
          newDataShopping.push(dataShopping[i]);
        }
      }
      setDataShopping(newDataShopping);
      
    } catch (error) {
      console.error("Error deleting item: ", error);
    }
  };



  const handleDetail = (id, count) => {
    // console.log(dataItemAll);
    if (DataProducts.length != 0) {
      for (let i = 0; i < DataProducts.length; i++) {
        if (DataProducts[i].menuId == id) {
          navigation.navigate('Detail', {
            count: count,
            dataItem: DataProducts[i],
          });
        }
      }
    }
  };

  
const onHandleShopping = async (value, item, index) => {
  
  if (item.amount > 0 || value === 1) {
    let updatedData = [...dataShopping]; // Clone the dataShopping array
    let updatedAmount = 0;

    for (let i = 0; i < updatedData.length; i++) {
      if (updatedData[i].menuId === item.menuId && i === index) {
        updatedData[i].amount += value;
        updatedAmount = updatedData[i].amount;
      }
    }

    setDataShopping(updatedData);

    try {
      const itemDocRef = doc(db, 'ShoppingCart', item.id);
      await updateDoc(itemDocRef, { amount: updatedAmount });
      setCount(count + value);
      converTotalPrice(updatedData);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  }
};

  const converTotalPrice = totalArr => {
    let CountTotal = 0;
    for (let i = 0; i < totalArr.length; i++) {
      CountTotal = CountTotal + totalArr[i].amount * totalArr[i].priceProduct;
    }
    setTotalPrice(CountTotal);
  };
 
  
  const handlePay = async () => {
    for (let i = 0; i < dataShopping.length; i++) {
      const itemRef = doc(db, 'ShoppingCart', dataShopping[i].id);
      await deleteDoc(itemRef);
    }
  
    Alert.alert('Thông báo', 'Thanh toán thành công', [
      { text: 'OK', onPress: () => console.log('OK Pressed') },
    ]);
  
    setDataShopping([]);
    setTotalPrice(0);
    // navigation.navigate('Order');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View
        style={{
          height: 50,
          // width: width,
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          backgroundColor: '#00a46c',
          alignItems: 'center',
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon1 name="arrow-back" size={30} color="white" />
        </TouchableOpacity>
        <Text style={{fontSize: 20, color: 'white'}}>Giỏ Hàng</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          style={styles.TopPlus}>
          <Icon name="plus" size={20} color="white" />
        </TouchableOpacity>
      </View>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        {dataShopping.map((item, index) => {
          return (
            <View
              key={index}
              style={{
                marginTop: 16,
                height: 120,
                marginHorizontal: 6,
                backgroundColor: 'white',
                borderRadius: 20,
                flexDirection: 'row',
              }}>
              <View
                style={{
                  position: 'absolute',
                  right: -5,
                  top: -10,
                }}>
                <TouchableOpacity
                  hitSlop={{top: 10, left: 10, right: 10, bottom: 10}}
                  onPress={() => {
                    handledel(item, index);
                  }}
                  style={{
                    height: 27,
                    width: 27,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Icon name="closecircle" size={27} color="gray" />
                </TouchableOpacity>
              </View>
              <Image
                source={item.avatarImage}
                style={{
                  height: 120,
                  width: 120,
                  borderBottomLeftRadius: 20,
                  borderTopLeftRadius: 20,
                }}
              />
              <View
                style={{
                  marginHorizontal: 12,
                  width: width - 100 - 32,
                  paddingVertical: 6,
                }}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 16,
                    color: 'green',
                    fontWeight: '500',
                    lineHeight: 24,
                  }}>
                  {' '}
                  {item.nameProduct}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 16,
                    color: 'black',
                    fontWeight: '500',
                    lineHeight: 24,
                  }}>
                  {' '}
                  Giá tiền: {convertToNumberCommas(item.priceProduct)} Đ
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 16,
                    color: 'black',
                    fontWeight: '500',
                    lineHeight: 24,
                  }}>
                  {' '}
                  Tổng tiền :{' '}
                  {convertToNumberCommas(
                    Number(item.amount) * Number(item.priceProduct),
                  )}{' '}
                  Đ
                </Text>
                <View
                  style={{
                    height: 36,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginHorizontal: 10,
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      handleDetail(item.idProduct, item.amount);
                    }}>
                    <Text
                      style={{
                        color: '#00a46c',
                        // fontWeight: 'bold',
                        fontSize: 14,
                        // textDecorationLine: 0.2,
                      }}>
                      Xem chi tiêt
                    </Text>
                  </TouchableOpacity>
                  <View style={styles.ViewNumProduct}>
                    <TouchableOpacity
                      onPress={() => onHandleShopping(-1, item, index)}
                      style={styles.ButtomPlus}>
                      <Icon name="minus" size={20} color="gray" />
                    </TouchableOpacity>
                    <Text
                      style={{
                        color: '#62636a',
                        fontWeight: 'bold',
                        fontSize: 20,
                      }}>
                      {item.amount}
                    </Text>
                    <TouchableOpacity
                      onPress={() => onHandleShopping(1, item, index)}
                      style={styles.ButtomPlus}>
                      <Icon name="plus" size={20} color="gray" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          );
        })}
        {totalPrice ? (
          <View
            style={{
              height: 50,
              // width: width,
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
              borderRadius: 12,
              backgroundColor: '#00a46c',
              margin: 12,
            }}>
            <Text style={{fontSize: 18, color: 'white'}}>Tổng tiền: </Text>
            <Text style={{fontSize: 18, color: 'white'}}>
              {convertToNumberCommas(totalPrice)} Đ
            </Text>
          </View>
        ) : null}
      </ScrollView>
      <View style={styles.ViewBottomContainer}>
        <TouchableOpacity
          onPress={() => {
            handlePay();
          }}
          style={styles.ViewButtom}>
          <Text
            style={{
              color: '#FFF',
              fontSize: 18,
            }}>
            Thanh Toán
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
export default ShoppingCart;
