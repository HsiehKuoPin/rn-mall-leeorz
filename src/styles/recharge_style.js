import {
    StyleSheet,
    Dimensions
} from 'react-native';
import {
    mainColor,
    placeholderTextColor, mainBackgroundColor
} from '../constraint/Colors';

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        marginTop: 10,
        marginHorizontal: 10,
        borderRadius: 5,
        shadowOpacity: 0.2,
        shadowOffset: {height: 2, width: 2},
        shadowRadius: 3,
        elevation: 4
    },
    line: {
        height: 0.5,
        backgroundColor: placeholderTextColor,
        // flex: 1,
        marginTop: 20,
        marginBottom: 15
    },
    inputLayout: {
        fontSize:35,
        flex: 1,
        // marginLeft: 20,
        // height: 70
    },
    inputLine: {
        backgroundColor: placeholderTextColor,
        width: Dimensions.get('window').width - 80,
        height: 0.5,
    },
    recharge: {
        backgroundColor: mainColor,
        height: 40,
        alignSelf: 'center',
        justifyContent: 'center',
        width: Dimensions.get('window').width - 160,
        borderRadius: 5,
        marginTop: 35,
        marginBottom: 50
    },
    symbol: {
        color: 'black',
        fontSize: 20,
        marginBottom: 5,
        marginTop: 15
    },
    paymentContain: {
        backgroundColor: 'white',
        marginTop: 10,
        marginHorizontal: 10,
        borderRadius: 5,
        shadowOpacity: 0.2,
        shadowOffset: {height: 2, width: 2},
        shadowRadius: 3,
        elevation: 2
    },
    inputLayout2: {
        backgroundColor: mainBackgroundColor,
        height: 42,
        marginLeft: 10,
        marginRight: 30,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 0.5,
        borderColor: placeholderTextColor,
        borderRadius: 3
    },
    itemContain: {
        backgroundColor: 'white',
        width: (Dimensions.get('window').width - 80) / 3,
        borderRadius: 3,
        borderWidth: 1,
        height: 55,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        marginTop: 10,
    },
    rightArrowsStyle:{
        width:15,
        height:15,
        resizeMode: 'contain',
        marginRight:10,
        padding:5,
    },
    dropDown: {
        backgroundColor: mainColor,
        height: 40,
        width: 40,
        borderTopRightRadius: 3,
        borderBottomRightRadius: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textCon: {
        flex: 1,
        height: 40,
        backgroundColor: mainBackgroundColor,
        borderRadius: 6,
        borderColor: placeholderTextColor,
        borderWidth: 0.5,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        justifyContent: 'center',
        marginLeft: 10,
    },
})

module.exports = styles;