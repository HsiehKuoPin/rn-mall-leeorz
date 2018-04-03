'use strict';
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
    TouchableOpacity,
    Animated,
    Easing,
    Dimensions,
    Platform,
    TextInput,
    DeviceEventEmitter
} from 'react-native';
import {isIphoneX} from "react-native-iphone-x-helper";
import {titleTextColor,mainColor,placeholderTextColor,mainBackgroundColor} from "../constraint/Colors";
import {checkInputIsFloatNumber, checkInputIsNumber, checkInputMoney} from "../common/StringUtil";
import {showToastShort} from "../common/CommonToast";

const {width, height} = Dimensions.get('window');
const navigatorH = 64; // navigator height
const [aWidth, aHeight] = [width, 314];
const [left, top] = [0, 0];
const [middleLeft, middleTop] = [(width - aWidth) / 2, (height - aHeight) / 2 - navigatorH];
export default class SetAmount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            offset: new Animated.Value(0),
            opacity: new Animated.Value(0),
            hide: true,
            title:'',
            valueCustom: 1,
            inputValue:null,
        };
    }

    _onPressConfirm(){
        if(checkInputIsFloatNumber(this.state.inputValue)){
            DeviceEventEmitter.emit('Amount',this.state.inputValue);
            this.dismiss()
        }else{
            showToastShort('您设置的金额有误,请重新输入');
            this.setState({
                inputValue:'',
            })
        }
    }

    render() {
        let data = this.props.data;
        let content = this.state.hide? null:( <View style={[styles.container, ]}>
            <Animated.View style={styles.mask}>
                <Text style={styles.mask} onPress={this.dismiss.bind(this)}/>
            </Animated.View>

            <Animated.View style={
                [styles.tip, {
                    transform: [{
                        translateY: this.state.offset.interpolate({
                            inputRange: [0, 1],
                            outputRange: [height/2, (height/2-60)]
                        }),
                    }]
                }]
            }>
                <View style={{marginHorizontal:10,backgroundColor:'white',borderRadius:5}}>
                    <View style={{flexDirection:'row',marginTop:20,alignItems:'center'}}>
                        <Text style={{color:titleTextColor,fontSize:18,marginLeft:20,marginRight:10}}>{'设置金额:'}</Text>
                        <View style={styles.textInputStyle}>
                            <TextInput
                                underlineColorAndroid='transparent'
                                keyboardType='numeric'
                                style={{
                                    flex: 1,
                                    paddingHorizontal:5,
                                    fontSize: 18,
                                }}
                                autoFocus={true}
                                autoCapitalize="none"
                                maxLength={15}
                                value={this.state.inputValue}
                                onChangeText={(text) => {
                                    this.setState({ inputValue:checkInputMoney(text)})
                                }}
                            />
                        </View>
                    </View>

                    <TouchableOpacity activeOpacity={0.7} style={{backgroundColor:mainColor,margin:20}} onPress={()=> this._onPressConfirm()}>
                        <Text style={{color:'white',paddingVertical:12,textAlign:'center',fontSize:17}}>{'确定'}</Text>
                    </TouchableOpacity>

                </View>
            </Animated.View>
        </View>);
        return content;
    }

    //显示动画
    in() {
        Animated.parallel([
            Animated.timing(this.state.opacity,
                {
                    // easing: Easing.spring,
                    duration: 250,
                    toValue: 0.8,
                }
            ),
            Animated.timing(this.state.offset,
                {
                    // easing: Easing.spring,
                    duration: 250,
                    toValue: 1,
                }
            )
        ]).start();
    }

    //隐藏动画
    out(){
        Animated.parallel([
            Animated.timing(this.state.opacity,
                {
                    // easing: Easing.linear,
                    duration: 0,
                    toValue: 0,
                }
            ),
            Animated.timing(this.state.offset,
                {
                    // easing: Easing.linear,
                    duration: 0,
                    toValue: 0,
                }
            )
        ]).start();

        setTimeout(() => this.setState({hide: true}), 0.00001);
    }

    //取消
    dismiss(event) {
        if(!this.state.hide){
            this.out();
        }
    }

    //选择
    choose(msg) {
        if(!this.state.hide){
            this.out();
        }
    }

    show(title) {
        if(this.state.hide){
            this.setState({hide: false, title: title}, this.in);
        }
    }
}

const styles = StyleSheet.create({
    container: {
        position:"absolute",
        width:width,
        height:height,
        left:left,
        top:top,
        elevation: 5,
    },
    mask: {
        justifyContent:"center",
        backgroundColor:"#383838",
        opacity:0.3,
        position:"absolute",
        width:width,
        height:height,
        left:left,
        top:top,

    },
    tip: {
        width:aWidth,
        height:150,
        left:middleLeft,
        backgroundColor:'transparent'

    },
    textInputStyle:{
        flex:1,
        borderWidth: 0.5,
        borderColor: placeholderTextColor,
        borderRadius: 5,
        height: 40,
        marginRight:20,
        backgroundColor: mainBackgroundColor,
    },

});
