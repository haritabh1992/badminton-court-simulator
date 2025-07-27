import React, { useState } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Text, TextInput, Image, ScrollView, Dimensions, Alert } from 'react-native';
import { Button, Card, Title, Paragraph, Text as PaperText, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

interface IconCustomizationModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (type: 'icon' | 'text' | 'photo', value: string) => void;
  currentValue: string;
  currentType: 'icon' | 'text' | 'photo';
  markerId: 'P1' | 'P2' | 'P3' | 'P4' | 'Shuttle';
  currentColor: string;
}

// Default icons for each marker type
const defaultIcons = {
  P1: 'account',
  P2: 'account', 
  P3: 'account',
  P4: 'account',
  Shuttle: 'badminton'
};

export function IconCustomizationModal({ 
  visible, 
  onClose, 
  onSave, 
  currentValue, 
  currentType,
  markerId,
  currentColor
}: IconCustomizationModalProps) {
  const [activeTab, setActiveTab] = useState<'icons' | 'text' | 'photo'>(currentType);
  const [textInput, setTextInput] = useState(currentType === 'text' ? currentValue : '');
  const [selectedIcon, setSelectedIcon] = useState(currentType === 'icon' ? currentValue : defaultIcons[markerId]);
  const [selectedImage, setSelectedImage] = useState(currentType === 'photo' ? currentValue : '');



  const pickImage = async () => {
    // Show action sheet to choose between camera and gallery
    Alert.alert(
      'Select Photo',
      'Choose how you want to add a photo',
      [
        {
          text: 'Take Photo',
          onPress: async () => {
            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
              const imageUri = result.assets[0].uri;
              
              // Crop the image to a square if needed
              const manipulatedImage = await ImageManipulator.manipulateAsync(
                imageUri,
                [{ crop: { originX: 0, originY: 0, width: 200, height: 200 } }],
                { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
              );
              
              setSelectedImage(manipulatedImage.uri);
            }
          }
        },
        {
          text: 'Choose from Gallery',
          onPress: async () => {
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
              const imageUri = result.assets[0].uri;
              
              // Crop the image to a square if needed
              const manipulatedImage = await ImageManipulator.manipulateAsync(
                imageUri,
                [{ crop: { originX: 0, originY: 0, width: 200, height: 200 } }],
                { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
              );
              
              setSelectedImage(manipulatedImage.uri);
            }
          }
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  const renderIconsTab = () => (
    <View style={styles.contentArea}>
      <PaperText style={styles.contentDescription}>
        Default icon selected
      </PaperText>
      <View style={styles.previewContainer}>
        <PaperText style={styles.previewLabel}>Preview:</PaperText>
        <View style={[
          styles.previewCircle, 
          { 
            backgroundColor: currentColor,
            borderColor: currentColor === '#ffffff' ? '#cccccc' : '#e0e0e0'
          }
        ]}>
          <MaterialCommunityIcons
            name={defaultIcons[markerId] as any}
            size={40}
            color={currentColor === '#ffffff' ? '#333333' : 'white'}
          />
        </View>
      </View>
    </View>
  );

  const renderTextTab = () => (
    <View style={styles.contentArea}>
      <PaperText style={styles.contentDescription}>
        Tap the circle below to enter custom text (max 3 characters)
      </PaperText>
      <View style={styles.previewContainer}>
        <PaperText style={styles.previewLabel}>Preview:</PaperText>
        <TextInput
          style={[
            styles.previewCircle,
            styles.textInputInCircle,
            { 
              backgroundColor: currentColor,
              borderColor: currentColor === '#ffffff' ? '#cccccc' : '#e0e0e0',
              color: currentColor === '#ffffff' ? '#333333' : 'white'
            }
          ]}
          value={textInput}
          onChangeText={(text) => {
            setTextInput(text);
            if (text.trim()) {
              onSave('text', text.trim());
            }
          }}
          placeholder="ABC"
          maxLength={3}
          textAlign="center"
          fontSize={20}
          placeholderTextColor={currentColor === '#ffffff' ? '#999999' : 'rgba(255, 255, 255, 0.7)'}
        />
      </View>
    </View>
  );

  const renderPhotoTab = () => (
    <View style={styles.contentArea}>
      <PaperText style={styles.contentDescription}>
        Tap the circle below to select or take a photo
      </PaperText>
      <View style={styles.previewContainer}>
        <PaperText style={styles.previewLabel}>Preview:</PaperText>
        <TouchableOpacity
          onPress={async () => {
            await pickImage();
            if (selectedImage) {
              onSave('photo', selectedImage);
            }
          }}
          style={[
            styles.previewCircle, 
            { 
              backgroundColor: currentColor,
              borderColor: currentColor === '#ffffff' ? '#cccccc' : '#e0e0e0'
            }
          ]}
        >
          {selectedImage ? (
            <Image 
              source={{ uri: selectedImage }} 
              style={styles.photoPreviewImage}
            />
          ) : (
            <MaterialCommunityIcons
              name="camera"
              size={28}
              color={currentColor === '#ffffff' ? '#333333' : 'white'}
            />
          )}
        </TouchableOpacity>
        {selectedImage && (
          <Button
            mode="outlined"
            onPress={() => {
              setSelectedImage('');
              onSave('icon', defaultIcons[markerId]);
            }}
            style={styles.removeButton}
            textColor="red"
          >
            Remove Photo
          </Button>
        )}
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Title style={styles.modalTitle}>Customize Icon</Title>
            <IconButton icon="close" onPress={onClose} />
          </View>

          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[styles.optionButton, activeTab === 'icons' && styles.activeOptionButton]}
              onPress={() => {
                setActiveTab('icons');
                onSave('icon', defaultIcons[markerId]);
              }}
            >
              <View style={styles.optionIconContainer}>
                <MaterialCommunityIcons
                  name={defaultIcons[markerId] as any}
                  size={32}
                  color={activeTab === 'icons' ? '#333333' : '#444'}
                />
              </View>
              <PaperText style={[styles.optionLabel, activeTab === 'icons' && styles.activeOptionLabel]}>
                Default Icon
              </PaperText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionButton, activeTab === 'text' && styles.activeOptionButton]}
              onPress={() => {
                setActiveTab('text');
                if (textInput.trim()) {
                  onSave('text', textInput.trim());
                }
              }}
            >
              <View style={styles.optionIconContainer}>
                <MaterialCommunityIcons
                  name="format-text"
                  size={32}
                  color={activeTab === 'text' ? '#333333' : '#444'}
                />
              </View>
              <PaperText style={[styles.optionLabel, activeTab === 'text' && styles.activeOptionLabel]}>
                Text
              </PaperText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionButton, activeTab === 'photo' && styles.activeOptionButton]}
              onPress={() => {
                setActiveTab('photo');
                if (selectedImage) {
                  onSave('photo', selectedImage);
                }
              }}
            >
              <View style={styles.optionIconContainer}>
                <MaterialCommunityIcons
                  name="camera"
                  size={32}
                  color={activeTab === 'photo' ? '#333333' : '#444'}
                />
              </View>
              <PaperText style={[styles.optionLabel, activeTab === 'photo' && styles.activeOptionLabel]}>
                Photo
              </PaperText>
            </TouchableOpacity>
          </View>

          <View style={styles.contentArea}>
            {activeTab === 'icons' && renderIconsTab()}
            {activeTab === 'text' && renderTextTab()}
            {activeTab === 'photo' && renderPhotoTab()}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
    flexDirection: 'column',
    zIndex: 1001,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  optionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderColor: '#d0d0d0',
    minWidth: 80,
  },
  activeOptionButton: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  optionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#cccccc',
  },
  optionLabel: {
    fontSize: 12,
    color: '#444',
    textAlign: 'center',
    fontWeight: '600',
  },
  activeOptionLabel: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  contentArea: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: 0,
  },
  contentDescription: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '500',
  },
  defaultIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    flex: 1,
  },
  defaultIconOption: {
    width: 140,
    height: 140,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 16,
  },
  defaultIconLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  selectedIconLabel: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  selectedIconOption: {
    borderColor: '#2196F3',
    backgroundColor: '#2196F3',
  },
  inputContainer: {
    marginBottom: 16,
    width: '100%',
  },
  textInput: {
    borderWidth: 2,
    borderColor: '#2196F3',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
    textAlign: 'center',
    width: '100%',
    height: 48,
  },
  buttonContainer: {
    marginBottom: 16,
    width: '100%',
  },
  textContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textPreview: {
    alignItems: 'center',
  },
  previewLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  textPreviewBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textPreviewText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  uploadButton: {
    width: '100%',
    paddingVertical: 8,
  },
  photoContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPreview: {
    alignItems: 'center',
    marginTop: 16,
  },
  photoPreviewImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginVertical: 8,
  },
  removeButton: {
    marginTop: 16,
  },
  previewContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  previewCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  previewText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  textInputInCircle: {
    fontWeight: 'bold',
    padding: 0,
    margin: 0,
  },
  photoPreviewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 35,
  },
}); 