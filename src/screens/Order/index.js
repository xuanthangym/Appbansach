import React, { useContext, useEffect, useState } from "react";
import { Text, View, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import OrderItem from "./orderIteam";
import TotalSummaryCard from "../../utilities/index";

import {collection, query, where, getDocs} from "firebase/firestore";
import {db, auth} from "../../../firebaseConfig";

import styles from './styles';

const Order = ({ navigation }) => {
  const [orders, setOrders] = useState([]); 
  const fetchAllOrders = async () => {
    try {
      const userEmail = auth.currentUser.email;
      const querySnapshot = await getDocs(collection(db, "ShoppingCart"));
      let userShoppingCartItems = [];
      querySnapshot.forEach((doc) => {
        const cartItem = doc.data();
        if (cartItem.email === userEmail) {
          userShoppingCartItems.push({
            id: doc.id,
            qty: cartItem.amount,
            title: cartItem.nameProduct,
            orderId: cartItem.orderId,
            image: cartItem.image,
            price: cartItem.priceProduct
          });
        }
      });
      console.log(orders);
      setOrders(userShoppingCartItems);
    } catch (error) {
      console.error("Error fetching user shopping cart items:", error);
    }
  };
  
  

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
    fetchAllOrders();
  }, []);
  
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.headerText}>Chi tiết đơn hàng</Text>
      </View>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {orders?.map((order) => (
            <OrderItem
              key={order.id}
              brand={order.brand}
              qty={order.qty}
              title={order.title}
              date={order.date}
              orderId={order.orderId}
              image={order.image}
              price={order.price}
            />
          ))}
        </ScrollView>

      <View style={styles.ViewBottomContainer}>
        <TouchableOpacity
          onPress={() => {
            
          }}
          style={styles.ViewButtom}>
          <Text
            style={{
              color: '#FFF',
              fontSize: 18,
            }}>
            Xong
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Order;
