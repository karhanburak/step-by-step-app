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
            aspect: [4, 3],
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
            aspect: [4, 3],
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

                    <TextInput
                        style={styles.textArea}
                        placeholder="Enter your task here..."
                        placeholderTextColor={colors.textLight}
                        multiline
                        numberOfLines={4}
                        value={taskInput}
                        onChangeText={setTaskInput}
                    />

                    <View style={styles.actionRow}>
                        <TouchableOpacity style={styles.actionButton} onPress={takePhoto}>
                            <Text style={styles.actionButtonText}>📷 Camera</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.actionButton, { marginLeft: 10 }]} onPress={pickImage}>
                            <Text style={styles.actionButtonText}>📎 Attach</Text>
                        </TouchableOpacity>
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
    textArea: {
        ...globalStyles.input,
        height: 120,
        textAlignVertical: 'top',
        marginBottom: 10,
    },
    actionRow: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
    },
    actionButtonText: {
        color: colors.text,
        fontSize: 14,
        fontWeight: '500',
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
