import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator
} from 'react-native';
import { colors, globalStyles } from '../styles/theme';
import StepItem from '../components/StepItem';
import NoteModal from '../components/NoteModal';
import HelpModal from '../components/HelpModal';
import { getHelpSuggestion } from '../services/geminiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function StepsScreen({ route, navigation }) {
    const { taskData, originalRequest } = route.params;
    const [steps, setSteps] = useState(taskData.steps || []);
    const [taskTitle, setTaskTitle] = useState(taskData.taskTitle || originalRequest);

    const [modalVisible, setModalVisible] = useState(false);
    const [helpModalVisible, setHelpModalVisible] = useState(false);
    const [selectedStepId, setSelectedStepId] = useState(null);
    const [loadingHelp, setLoadingHelp] = useState(false);

    useEffect(() => {
        saveTask();
    }, [steps]);

    const saveTask = async () => {
        try {
            const taskToSave = {
                id: Date.now().toString(), // Simple ID generation
                taskTitle,
                steps,
                createdAt: new Date().toISOString(),
            };
            // In a real app, this would be Firebase
            // await firebaseService.saveTask(taskToSave);

            // For demo: Save to AsyncStorage
            const existingTasksJson = await AsyncStorage.getItem('tasks');
            let tasks = existingTasksJson ? JSON.parse(existingTasksJson) : [];

            // Update if exists, else add
            const existingIndex = tasks.findIndex(t => t.taskTitle === taskTitle);
            if (existingIndex >= 0) {
                tasks[existingIndex] = taskToSave;
            } else {
                tasks.push(taskToSave);
            }

            await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
        } catch (e) {
            console.error('Failed to save task', e);
        }
    };

    const toggleStep = (id) => {
        const stepIndex = steps.findIndex(s => s.id === id);
        if (stepIndex === -1) return;

        const newSteps = [...steps];
        const isCompleting = !newSteps[stepIndex].completed;

        // Toggle current step
        newSteps[stepIndex] = { ...newSteps[stepIndex], completed: isCompleting };

        // If unchecking, uncheck all subsequent steps
        if (!isCompleting) {
            for (let i = stepIndex + 1; i < newSteps.length; i++) {
                newSteps[i] = { ...newSteps[i], completed: false };
            }
        }

        setSteps(newSteps);
    };

    const openNoteModal = (id) => {
        setSelectedStepId(id);
        setModalVisible(true);
    };

    const saveNote = (noteText) => {
        setSteps(steps.map(step =>
            step.id === selectedStepId ? { ...step, note: noteText } : step
        ));
    };

    const handleGetHelp = () => {
        setHelpModalVisible(true);
    };

    const handleHelpSubmit = async (issue) => {
        setLoadingHelp(true);
        try {
            const completedSteps = steps.filter(s => s.completed);
            const pendingSteps = steps.filter(s => !s.completed);

            const suggestion = await getHelpSuggestion(
                taskTitle,
                completedSteps,
                pendingSteps,
                issue
            );

            setHelpModalVisible(false);

            Alert.alert(
                "AI Suggestion",
                suggestion.message,
                suggestion.suggestedSolution && suggestion.suggestedSolution.length > 0 ? [
                    { text: "Thanks", style: "cancel" },
                    {
                        text: "Apply New Plan",
                        onPress: () => {
                            setSteps(suggestion.suggestedSolution);
                        }
                    }
                ] : [{ text: "OK" }]
            );

        } catch (error) {
            if (error.message === 'API_KEY_MISSING') {
                Alert.alert(
                    "AI Service Unavailable",
                    "The application cannot connect to the AI service. Please check your API Key configuration."
                );
            } else {
                Alert.alert("Error", "Could not get help.");
            }
        } finally {
            setLoadingHelp(false);
        }
    };

    return (
        <View style={globalStyles.container}>
            <FlatList
                data={steps}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item, index }) => (
                    <StepItem
                        step={item}
                        stepNumber={index + 1}
                        onToggle={toggleStep}
                        onAddNote={openNoteModal}
                        disabled={index > 0 && !steps[index - 1].completed}
                    />
                )}
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            />

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.helpButton}
                    onPress={handleGetHelp}
                    disabled={loadingHelp}
                >
                    {loadingHelp ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.helpButtonText}>🧠 Ask for Help</Text>
                    )}
                </TouchableOpacity>
            </View>

            <NoteModal
                visible={modalVisible}
                initialNote={steps.find(s => s.id === selectedStepId)?.note}
                onClose={() => setModalVisible(false)}
                onSave={saveNote}
            />

            <HelpModal
                visible={helpModalVisible}
                onClose={() => setHelpModalVisible(false)}
                onSubmit={handleHelpSubmit}
                loading={loadingHelp}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        backgroundColor: 'rgba(245, 246, 250, 0.9)',
    },
    helpButton: {
        backgroundColor: colors.primary,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    helpButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
