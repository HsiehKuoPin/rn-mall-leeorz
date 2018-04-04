import React,{Component} from 'react';
import {TouchableOpacity, Platform, Image, View,StyleSheet} from "react-native";
import {ic_top} from "../../resources/index";
import {isIphoneX} from "react-native-iphone-x-helper";
import {SCREEN_HEIGHT, SCREEN_WIDTH} from "../common/AppUtil";

export default class FloatTopBtn extends Component{
    constructor(props){
        super(props);
    }

    static defaultProps={
        onClickTopBtn:null,//function
    }

    render(){
        let {onClickTopBtn} = this.props;
        return <TouchableOpacity
            activeOpacity={1}
            style={{position: 'absolute', marginTop: SCREEN_HEIGHT - 150-(isIphoneX()||Platform.OS === 'android' ?34:0), marginLeft: SCREEN_WIDTH - 65}}
            onPress={() => {
                if(onClickTopBtn)onClickTopBtn();
            }}>
            <View style={styles.container}>
                <Image style={{width: 20 , height: 20,}} source={ic_top}/>
            </View>
        </TouchableOpacity>
    }
}

const styles = StyleSheet.create({
    container:{
        borderRadius: 20,
        backgroundColor: 'white',
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: 'gray',
        shadowOpacity: 0.2,
        shadowOffset: {height: 2, width: 2},
        shadowRadius: 3,
        elevation: 2
    }
});