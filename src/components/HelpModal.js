import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { colors } from '../styles/theme';

export default function HelpModal({ visible, onClose, onSubmit, loading }) {
    const [issue, setIssue] = useState('');

    const handleSubmit = () => {
        if (issue.trim()) {
            onSubmit(issue);
            setIssue('');
        }
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.modalOverlay}
            >
                <View style={styles.modalContent}>
                    <Text style={styles.title}>Describe the Problem</Text>
                    <Text style={styles.subtitle}>
                        How can I help you? Briefly explain where you are stuck.
                    </Text>

                    <TextInput
                        style={styles.input}
                        placeholder="E.g., I don't have a cake mold, what can I do?"
                        multiline
                        numberOfLines={4}
                        value={issue}
                        onChangeText={setIssue}
                        autoFocus
                    />

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={onClose}
                            disabled={loading}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.submitButton, loading && styles.disabledButton]}
                            onPress={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" size="small" />
                            ) : (
                                <Text style={styles.submitButtonText}>Submit</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        color: colors.text,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: colors.textLight,
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        backgroundColor: colors.background,
        borderRadius: 12,
        padding: 16,
        minHeight: 100,
        textAlignVertical: 'top',
        marginBottom: 20,
        fontSize: 16,
        color: colors.text,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
    },
    cancelButton: {
        padding: 12,
        borderRadius: 8,
    },
    cancelButtonText: {
        color: colors.textLight,
        fontSize: 16,
        fontWeight: '600',
    },
    submitButton: {
        backgroundColor: colors.secondary,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        minWidth: 100,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    disabledButton: {
        opacity: 0.7,
    },
});
