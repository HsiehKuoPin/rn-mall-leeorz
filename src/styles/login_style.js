import {
    StyleSheet,
    Dimensions
} from 'react-native';
import {
    mainColor,
    titleTextColor,
    content2TextColor,
    placeholderTextColor,
    mainBackgroundColor
} from '../constraint/Colors';

let {
    height: deviceHeight,
    width: deviceWidth,
} = Dimensions.get('window');
const styles = StyleSheet.create({
    background: {
        backgroundColor: 'white',
        flex: 1,
    },
    container: {
        alignItems: 'center',
        position: 'relative',
        flex: 1,
        marginTop: 50,
    },
    login: {
        backgroundColor: mainColor,
        // width: deviceWidth / 1.5,
        width: deviceWidth - 100,
        paddingLeft:8,
        paddingRight:8,
        height: 40,
        marginTop: 25,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5
    },
    register: {
        backgroundColor: mainColor,
        width: deviceWidth / 1.5,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        marginTop: 20,
        marginBottom: 20
    },
    loginLogo: {
        width: 85,
        height: 85,
        alignItems: 'center',
        marginTop: 20,
        resizeMode: 'contain',
        marginLeft: 10,
    },
    loginBackground: {
        width: deviceWidth - 20,
        height: (deviceWidth - 20) / 0.8423,
        justifyContent: 'center',
        alignItems: 'center',
    },
    accountLayout: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginTop: 10,
        paddingLeft:35,
        paddingRight:35,
    },
    inputLayout:{
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 13,
        borderBottomColor: placeholderTextColor,
        paddingBottom: 5,
        borderBottomWidth: 0.5,
    },

    getVerifyCode: {
        backgroundColor: mainColor,
        width: 80,
        borderRadius: 3,
        paddingTop:5,
        paddingBottom:5,
        alignItems: 'center',
        justifyContent: 'center',
        height: 30,
    },
    loginText: {
        color: 'white',
        fontSize: 17
    },
    line: {
        backgroundColor: placeholderTextColor,
        height: 0.5,
        width: deviceWidth / 1.5,
        marginTop: 5,
        marginBottom: 5
    },
    icon: {
        height: 20,
        width: 20,
        resizeMode: 'contain',
    },
    input: {
        fontSize: 14,
        flex: 1,
        marginTop: 5,
        padding: 0,
        marginLeft: 22,
    },
    text: {
        color: content2TextColor,
        marginTop: 10,
        fontSize: 15
    },
    registerLayout: {
        alignItems: 'center',
        flex: 1,
        marginTop: 8,
        paddingLeft:30,
        paddingRight:30,
    },
    resetBackground: {
        width: deviceWidth - 30,
        height: (deviceWidth - 30) / 0.652,
    },
    registerBackground: {
        width: deviceWidth - 30,
        height: (deviceWidth - 30) / 0.652,

    },
    holderText: {
        color: titleTextColor,
        fontSize: 14,
        width:70,
        backgroundColor: '#00000000'
    },
    registerInput: {
        fontSize: 14,
        flex: 1,
        padding:0,
        height:30,
        justifyContent: 'center'
    },
});

module.exports = styles;