import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";

const OrderItem = ({ orderId, title, image, brand, date, price, qty }) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.image} />
      </View>
      <View style={styles.detailsContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.brand}>{brand}</Text>
          <Text style={styles.smallText}>Quantity: {qty}</Text>
          <Text style={styles.smallText}>Date: {date}</Text>
          <Text style={styles.smallText}>
            OrderId: <Text style={styles.boldText}>#{orderId}</Text>
          </Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{price} đ</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF", // White background
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 2,
    borderWidth: 1,
    borderColor: "#CBD5E0", // Slate border color
    padding: 10,
  },
  imageContainer: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
    resizeMode: "contain",
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingLeft: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
  },
  brand: {
    fontSize: 12,
    marginTop: 1,
  },
  smallText: {
    fontSize: 10,
    marginTop: 1,
  },
  boldText: {
    fontWeight: "bold",
  },
  priceContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  price: {
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default OrderItem;
