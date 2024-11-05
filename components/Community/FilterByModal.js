import React, { useState } from 'react';
import { Modal, View, Text, Pressable, TextInput, StyleSheet, ScrollView, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const FilterByPopup = () => {
    const [filters, setFilters] = useState([]);

    const toggleFilter = (filter) => {
        if (filters.includes(filter)) {
            setFilters(filters.filter((item) => item !== filter));
        } else {
            setFilters([...filters, filter]);
        }
    };

    const filtersData = [
        { category: 'General novels' },
        { category: 'Romantic novels' },
        { category: 'Fantasy novels' },
        { category: 'Sci-fi novels' },
        { category: 'Adventure novels' },
        { category: 'Detective novels' },
        { category: 'Horror novels' },
        { category: 'Serial novels' },

        { category: 'General cartoons' },
        { category: 'Romantic cartoons' },
        { category: 'Fantasy cartoons' },
        { category: 'Sci-fi cartoons' },
        { category: 'Adventure cartoons' },
        { category: 'Detective cartoons' },
        { category: 'Horror cartoons' },
        { category: 'Serial cartoons' },

        { category: 'Finance and Investment' },
        { category: 'Market Accounting' },
        { category: 'Psychology' },
        { category: 'Self-Development' },
        { category: 'Education' },
        { category: 'Language' },
        { category: 'Law' },
        { category: 'Creative Design' },
        { category: 'Politics' },
        { category: 'Computer Science' },
        { category: 'History' },
        { category: 'Religious Beliefs' },
        { category: 'Pets' },
        { category: 'Health' },
        { category: 'Travel' },
        { category: 'Music and Entertainment' },
        { category: 'Food' },
        { category: 'Art' },
        { category: 'Others' }
    ]

    return (
        <Modal transparent={true} animationType="slide" visible={true}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={[styles.topBar]}>
                        <Text style={{ color: 'black', fontSize: 16, fontWeight: 'bold' }}>Filter By</Text>
                        <Pressable style={[styles.closeButton]} onPress={() => console.log('Close button pressed')}>
                            <MaterialIcons name="close" size={30} color="black" />
                        </Pressable>
                    </View>
                    <ScrollView style={styles.scrollView}>
                        {filtersData.map((filter, index) => (
                            <View key={index} style={styles.filterContainer}>
                                <Pressable
                                    style={[
                                        styles.filterItem,
                                        filters.includes(filter.category) && styles.filterItemSelected
                                    ]}
                                    onPress={() => toggleFilter(filter.category)}
                                >
                                    <Text>{filter.category}</Text>
                                </Pressable>
                            </View>
                        ))}
                    </ScrollView>
                    <View style={styles.bottomBar}>
                        <Pressable onPress={() => console.log('Apply button pressed')} style={[styles.actionButton, { userSelect: 'auto', marginRight: 10 }]}>
                            <Text style={{ color: 'black' }}>Apply</Text>
                        </Pressable>
                        <Pressable onPress={() => console.log('Clear button pressed')} style={[styles.actionButton, { backgroundColor: 'red', userSelect: 'auto' }]}>
                            <Text style={{ color: 'white' }}>Clear</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        width: '80%',
        maxHeight: '80%',
        overflow: 'hidden',
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    closeButton: {
        padding: 10,
        borderRadius: 5,
    },
    scrollView: {
        maxHeight: '80%',
    },
    filterContainer: {
        marginBottom: 20,
    },
    category: {
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'white',
    },
    filterItem: {
        borderWidth: 1,
        borderColor: 'black',
        padding: 10,
        marginBottom: 5,
        borderRadius: 5,
    },
    filterItemSelected: {
        backgroundColor: 'lightblue',
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4542C1',
    },
    actionButton: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 15,
        marginTop: 10,
        alignItems: 'center',
        width: '45%'
    },
});

export default FilterByPopup;