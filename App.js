import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

const CoffeeApp = () => {
  const [coffeeList, setCoffeeList] = useState([]);
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCoffeeId, setCurrentCoffeeId] = useState(null);
  const [newCoffee, setNewCoffee] = useState({ name: '', type: '', price: '', image: null });

  useEffect(() => {
    loadCoffeeData();
  }, []);

  const loadCoffeeData = async () => {
    const data = await AsyncStorage.getItem('coffeeList');
    if (data) {
      setCoffeeList(JSON.parse(data));
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setNewCoffee({ ...newCoffee, image: result.assets[0].uri });
    }
  };

  const addOrUpdateCoffee = async () => {
    if (newCoffee.name && newCoffee.type && newCoffee.price && newCoffee.image) {
      let updatedList;
      if (editMode) {
        updatedList = coffeeList.map(coffee =>
          coffee.id === currentCoffeeId ? { ...newCoffee, id: currentCoffeeId } : coffee
        );
      } else {
        const newEntry = { ...newCoffee, id: Date.now().toString(), price: parseFloat(newCoffee.price) };
        updatedList = [...coffeeList, newEntry];
      }
      setCoffeeList(updatedList);
      await AsyncStorage.setItem('coffeeList', JSON.stringify(updatedList));
      setNewCoffee({ name: '', type: '', price: '', image: null });
      setModalVisible(false);
      setEditMode(false);
    }
  };
  const deleteCoffee = async (id) => {
    const updatedList = coffeeList.filter(coffee => coffee.id !== id);
    setCoffeeList(updatedList);
    await AsyncStorage.setItem('coffeeList', JSON.stringify(updatedList));
  };

  const editCoffee = (coffee) => {
    setNewCoffee(coffee);
    setCurrentCoffeeId(coffee.id);
    setEditMode(true);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.location}>Location</Text>
        <Text style={styles.city}>Surigao, City▼</Text>
        <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search coffee"
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter" size={24} color="white" />
        </TouchableOpacity>
      </View>
      </View>
      
      <FlatList
        data={coffeeList.filter(coffee => coffee.name.toLowerCase().includes(search.toLowerCase()))}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.type}>{item.type}</Text>
            <Text style={styles.price}>${item.price.toFixed(2)}</Text>
            <View style={styles.cardButtons}>
              <TouchableOpacity onPress={() => editCoffee(item)}>
                <Text style={styles.editButton}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteCoffee(item.id)}>
                <Text style={styles.deleteButton}>Delete</Text>
              </TouchableOpacity>

            </View>
          </View>
        )}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => { setEditMode(false); setModalVisible(true); }}>
        <Text style={styles.addButtonText}>Add Coffee</Text>
      </TouchableOpacity>
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{editMode ? "Edit Coffee" : "Add Coffee"}</Text>
            <TextInput placeholder="Coffee Name" value={newCoffee.name} onChangeText={(text) => setNewCoffee({ ...newCoffee, name: text })} style={styles.input} />
            <TextInput placeholder="Type" value={newCoffee.type} onChangeText={(text) => setNewCoffee({ ...newCoffee, type: text })} style={styles.input} />
            <TextInput placeholder="Price" value={newCoffee.price} onChangeText={(text) => setNewCoffee({ ...newCoffee, price: text })} keyboardType="numeric" style={styles.input} />
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
              <Text style={styles.buttonText}>{newCoffee.image ? "Change Image" : "Pick an Image"}</Text>
            </TouchableOpacity>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.addButtonModal} onPress={addOrUpdateCoffee}>
                <Text style={styles.buttonText}>{editMode ? "Update" : "Add"}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F3F3',
  
  },
  header: {
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: '#1E1E1E',
    paddingBottom: 20,
  },
  location: {
    color: '#AAA',
    fontSize: 14,
    fontFamily: 'Sora',

  },
  city: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Sora',
  },
  searchContainer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 10,
    
    
  },
  searchBar: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Sora',

  },
  filterButton: {
    backgroundColor: '#C67C4E',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#C67C4E',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Sora',

  },
  card: {
    backgroundColor: '#FFF',
    margin: 10,
    padding: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 5,
    width: '45%',
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
    fontFamily: 'Sora',

  },
  type: {
    color: '#555',
    fontSize: 14,
    fontFamily: 'Sora',

  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#C67C4E',
    marginTop: 5,
    fontFamily: 'Sora',

  },
  deleteButton: {
    color: 'red',
    marginTop: 5,
    textAlign: 'center',
   
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'Sora',

  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
  },
  imagePicker: {
    backgroundColor: '#C67C4E',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Sora',

  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  addButtonModal: {
    flex: 1,
    backgroundColor: '#C67C4E',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 5,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#888',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginLeft: 5,
  },
  cardButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 },
  editButton: { color: 'blue', fontWeight: 'bold', paddingHorizontal: 10 },
  deleteButton: { color: 'red', fontWeight: 'bold', paddingHorizontal: 10 },
});


export default CoffeeApp;
