'use strict';
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Animated,
    Dimensions,
    FlatList,
    DeviceEventEmitter, Platform
} from 'react-native';
import {
    placeholderTextColor,
    content2TextColor,
    mainColor,
    mainBackgroundColor,
    contentTextColor
} from "../../../../../constraint/Colors";
import {isIphoneX} from "react-native-iphone-x-helper";

const {width, height} = Dimensions.get('window');
const navigatorH = 64;
const [aWidth, aHeight] = [width, 314];
const [left, top] = [0, 0];
const [middleLeft] = [(width - aWidth) / 2, (height - aHeight) / 2 - navigatorH];

export default class TranscationTypeSelector extends Component {

    constructor(props) {
        super(props);
        this.state = {
            offset: new Animated.Value(0),
            opacity: new Animated.Value(0),
            hide: true,
            selectIndex: null,
        };

        this.actionArr = [
            {name: '入账', operation: 'IN', action: 'operationAction'},
            {name: '出账', operation: 'OUT', action: 'operationAction'},
            {name: '冻结', operation: 'FROZEN', action: 'operationAction'},
            {name: '解冻', operation: 'UNFROZEN', action: 'operationAction'},
            {name: '充值', operation: 'RECHARGE', action: 'operationType'},
            {name: '转账', operation: 'TRANSFER', action: 'operationType'},
            {name: '提现', operation: 'WITHDRAWAL', action: 'operationType'},
            {name: '消费', operation: 'CONSUME', action: 'operationType'},
        ]
    }

    // _keyExtractor = (item, index) => index;

    confirm() {

        if (this.state.selectIndex !== null) {
            DeviceEventEmitter.emit('operation', this.actionArr[this.state.selectIndex]);
        }
        this.dismiss();
    }

    render() {
        let brand = (
            <Text style={styles.priceTextStyle}>{'类别：'}</Text>
        );

        if (this.state.hide) {
            return (<View/>)
        } else {
            return (
                <View style={styles.container}>
                    <Animated.View style={styles.mask}>
                        <Text style={styles.mask} onPress={this.dismiss.bind(this)}/>
                    </Animated.View>

                    <Animated.View style={[styles.tip, {
                        transform: [{
                            translateX: this.state.offset.interpolate({
                                inputRange: [0, 1],
                                outputRange: [height, width / 3]
                            }),
                        }]
                    }]}>

                        <View style={{flex:1,backgroundColor: 'white'}}>
                            <FlatList
                                horizontal={false}
                                 style={{flex: 1,}}
                                keyExtractor={(item, index) => index}
                                data={this.actionArr}
                                ListHeaderComponent={brand}
                                numColumns={3}
                                extraData={this.state.selectIndex}
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                                renderItem={({item, index}) => {
                                    return (
                                        <TouchableOpacity activeOpacity={0.7} key={index} style={{marginLeft: 10,}}
                                                          onPress={() => {
                                                              if (this.state.selectIndex !== index) {
                                                                  this.setState({
                                                                      selectIndex: index,
                                                                  });
                                                              }
                                                          }}>
                                            <Text style={[styles.txtColor, {
                                                color: (this.state.selectIndex === index ? mainColor : contentTextColor),
                                                borderColor: (this.state.selectIndex === index ? mainColor : contentTextColor)
                                            }]}>
                                                {item.name}
                                            </Text>
                                        </TouchableOpacity>
                                    )
                                }
                                }
                            />

                                <TouchableOpacity activeOpacity={0.70} style={{
                                    width: (width / 3) * 2,
                                    backgroundColor: mainColor,
                                    marginBottom:Platform.OS === 'android'?24:isIphoneX()?50:0
                                }} onPress={() => this.confirm()}>
                                    <Text style={styles.determineStyle}>{'确定'}</Text>
                                </TouchableOpacity>
                        </View>
                    </Animated.View>
                </View>
            );
        }
    }

    //显示动画
    in() {
        Animated.parallel([
            Animated.timing(
                this.state.opacity,
                {
                    // easing: Easing.spring,
                    duration: 450,
                    toValue: 0.8,
                }
            ),
            Animated.timing(
                this.state.offset,
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
            Animated.timing(
                this.state.opacity,
                {
                    // easing: Easing.linear,
                    duration: 300,
                    toValue: 0,
                }
            ),
            Animated.timing(
                this.state.offset,
                {
                    // easing: Easing.linear,
                    duration: 300,
                    toValue: 0,
                }
            )
        ]).start();

        setTimeout(
            () => this.setState({hide: true}),
            300
        );
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

    show() {
        if (this.state.hide) {
            this.setState({hide: false}, this.in);
        }
    }
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        width: width,
        height: height,
        left: left,
        top: top,
        elevation: 5
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
        height: height,
        left: middleLeft,
    },
    topView: {
        height: height,
        width: (width / 3) * 2,
        flexDirection: 'row',
        backgroundColor: 'white'
    },
    txtColor: {
        backgroundColor: '#f3f3f3',
        borderColor: '#c7c7c7',
        marginTop: 10,
        textAlign: 'center',
        width: (((width / 3) * 2) - 40) / 3,
        borderRadius: 3,
        borderWidth: 0.5,
        fontSize: 14,
        paddingVertical: 10,
    },

    priceTextStyle: {
        fontSize: 16,
        marginLeft: 20,
        marginTop: isIphoneX() ? 88 : 64,
        color: content2TextColor
    },
    resetStyle: {
        color: mainColor,
        fontSize: 20,
        textAlign: 'center',
        paddingVertical: 15
    },
    determineStyle: {
        color: 'white',
        fontSize: 20,
        textAlign: 'center',
        // paddingVertical: 15
        marginVertical:15
    },
    textInputStyle: {
        borderWidth: 1.0,
        borderColor: placeholderTextColor,
        borderRadius: 5,
        height: 35,
        width: width * 0.193,
        marginLeft: 10,
        marginTop: 10,
        backgroundColor: mainBackgroundColor
    }
});