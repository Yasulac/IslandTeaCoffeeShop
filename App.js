import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Image, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const CoffeeMenuManager = () => {
  const [menu, setMenu] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editItem, setEditItem] = useState(null);
  
  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu = async () => {
    try {
      const data = await AsyncStorage.getItem('menu');
      if (data) setMenu(JSON.parse(data));
    } catch (error) {
      console.error('Error loading menu:', error);
    }
  };

  const saveMenu = async (newMenu) => {
    try {
      await AsyncStorage.setItem('menu', JSON.stringify(newMenu));
    } catch (error) {
      console.error('Error saving menu:', error);
    }
  };

  const addMenuItem = () => {
    if (!name || !price || !image) {
      Alert.alert('Error', 'Please enter all fields and select an image.');
      return;
    }
    const newItem = { id: Date.now().toString(), name, price: parseFloat(price), image };
    const updatedMenu = [...menu, newItem];
    setMenu(updatedMenu);
    saveMenu(updatedMenu);
    resetForm();
  };

  const editMenuItem = (item) => {
    setEditMode(true);
    setEditItem(item);
    setName(item.name);
    setPrice(item.price.toString());
    setImage(item.image);
  };

  const updateMenuItem = () => {
    if (!name || !price || !image) {
      Alert.alert('Error', 'Please enter all fields and select an image.');
      return;
    }
    const updatedMenu = menu.map(item => item.id === editItem.id ? { ...item, name, price: parseFloat(price), image } : item);
    setMenu(updatedMenu);
    saveMenu(updatedMenu);
    setEditMode(false);
    resetForm();
  };

  const deleteMenuItem = (id) => {
    console.log("Delete function triggered for ID:", id);
    Alert.alert('Confirm', 'Are you sure you want to delete this item?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', onPress: () => {
          const updatedMenu = menu.filter(item => item.id !== id);
          console.log("Updated menu after deletion:", updatedMenu);
          setMenu(updatedMenu);
          saveMenu(updatedMenu);
        }
      }
    ]);
  };
  

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const resetForm = () => {
    setName('');
    setPrice('');
    setImage(null);
    setEditItem(null);
    setEditMode(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Coffee Menu Manager</Text>
      <TextInput placeholder="Coffee Name" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Price" value={price} onChangeText={setPrice} keyboardType="numeric" style={styles.input} />
      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Text style={styles.buttonText}>📸 Pick Image</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.previewImage} />}
      <TouchableOpacity style={styles.addButton} onPress={editMode ? updateMenuItem : addMenuItem}>
        <Text style={styles.buttonText}>{editMode ? "✏️ Update Coffee" : "➕ Add Coffee"}</Text>
      </TouchableOpacity>
      <FlatList 
        data={menu} 
        keyExtractor={(item) => item.id} 
        numColumns={2}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.coffeeName}>{item.name}</Text>
            <Text style={styles.price}>${item.price.toFixed(2)}</Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity onPress={() => editMenuItem(item)} style={styles.editButton}>
                <Text style={styles.buttonText}>✏️ Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteMenuItem(item.id)} style={styles.deleteButton}>
                <Text style={styles.buttonText}>🗑️ Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#121212', flex: 1 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#fff' },
  input: { borderBottomWidth: 1, marginBottom: 10, padding: 5, color: '#fff', borderColor: '#fff' },
  imageButton: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, alignItems: 'center', marginVertical: 10 },
  addButton: { backgroundColor: '#28A745', padding: 15, borderRadius: 10, alignItems: 'center', marginVertical: 10 },
  buttonText: { color: 'white', fontWeight: 'bold' },
  previewImage: { width: 100, height: 100, alignSelf: 'center', marginTop: 10, borderRadius: 10 },
  card: { flex: 1, backgroundColor: '#333333', borderRadius: 10, padding: 10, margin: 10, alignItems: 'center' },
  image: { width: 100, height: 100, borderRadius: 10 },
  coffeeName: { fontSize: 16, fontWeight: 'bold', marginTop: 5, color: '#fff' },
  price: { fontSize: 14, color: '#28A745', marginBottom: 5 },
  buttonGroup: { flexDirection: 'row', marginTop: 5 },
  editButton: { backgroundColor: '#4D55CC', padding: 5, borderRadius: 5, marginRight: 5 },
  deleteButton: { backgroundColor: 'red', padding: 5, borderRadius: 5 },
});

export default CoffeeMenuManager;
