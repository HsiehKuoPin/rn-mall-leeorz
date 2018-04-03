'use strict';
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Animated,
    Dimensions,
    Platform, FlatList,
    DeviceEventEmitter,
} from 'react-native';
import {
    content2TextColor, contentTextColor, mainColor, placeholderTextColor,
    titleTextColor
} from "../constraint/Colors";

import {ic_cancelPay_cross} from "../constraint/Image";
import XImage from '../widgets/XImage';
import {goto} from "../reducers/RouterReducer";
import IphoneModel from "./IphoneModel";

const {width, height} = Dimensions.get('window');
const navigatorH = 64; // navigator height
const [aWidth, aHeight] = [width, height / 2];
const [left, top] = [0, 0];
const [middleLeft] = [(width - aWidth) / 2, (height - aHeight) / 2 - navigatorH];

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        width: width,
        height: height,
        left: left,
        top: top,
        elevation: 5,
    },
    mask: {
        justifyContent: "center",
        backgroundColor: "#383838",
        opacity: 0.3,
        position: "absolute",
        width: width,
        height: height,
        left: left,
        top: top,
    },
    tip: {
        width: aWidth,
        height: aHeight,
        left: middleLeft,
    },
    topView: {
        height: 270,
        width: aWidth,
        backgroundColor: 'white',
    },
});

export default class ChooseBankCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            offset: new Animated.Value(0),
            opacity: new Animated.Value(0),
            hide: true,
            title: '',
        };
    }

    _keyExtractor = (item, index) => index;

    clickItem(item) {
        DeviceEventEmitter.emit('ChooseBankCard', item)
        this.dismiss()
    }

    gotoBindingBankCard() {
        this.props.dispatch(goto('BindingBankCard'));
        this.dismiss();
    }

    render() {
        let content = this.state.hide ? null : ( <View style={[styles.container,]}>
            <Animated.View style={styles.mask}>
                <Text style={styles.mask} onPress={this.dismiss.bind(this)}/>
            </Animated.View>
            <Animated.View style={[styles.tip, {
                transform: [{
                    translateY: this.state.offset.interpolate({
                        inputRange: [0, 1],
                        outputRange: [height, (Platform.OS === 'android' ? height - 290 : height - 270)]
                    }),
                }]
            }]}>
                <View style={styles.topView}>
                    <View style={{flexDirection: 'row', height: 50, alignItems: 'center'}}>
                        <TouchableOpacity activeOpacity={0.7} onPress={() => {
                            this.dismiss()
                        }}>
                            <XImage source={ic_cancelPay_cross}
                                    style={{marginLeft: 20, width: 15, height: 15, resizeMode: 'contain'}}/>
                        </TouchableOpacity>
                        <Text style={{
                            flex: 1,
                            color: titleTextColor,
                            fontSize: 18,
                            textAlign: 'center',
                            marginRight: 35
                        }}>{'选择银行卡'}</Text>
                    </View>
                    <View style={{height: 0.5, backgroundColor: placeholderTextColor}}/>
                    <FlatList
                        data={this.props.data}
                        numColumns={1}
                        ItemSeparatorComponent={() => <View style={{
                            width: width - 40,
                            marginLeft: 20,
                            height: 0.5,
                            backgroundColor: placeholderTextColor
                        }}/>}
                        keyExtractor={this._keyExtractor}
                        renderItem={({item, index}) => {
                            return (
                                <View>

                                    <TouchableOpacity activeOpacity={0.7} onPress={() => {
                                        this.clickItem(item)
                                    }}>
                                        <View style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            marginTop: 10,
                                            marginBottom: 10
                                        }}>
                                            <XImage uri={item.logoImageUrl} style={{
                                                width: 50, height: 50, resizeMode: 'contain', marginLeft: 20,
                                                borderWidth: 0.5, borderColor: placeholderTextColor, borderRadius: 2
                                            }}/>
                                            <View style={{marginLeft: 30,}}>
                                                <Text style={{
                                                    color: contentTextColor,
                                                    fontSize: 16,
                                                    marginBottom: 10
                                                }}>{item.bankName}</Text>
                                                <Text style={{
                                                    color: content2TextColor,
                                                    fontSize: 16
                                                }}>{this.replaceStr(item.bankCardNo)}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )
                        }}
                    />
                    <TouchableOpacity
                        onPress={() => this.gotoBindingBankCard()}
                        style={{
                            width: width,
                            height: 40,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: mainColor,
                        }}
                        activeOpacity={0.7}>
                        <Text style={{color: '#FFFFFF', fontSize: 18}}>{'新增银行卡'}</Text>
                    </TouchableOpacity>
                    <IphoneModel/>
                </View>

            </Animated.View>
        </View>);
        return content;
    }

    replaceStr(str) {
        let newStr = str.replace(str.substring(4, str.length - 4), '**** ****');
        return newStr;
    }

//显示动画
    in() {
        Animated.parallel([
            Animated.timing(this.state.opacity,
                {
                    // easing: Easing.spring,
                    duration: 450,
                    toValue: 0.8,
                }
            ),
            Animated.timing(this.state.offset,
                {
                    // easing: Easing.spring,
                    duration: 450,
                    toValue: 1,
                }
            )
        ]).start();
    }

    //隐藏动画
    out() {
        Animated.parallel([
            Animated.timing(this.state.opacity,
                {
                    // easing: Easing.linear,
                    duration: 300,
                    toValue: 0,
                }
            ),
            Animated.timing(this.state.offset,
                {
                    // easing: Easing.linear,
                    duration: 300,
                    toValue: 0,
                }
            )
        ]).start();

        setTimeout(() => this.setState({hide: true}), 300);
    }

    //取消
    dismiss(event) {
        if (!this.state.hide) {
            this.out();
        }
    }

    //选择
    choose(msg) {
        if (!this.state.hide) {
            this.out();
        }
    }

    show(title) {
        if (this.state.hide) {
            this.setState({hide: false, title: title}, this.in);
        }
    }
}
