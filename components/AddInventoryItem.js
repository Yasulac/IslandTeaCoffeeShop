import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet } from 'react-native';

const AddInventoryItem = ({ onAddItem, onClose }) => {
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');

  const handleAdd = () => {
    const newItem = {
      id: Date.now().toString(),
      name: itemName,
      price: parseFloat(itemPrice),
      quantity: parseInt(itemQuantity),
    };
    onAddItem(newItem);
    setItemName('');
    setItemPrice('');
    setItemQuantity('');
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add Inventory Item</Text>
          <TextInput
            style={styles.input}
            placeholder="Item Name"
            value={itemName}
            onChangeText={setItemName}
          />
          <TextInput
            style={styles.input}
            placeholder="Item Price"
            keyboardType="numeric"
            value={itemPrice}
            onChangeText={setItemPrice}
          />
          <TextInput
            style={styles.input}
            placeholder="Item Quantity"
            keyboardType="numeric"
            value={itemQuantity}
            onChangeText={setItemQuantity}
          />
          <Button title="Add Item" onPress={handleAdd} />
          <Button title="Cancel" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
});

export default AddInventoryItem;
