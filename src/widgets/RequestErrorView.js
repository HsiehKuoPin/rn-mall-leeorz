import React, {Component} from 'react'
import {Image, View, Text} from "react-native";
import {mainColor, placeholderTextColor} from "../constraint/Colors";
import {failImage} from "../constraint/Image";

/**
 * 错误界面
 */
export default class RequestErrorView extends Component {
    render() {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',backgroundColor:'white'}}>
                <Image style={{width: 180, height: 180, resizeMode: 'contain'}}
                       source={failImage}/>
                <Text style={{fontSize: 15, color: placeholderTextColor, marginTop: 10}}>很抱歉,您访问的页面出错了~~</Text>
                <Text
                    {...this.props} 
                    style={{
                        fontSize: 15,
                        color: mainColor,
                        marginTop:10,
                        width: 100,
                        height: 40,
                        textAlign: 'center',
                        textAlignVertical: 'center'
                    }}
                >点击重试</Text>
            </View>
        );
    }

}
