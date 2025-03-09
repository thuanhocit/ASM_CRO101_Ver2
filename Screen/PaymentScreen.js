import React, { useState } from "react";
import {
  View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Alert, ActivityIndicator
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useCart } from "./CartContext";
import { ordersCollection } from "./api/firebaseConfig";
import { addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // 🔥 Thêm Firebase Auth

const PaymentScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedItems, totalPrice } = route.params;
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const { clearPaidItems } = useCart();
  const auth = getAuth();
  const [loading, setLoading] = useState(false); // 🔥 Thêm state loading

  const paymentMethods = [
    { id: "momo", name: "MoMo" },
    { id: "VNPay", name: "VNPay" },
    { id: "cash", name: "Cash on Delivery" }
  ];

  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      Alert.alert("Lỗi", "Vui lòng chọn phương thức thanh toán");
      return;
    }

    if (!selectedItems || selectedItems.length === 0) {
      Alert.alert("Lỗi", "Không có sản phẩm trong giỏ hàng");
      return;
    }

    if (!auth.currentUser) {
      Alert.alert("Lỗi", "Bạn cần đăng nhập để thanh toán");
      return;
    }

    setLoading(true); // 🔥 Bật trạng thái loading

    const newOrder = {
      userId: auth.currentUser.uid,
      date: new Date().toISOString(),
      items: selectedItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        image: typeof item.image === "string" ? item.image : "https://example.com/default-image.jpg",
      })),
      totalAmount: totalPrice,
      paymentMethod: selectedPaymentMethod,
    };

    try {
      await addDoc(ordersCollection, newOrder);
      console.log("Order saved:", newOrder);

      const selectedIds = selectedItems.map(item => item.id);
      clearPaidItems(selectedIds);

      Alert.alert("Thanh toán thành công", "Đơn hàng của bạn đã được đặt!", [
        { text: "OK", onPress: () => navigation.navigate("HomeTabs") }
      ]);
    } catch (error) {
      console.error("Lỗi khi lưu đơn hàng:", error);
      Alert.alert("Lỗi", "Thanh toán thất bại, vui lòng thử lại.");
    } finally {
      setLoading(false); // 🔥 Tắt trạng thái loading
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thanh toán</Text>
      <FlatList
        data={selectedItems || []}
        keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
        renderItem={({ item }) => item && (
          <View style={styles.item}>
            <Image
              source={typeof item.image === "string" ? { uri: item.image } : item.image}
              style={styles.image}
            />
            <View>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>${item.price} x {item.quantity}</Text>
            </View>
          </View>
        )}
      />
      <Text style={styles.total}>Tổng cộng: ${totalPrice}</Text>

      <Text style={styles.paymentTitle}>Chọn phương thức thanh toán</Text>
      {paymentMethods.map((method) => (
        <TouchableOpacity
          key={method.id}
          style={[styles.paymentMethod, selectedPaymentMethod === method.id && styles.selectedMethod]}
          onPress={() => setSelectedPaymentMethod(method.id)}
        >
          <Text style={styles.paymentText}>{method.name}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity 
        style={styles.payButton} 
        onPress={handlePayment} 
        disabled={loading} // 🔥 Disable khi đang loading
      >
        {loading ? ( // 🔥 Hiển thị loading nếu đang xử lý thanh toán
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.payButtonText}>Thanh toán</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#0E0F11" },
  title: { fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 20, textAlign: "center" },
  item: { flexDirection: "row", backgroundColor: "#1C1C1E", padding: 10, borderRadius: 10, marginBottom: 10, alignItems: "center" },
  image: { width: 50, height: 50, borderRadius: 10, marginRight: 10 },
  name: { fontSize: 16, color: "#fff", fontWeight: "bold" },
  price: { fontSize: 14, color: "#FF6C22" },
  total: { fontSize: 20, fontWeight: "bold", color: "#fff", textAlign: "center", marginVertical: 20 },
  paymentTitle: { fontSize: 18, fontWeight: "bold", color: "#fff", marginTop: 10, marginBottom: 10 },
  paymentMethod: { backgroundColor: "#333", padding: 15, borderRadius: 10, marginBottom: 10, alignItems: "center" },
  selectedMethod: { backgroundColor: "#FF6C22" },
  paymentText: { fontSize: 16, color: "#fff" },
  payButton: { backgroundColor: "#FF6C22", padding: 15, borderRadius: 10, alignItems: "center", marginTop: 20 },
  payButtonText: { fontSize: 18, fontWeight: "bold", color: "#fff" },
});

export default PaymentScreen;
