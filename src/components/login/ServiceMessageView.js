import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Dimensions
} from 'react-native';

import {isIphoneX} from 'react-native-iphone-x-helper';
var width = Dimensions.get('window').width;
import {content2TextColor, contentTextColor} from '../../constraint/Colors';
import {SERVICE_CALL} from "../../common/AppUtil";
import {APP_NAME, APP_SERVICE_INFO} from "../../constraint/Strings";

export default class ServiceMessageView extends Component {

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.messageText}>{APP_SERVICE_INFO}</Text>
                <View style={styles.messageLine}/>
                <View style={{flexDirection: 'row',}}>
                    <Text style={styles.messageCompany}>@{APP_NAME}商城</Text>
                    {/*<Text style={styles.messagePhone}>{SERVICE_CALL}</Text>*/}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop:20,
        marginBottom: 10
    },
    messageText: {
        color: contentTextColor,
        fontSize: 12
    },
    messageLine: {
        height: 0.3,
        width: width - 60,
        marginTop: 6,
        marginBottom: 6,
        backgroundColor: '#D5DBE5'
    },
    messagePhone: {
        color: content2TextColor,
        fontSize: 12
    },
    messageCompany: {
        color: content2TextColor,
        fontSize: 12,
        marginRight: 10
    },
})