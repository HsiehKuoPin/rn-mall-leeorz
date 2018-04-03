import {
    StyleSheet,Dimensions
} from 'react-native';

import {
    mainColor, mainBackgroundColor, contentTextColor,
    titleTextColor, placeholderTextColor
} from '../constraint/Colors';

export const styles = StyleSheet.create({
    orderInfo: {
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 15,
        flexDirection: 'row'
    },
    orderImg: {
        width: 80,
        height: 80,
        borderColor: placeholderTextColor,
        borderWidth: 0.5,
        borderRadius: 3,
    },
    orderText: {
        color: titleTextColor,
        fontSize: 17,
    },
    orderTime: {
        color: contentTextColor,
        fontSize: 15,
        marginTop: 8
    },
    serviceInfo: {
        margin: 10,
        backgroundColor: 'white',
        borderRadius: 3,
        flex: 1,
        shadowColor: 'gray',
        shadowOffset: {height: 2, width: 2},
        shadowRadius: 3,
        shadowOpacity: 0.2,
        elevation: 2,
        padding: 10
    },
    tipText: {
        color: titleTextColor,
        fontSize: 17,
        paddingVertical: 5,
    },
    type: {
        backgroundColor: mainBackgroundColor,
        alignItems: 'center',
        paddingVertical: 10,
        borderWidth: 0.5,
        borderRadius: 3,
        width: 80,
        marginRight: 15,
    },
    line: {
        height: 0.5,
        backgroundColor: placeholderTextColor,
        marginVertical: 15
    },
    refundText: {
        color: titleTextColor,
        fontSize: 15,
    },
    refundMoney: {
        height: 35,
        width: 120,
        borderColor: placeholderTextColor,
        borderWidth: 0.5,
        backgroundColor: mainBackgroundColor,
        borderRadius: 3,
        paddingLeft: 10,
        marginLeft: 15,
        justifyContent: 'center'
    },
    problemDesc: {
        height: 120,
        borderWidth: 1.0,
        borderColor: placeholderTextColor,
        borderRadius: 3,
        backgroundColor: mainBackgroundColor,
        marginTop: 10,
    },
    inputLayout: {
        paddingLeft: 15,
        fontSize: 14,
        height: 100,
        textAlignVertical: 'top',
        color: titleTextColor,
    },
    commit: {
        backgroundColor: mainColor,
        height: 40,
        alignSelf: 'center',
        justifyContent: 'center',
        width: Dimensions.get('window').width - 120,
        borderRadius: 5,
        marginTop: 25,
        marginBottom: 35
    },
    textInput:{
        width:120,
        borderWidth: 0.5,
        borderColor: placeholderTextColor,
        borderRadius: 3,
        height: 35,
        backgroundColor: mainBackgroundColor,
        marginRight: 15,
        justifyContent: 'center',
        marginLeft:20,
    }
});