import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
    Image
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors, globalStyles } from '../styles/theme';
import { generateTaskSteps } from '../services/geminiService';

export default function HomeScreen({ navigation }) {
    const [taskInput, setTaskInput] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const pickImage = async () => {
        console.log("Pick image pressed");
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.5,
            base64: true,
        });

        if (!result.canceled) {
            setImage(result.assets[0]);
        }
    };

    const takePhoto = async () => {
        console.log("Take photo pressed");
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert("Permission Required", "You need to allow camera access to take a photo.");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 0.5,
            base64: true,
        });

        if (!result.canceled) {
            setImage(result.assets[0]);
        }
    };

    const removeImage = () => {
        setImage(null);
    };

    const handleCreateTask = async () => {
        if (!taskInput.trim() && !image) return;

        setLoading(true);
        try {
            const result = await generateTaskSteps(taskInput, image);
            navigation.navigate('Steps', {
                taskData: result,
                originalRequest: taskInput
            });
            setTaskInput('');
            setImage(null);
        } catch (error) {
            if (error.message === 'API_KEY_MISSING') {
                Alert.alert(
                    "AI Service Unavailable",
                    "The application cannot connect to the AI service. Please check your API Key configuration."
                );
            } else {
                console.error(error);
                Alert.alert('Error', 'An error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={globalStyles.container}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} keyboardShouldPersistTaps="handled">
                <View style={styles.content}>
                    <Text style={styles.headerTitle}>What do you want to do?</Text>
                    <Text style={styles.subtitle}>
                        E.g., "Chocolate cake recipe", "Snap a photo of ingredients"
                    </Text>

                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.textArea}
                            placeholder="Enter your task here..."
                            placeholderTextColor={colors.textLight}
                            multiline
                            numberOfLines={4}
                            value={taskInput}
                            onChangeText={setTaskInput}
                        />

                        <View style={styles.inputActions}>
                            <TouchableOpacity style={styles.iconButton} onPress={takePhoto}>
                                <Image source={require('../../assets/camera.png')} style={styles.iconImage} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.iconButton, { marginLeft: 15 }]} onPress={pickImage}>
                                <Image source={require('../../assets/image.png')} style={styles.iconImage} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {image && (
                        <View style={styles.imagePreviewContainer}>
                            <Image source={{ uri: image.uri }} style={styles.imagePreview} />
                            <TouchableOpacity style={styles.removeImageButton} onPress={removeImage}>
                                <Text style={styles.removeImageText}>X</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    <TouchableOpacity
                        style={[globalStyles.button, styles.createButton, loading && styles.disabledButton]}
                        onPress={handleCreateTask}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={globalStyles.buttonText}>Create Steps ✨</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.historyButton}
                        onPress={() => navigation.navigate('History')}
                    >
                        <Text style={styles.historyButtonText}>History</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: colors.text,
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: colors.textLight,
        textAlign: 'center',
        marginBottom: 40,
    },
    inputWrapper: {
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 16,
        minHeight: 180,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: colors.border,
    },
    textArea: {
        fontSize: 16,
        color: colors.text,
        textAlignVertical: 'top',
        flex: 1,
        marginBottom: 10,
    },
    inputActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    iconButton: {
        padding: 3,
        paddingLeft: 0
    },
    iconImage: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
        tintColor: colors.textLight,
    },
    imagePreviewContainer: {
        position: 'relative',
        marginBottom: 20,
        alignSelf: 'flex-start',
    },
    imagePreview: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    removeImageButton: {
        position: 'absolute',
        top: -10,
        right: -10,
        backgroundColor: colors.primary,
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    removeImageText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    createButton: {
        marginBottom: 20,
    },
    disabledButton: {
        opacity: 0.7,
    },
    historyButton: {
        alignItems: 'center',
        padding: 10,
    },
    historyButtonText: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: '500',
    },
});
