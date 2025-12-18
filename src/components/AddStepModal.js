import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { colors, globalStyles } from '../styles/theme';

export default function AddStepModal({ visible, onClose, onSave, currentStepCount }) {
    const [stepText, setStepText] = useState('');

    const handleSave = () => {
        if (stepText.trim()) {
            onSave(stepText.trim());
            setStepText('');
        }
    };

    const handleClose = () => {
        setStepText('');
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={handleClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.overlay}
            >
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>Add New Step</Text>
                    <Text style={styles.subtitle}>
                        This will be added as step {currentStepCount + 1}
                    </Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Enter step description..."
                        placeholderTextColor={colors.textLight}
                        value={stepText}
                        onChangeText={setStepText}
                        multiline
                        numberOfLines={3}
                        autoFocus
                    />

                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={handleClose}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.saveButton, !stepText.trim() && styles.disabledButton]}
                            onPress={handleSave}
                            disabled={!stepText.trim()}
                        >
                            <Text style={styles.saveButtonText}>Add Step</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '85%',
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: colors.textLight,
        marginBottom: 20,
    },
    input: {
        ...globalStyles.input,
        minHeight: 80,
        textAlignVertical: 'top',
        marginBottom: 20,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
        marginRight: 8,
    },
    cancelButtonText: {
        color: colors.text,
        fontSize: 16,
        fontWeight: '600',
    },
    saveButton: {
        backgroundColor: colors.primary,
        marginLeft: 8,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    disabledButton: {
        opacity: 0.5,
    },
});
