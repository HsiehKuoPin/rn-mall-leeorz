import React,{Component} from 'react';
import {Image,StyleSheet} from "react-native";
import {ic_checkbox, ic_checkbox_selected} from "../../../resources/index";
import TintImage from "../TintImage";

export default class CheckBox extends Component{
    static defaultProps = {
        isCheck:false,
    };
    render(){
        return <TintImage
            source={this.props.isCheck ? ic_checkbox_selected : ic_checkbox}
            {...this.props}
            style={[styles.checkBox,this.props.style]}/>
    }


}

const styles = StyleSheet.create({
    checkBox:{
        width: 20,
        height: 20,
        marginRight: 5,
        marginTop: 2,
        resizeMode: 'contain'
    }
});