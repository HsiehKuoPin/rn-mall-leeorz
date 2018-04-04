import React,{Component} from 'react';
import {Text, TouchableOpacity, StyleSheet, TextInput, View, Image} from "react-native";
import TintImage from "../TintImage";
import {ic_search} from "../../constraint/Image";
import {style_edit_text} from "./style_edit_text";

export default class EditText extends Component{
    constructor(props){
        super(props);
    }

    static defaultProps = {
        editable:true,
        icon:ic_search,
        onClick:null,//function
        customStyle:undefined,
        customTextInputStyle:undefined,
        isTintColor:false,
    };

    render(){
        return this._getContentView();
    }

    _getContentView(){
        let {customTextInputStyle,isTintColor,onClick,icon,placeholder,placeholderTextColor,customStyle} = this.props;
        let customStyles = customStyle?customStyle:style_edit_text._default;
        let contentView = <View style={customStyles}>
            {isTintColor?<TintImage style={{height: 20, width: 20}} source={icon}/>:<Image style={{height: 20, width: 20}} source={icon}/>}
            {onClick?<Text numberOfLines={1}
                                      clearButtonMode={'always'}
                                      underlineColorAndroid={'transparent'}
                                      style={[style_edit_text.textInput,{color:placeholderTextColor}]}
                                      {...this.props}>{placeholder}</Text> :
                <TextInput numberOfLines={1}
                           clearButtonMode={'always'}
                           underlineColorAndroid={'transparent'}
                           style={[style_edit_text.textInput,customTextInputStyle]}
                           {...this.props}/>}
        </View>;

       let result = null;
       if(onClick){
           result = <TouchableOpacity
               style={{flex:1}}
               activeOpacity={0.7}//点击时的透明度
               onPress={
                   ()=>onClick()
               }>
               {contentView}
           </TouchableOpacity>
       }else {
           result = contentView;
       }
       return result;
    }
}