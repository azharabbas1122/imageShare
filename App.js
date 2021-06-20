import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Image, Platform, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import logo from './assets/logo.png';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import uplaodToAnonymousFilesAsync from 'anonymous-files';

export default function App() {

  const [selectedImage, setSelectedImage] = React.useState(null);

  let openImagePickerAsync = async () => {
    let permissionsResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionsResult.granted === false) {
      alert('permission to access camera rolll is required!');
      return;
    }
    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (pickerResult.cancelled === true) {
      return;
    } 
    if (Platform.OS === 'web') {
      let remoteUri = await uplaodToAnonymousFilesAsync(pickerResult.uri);
      setSelectedImage({ localuri: pickerResult.uri, remoteUri });
    } else {
      setSelectedImage({ localuri: pickerResult.uri });
    }
  };
  let openShareDialogueAsync = async () => {
    if (!(await Sharing.isAvailableAsync())) {
      alert(`This image is available for sharing at: ${selectedImage.remoteUri}`);
      return;
    }
    await Sharing.shareAsync(selectedImage.localuri);
  };
  if (selectedImage !== null) {
    return(
      <View>
        <Image source={{ uri: selectedImage.localuri }} style={styles.thumbnail} />
        <TouchableOpacity onPress={openShareDialogueAsync} style={styles.buttonShare} >
          <Text style={styles.shareBText}>Sahre this photo</Text>
        </TouchableOpacity>
      </View>
    );
  }


  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
            <Text style={styles.heading}> 
        To share a photo from your phone with a friend, just press the button below!
      </Text>
      <StatusBar style="auto" />
      <TouchableOpacity 
      onPress= {openImagePickerAsync} 
      style={styles.button}>
        <Text style={styles.buttonText}>Pick a Photo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 305,
    height: 159,
    marginBottom: 10,
  },
  heading: {
    color: 'blue',
    fontSize: 18,
    marginHorizontal: 15,
  },
  button: {
    backgroundColor: 'red',
    borderRadius: 5,
    padding: 10,

  },
  buttonText: {
    fontSize: 20,
    color: 'white',
  },
  thumbnail: {
    width: 300,
    height: 300,
    resizeMode: "cover"
  },
  buttonShare: {
    backgroundColor: 'red',
    color: 'white',
  },
  shareBText: {
    fontSize: 15,
  }
});
