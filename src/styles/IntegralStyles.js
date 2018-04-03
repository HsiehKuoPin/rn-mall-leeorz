import {
    StyleSheet,
} from 'react-native';
import {contentTextColor, placeholderTextColor} from "../constraint/Colors";
export const IntegralStyles = StyleSheet.create({
    listViewTitleLayoutStyle: {
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        borderRadius: 3,
        alignItems: 'center'
    },
    listViewTitleStyle: {
        fontSize: 15,
        color: contentTextColor,
        flex: 1,
        textAlign: 'center',
        marginTop: 15,
        marginBottom: 15
    },
    transactionLayoutView: {
        backgroundColor:'white',
        marginHorizontal:10,
        flex:1
    },
    verticalLine: {
        height:0.5,
        backgroundColor:placeholderTextColor,
        marginHorizontal:10
    },
    bigTotalNumberStyle:{
        fontSize:35,
        fontWeight: 'bold',
        marginTop:-5,
        backgroundColor:'transparent',
        textAlign:'center',
        color:'white',
    },
    smallTotalNumberStyle:{
        fontSize:25,
        fontWeight: 'bold',
        marginTop:5,
        backgroundColor:'transparent',
        textAlign:'center',
        color:'white',
    },
    totalTextStyle:{
        marginTop:5,
        fontSize:15,
        backgroundColor:'transparent',
        color:'white',
    },
});