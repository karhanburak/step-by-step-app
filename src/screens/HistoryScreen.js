import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, globalStyles } from '../styles/theme';
import { useIsFocused } from '@react-navigation/native';

export default function HistoryScreen({ navigation }) {
    const [tasks, setTasks] = useState([]);
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            loadTasks();
        }
    }, [isFocused]);

    const loadTasks = async () => {
        try {
            const tasksJson = await AsyncStorage.getItem('tasks');
            if (tasksJson) {
                setTasks(JSON.parse(tasksJson).reverse()); // Show newest first
            }
        } catch (e) {
            console.error(e);
        }
    };

    const renderItem = ({ item }) => {
        const completedCount = item.steps.filter(s => s.completed).length;
        const totalCount = item.steps.length;
        const progress = totalCount > 0 ? completedCount / totalCount : 0;

        return (
            <TouchableOpacity
                style={styles.taskCard}
                onPress={() => navigation.navigate('Steps', { taskData: item })}
            >
                <View style={styles.cardHeader}>
                    <Text style={styles.taskTitle}>{item.taskTitle}</Text>
                    <Text style={styles.date}>
                        {new Date(item.createdAt).toLocaleDateString()}
                    </Text>
                </View>

                <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
                    </View>
                    <Text style={styles.progressText}>
                        {completedCount}/{totalCount} completed
                    </Text>
                </View>
            </TouchableOpacity >
        );
    };

    return (
        <View style={globalStyles.container}>
            {tasks.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>No saved tasks yet.</Text>
                </View>
            ) : (
                <FlatList
                    data={tasks}
                    keyExtractor={item => item.id || Math.random().toString()}
                    renderItem={renderItem}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    taskCard: {
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    taskTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
        flex: 1,
    },
    date: {
        fontSize: 12,
        color: colors.textLight,
    },
    progressContainer: {
        marginTop: 8,
    },
    progressBar: {
        height: 6,
        backgroundColor: colors.border,
        borderRadius: 3,
        marginBottom: 6,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: colors.success,
    },
    progressText: {
        fontSize: 12,
        color: colors.textLight,
        textAlign: 'right',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: colors.textLight,
    },
});
