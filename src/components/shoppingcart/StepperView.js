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
import {ic_minus, ic_minus_disabled, ic_plus, ic_plus_disabled} from "../../../resources/index";

const MINUS = 'minus';
const PLUS = 'plus';
class StepperView extends Component {
    constructor(props){
        super(props);
    }
    static defaultProps = {
        max:100,
        min:1,
        count:1,
    };

    render() {
        let count = this.props.count;
        let isMax = count === this.props.max;
        let isMin = count === this.props.min;
        return (
            <View style={styles.container}>
                <TouchableOpacity activeOpacity={0.7} onPress={() => {
                    this.props.updateCount({action: MINUS, count: this._calculate(MINUS, count)});
                }}>
                    <Image style={styles.imageStyle} source={isMin ? ic_minus_disabled : ic_minus}/>
                </TouchableOpacity>
                <View style={styles.viewLabelStyle}>
                    <Text style={styles.labelStyle}>{count}</Text>
                </View>
                <TouchableOpacity activeOpacity={0.7} onPress={() => this.props.updateCount({action:PLUS,count:this._calculate(PLUS,count)})}>
                    <Image style={styles.imageStyle} source={isMax ? ic_plus_disabled : ic_plus}/>
                </TouchableOpacity>
            </View>
        );
    }

    _calculate(action,count){
        action === 'plus'?count++:count--;
        return count;
    }
}

const styles = StyleSheet.create({
    container:{
        borderWidth: 0.5,
        borderColor: placeholderTextColor,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10
    },
    viewLabelStyle: {
        borderWidth:0.5,
        borderTopWidth: 0,
        borderBottomWidth: 0,
        borderColor: placeholderTextColor,
        minWidth: 28,
        height: 25,
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
        width: 25,
        height: 25,
        resizeMode: 'contain'
    }
});

export default connect()(StepperView);
