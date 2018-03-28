import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default class AddNoteButton extends React.Component {
    render() {
        return (
            <TouchableOpacity 
                onPress={this.props.onPress} 
                style={styles.button}>
                <MaterialIcons {...iconProps} />
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        top: '40%',
        left: '20%'
    }
});

const iconProps = {
    name: 'remove-circle',
    size: 48,
    color: 'black'
}