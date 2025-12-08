import { StyleSheet } from 'react-native';

export const colors = {
    primary: '#FF6D1F', // Vibrant Orange
    secondary: '#F5E7C6', // Cream/Beige
    background: '#FAF3E1', // Warm Light Beige
    card: '#FFFFFF', // White cards for contrast
    text: '#222222', // Dark Grey
    textLight: '#666666',
    border: '#F5E7C6', // Use the cream color for borders
    success: '#FF6D1F', // Match primary for consistency
    danger: '#E74C3C',
    warning: '#F1C40F',
};

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 20,
    },
    card: {
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 16,
    },
    button: {
        backgroundColor: colors.primary,
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    input: {
        backgroundColor: colors.card,
        borderRadius: 10,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.border,
        fontSize: 16,
        color: colors.text,
    },
});
