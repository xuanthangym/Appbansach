import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon1 from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/AntDesign';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../../../firebaseConfig';
import { collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {convertToNumberCommas} from '../../utilities';
import { uuidv4 } from "@firebase/util";


const Detail = ({navigation, route}) => {

  const [numberProduct, setNumberProduct] = useState(
    route?.params?.count ? route?.params?.count : 1,
  );
  const [dataDetail, setDataDetail] = useState(route?.params?.dataItem);
  useEffect(() => {}, []);

  // handle luu du liệu them vào của mặt hàng len firebase
  const onhandleShoppingCart = async () => {
    // Get the current user
    const user = getAuth().currentUser;
    // Prepare the data to be added to the shopping cart
    let data = dataDetail;
    let body = {
      amount: numberProduct,
      idProduct: data.menuId,
      nameProduct: data.nameProducts,
      priceProduct: data.price,
      email: user?.email,
      orderId: uuidv4().replace(/-/g, '').substring(0, 12),
      image:data.avatarImage,
    };
    try {
      await addDoc(collection(db, 'ShoppingCart'), body);
      navigation.navigate('ShoppingCart');
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };


  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.ViewHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon2 name="arrow-back" size={30} color="white" />
        </TouchableOpacity>
        <Text style={{fontSize: 20, color: 'white'}}>Mô tả</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ShoppingCart')}>
          <Icon1 name="shoppingcart" size={30} color="white" />
        </TouchableOpacity>
      </View>

      {/* //View thong tin của từng quyển sách */}
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <ImageBackground
          resizeMode="stretch"
          source={require('../../images/Avatar/individualBookPage.png')}
          style={{width: '100%', height: 280}}
        />
        <View style={{marginTop: -100}}>
          <Image source={dataDetail.avatarImage} style={styles.ImageView} />
          <View style={{alignItems: 'center', marginTop: 20}}>
            <Text style={styles.TxtName}>{dataDetail.nameProducts}</Text>
            <Text style={styles.TxtAuthor}>Tác giả : {dataDetail.author}</Text>
            <Text style={styles.TxtPrice}>
              {convertToNumberCommas(dataDetail.price)} Đ
            </Text>
          </View>
          <View style={{marginVertical: 12}}>
            <Text style={styles.TxtIntroduce}>Mô tả:</Text>
            <Text style={[styles.TxtIntroduce, {color: 'black'}]}>
              {dataDetail.description}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* //View bottom thêm vào giỏ, tăng giảm số lượng */}
      <View style={styles.ViewBottomContainer}>
        <View style={styles.ViewNumProduct}>
          <TouchableOpacity
            onPress={() => {
              if (numberProduct > 0) {
                setNumberProduct(numberProduct - 1);
              }
            }}
            style={styles.ButtomPlus}>
            <Icon name="minus" size={25} color="gray" />
          </TouchableOpacity>
          <Text
            style={{
              color: '#62636a',
              fontWeight: 'bold',
              fontSize: 25,
            }}>
            {numberProduct}
          </Text>
          <TouchableOpacity
            onPress={() => {
              setNumberProduct(numberProduct + 1);
            }}
            style={styles.ButtomPlus}>
            <Icon name="plus" size={25} color="gray" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => onhandleShoppingCart()}
          style={styles.ViewButtom}>
          <Text
            style={{
              color: '#FFF',
              fontSize: 18,
            }}>
            Thêm vào giỏ
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Detail;
