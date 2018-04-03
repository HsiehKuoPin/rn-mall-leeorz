import {
    StyleSheet,Dimensions
} from 'react-native';
import {placeholderTextColor, titleTextColor} from "../constraint/Colors";
let {width,height} = Dimensions.get('window');
export const CommonStyles = StyleSheet.create({
    rightArrowsStyle: {
        marginRight:5,
        width: 9,
        height: 17,
        resizeMode: 'contain',
    },

    titleBarRightImageStyle:{
        resizeMode:'cover',
        width:20,
        height:20,
        position:'relative',
    },
    vline:{
        height:0.5,
        width:width,
        backgroundColor:placeholderTextColor,
    },
    hline:{

    }
});