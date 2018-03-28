import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import List from './components/List';
import Item from './components/Item';
import AddNoteButton from './components/AddNoteButton';
import RemoveNoteButton from './components/RemoveNoteButton';
import { addNote, updateNote, getNotes, removeNote } from './utils/db';

export default class App extends React.Component {
    state = {
        item: {
            content: '',
            createDate: new Date()
        }
    }
    
    selectItem = item => {
        this.setState({ item });
    }
    
    addItem = () => {
        this.setState({ item: {
            content: '',
            createDate: new Date()
        }});
    }
    
    addNote = item => {
        addNote(item).then(item => this.setState({ item }));
    }

   


    render() {
        return (
            <View style={styles.mainContainer}>
                <View style={styles.container}>
                    <Item 
                        item={this.state.item} 
                        addNote={this.addNote}
                        removeNote={this.removeNote}/>
                </View>
                <View style={styles.container}>
                    <List onPress={this.selectItem}/>
                </View>
                <AddNoteButton onPress={this.addItem} />
                <RemoveNoteButton onPress={this.removeItem} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#000',
        marginTop: 25,
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
    },
    container: {
        flex: 1,
        marginTop: 2,
        height: '50%',
        backgroundColor: '#000',
        width: '100%',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    }
});