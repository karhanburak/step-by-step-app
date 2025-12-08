import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { colors } from '../styles/theme';

export default function StepItem({ step, stepNumber, onToggle, onAddNote, disabled }) {
    // 0 = Disabled, 1 = Active
    const animVal = useRef(new Animated.Value(disabled ? 0 : 1)).current;

    useEffect(() => {
        Animated.timing(animVal, {
            toValue: disabled ? 0 : 1,
            duration: 300,
            useNativeDriver: false, // backgroundColor requires false
        }).start();
    }, [disabled]);

    const backgroundColor = animVal.interpolate({
        inputRange: [0, 1],
        outputRange: ['#FCFCFC', colors.card]
    });

    return (
        <Animated.View style={[
            styles.container,
            { backgroundColor }, // Animated background
            step.completed && styles.completedContainer,
        ]}>
            <Text style={[styles.stepHeader, disabled && styles.disabledText]}>Step {stepNumber}</Text>

            <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => onToggle(step.id)}
                disabled={disabled}
            >
                <View style={[
                    styles.checkbox,
                    step.completed && styles.checked,
                    disabled && styles.disabledCheckbox
                ]}>
                    {step.completed && <Text style={styles.checkmark}>✓</Text>}
                    {disabled && <Text style={styles.lockIcon}>🔒</Text>}
                </View>

                <Text style={[
                    styles.text,
                    step.completed && styles.completedText,
                    disabled && styles.disabledText
                ]}>
                    {step.text}
                </Text>
            </TouchableOpacity>

            {step.note ? (
                <View style={styles.noteContainer}>
                    <Text style={styles.noteText}>📝 {step.note}</Text>
                    <TouchableOpacity onPress={() => onAddNote(step.id)} disabled={disabled}>
                        <Text style={[styles.editNoteText, disabled && { color: colors.primary }]}>Edit</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <TouchableOpacity
                    style={styles.addNoteButton}
                    onPress={() => onAddNote(step.id)}
                    disabled={disabled}
                >
                    <Text style={[styles.addNoteText, disabled && { color: colors.textLight }]}>+ Add Note</Text>
                </TouchableOpacity>
            )}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: colors.border,
    },
    stepHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 12,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: colors.primary,
        marginRight: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2,
    },
    checked: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    checkmark: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    lockIcon: {
        fontSize: 12,
    },
    text: {
        fontSize: 16,
        color: colors.text,
        flex: 1,
    },
    completedText: {
        color: colors.text,
    },
    completedContainer: {
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
    },
    noteContainer: {
        marginTop: 10,
        paddingLeft: 36,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    noteText: {
        fontSize: 14,
        color: colors.textLight,
        fontStyle: 'italic',
        flex: 1,
        marginTop: 0
    },
    editNoteText: {
        fontSize: 12,
        color: colors.primary,
        marginLeft: 8,
    },
    addNoteButton: {
        marginTop: 8,
        paddingLeft: 36,
    },
    addNoteText: {
        fontSize: 12,
        color: colors.primary,
        fontWeight: '500',
    },
    disabledText: {
        color: colors.textLight,
    },
    disabledCheckbox: {
        borderColor: colors.textLight,
        backgroundColor: '#eee',
    },
});
