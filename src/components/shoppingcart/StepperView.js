import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
    TouchableOpacity
} from 'react-native';

import {mainBackgroundColor, placeholderTextColor, titleTextColor} from "../../constraint/Colors";
import {ic_addButton, ic_un_reduceButton, ic_un_addButton, ic_reduceButton} from "../../constraint/Image";
import connect from "react-redux/es/connect/connect";

class StepperView extends Component {

    render() {
        // console.warn(JSON.stringify(this.props.data));
        let count = (this.props.data === undefined) ? 1 : this.props.data.quantity;
        let unAdd = false;
        let unReduce = false;
        if (this.props.data) {
            if (this.props.data.quantity === 1) {
                unReduce = true;
            } else if (this.props.data.quantity === this.props.data.stock) {
                unAdd = true;
            }
        }
        return (
            <View style={{flexDirection: 'row', justifyContent: 'center', marginRight: 10}}>
                <TouchableOpacity activeOpacity={0.7} onPress={() => this.props.updateCount('minus')}>
                    <Image
                        style={styles.imageStyle}
                        source={unReduce ? ic_un_reduceButton : ic_reduceButton}/>
                </TouchableOpacity>
                <View style={styles.viewLabelStyle}>
                    <Text style={styles.labelStyle}>{count}</Text>
                </View>
                <TouchableOpacity activeOpacity={0.7} onPress={() => this.props.updateCount('plus')}>
                    <Image
                        style={styles.imageStyle}
                        source={unAdd ? ic_un_addButton : ic_addButton}/>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    viewLabelStyle: {
        backgroundColor: mainBackgroundColor,
        borderRadius: 3,
        borderWidth: 0.8,
        borderColor: placeholderTextColor,
        minWidth: 35,
        height: 30,
        marginLeft: 8,
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    labelStyle: {
        fontSize: 14,
        color: titleTextColor,
        paddingLeft: 5,
        paddingRight: 5,
        textAlign: 'center'
    },
    imageStyle: {
        width: 30,
        height: 30,
        resizeMode: 'contain'
    }
});

export default connect()(StepperView);
