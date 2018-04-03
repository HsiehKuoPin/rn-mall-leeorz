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
    Modal,
} from 'react-native';
import {
    contentTextColor, placeholderTextColor,
    titleTextColor
} from "../../../../../constraint/Colors";

import {ic_cancelPay_cross} from "../../../../../constraint/Image";
import XImage from '../../../../../widgets/XImage';

const {width, height} = Dimensions.get('window');
const [aWidth, aHeight] = [width, height / 2];

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        elevation: 5,
    },
    tip: {
        width: aWidth,
        height: aHeight,
        backgroundColor: 'pink'
    },
    topView: {
        height: aHeight,
        width: aWidth,
        backgroundColor: 'white',
    },
});

export default class CarTypeDialog extends Component {
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

    render() {
        let content = this.state.hide ? null : ( <View style={[styles.container,]}>
            <Modal
                transparent={true}
                visible={this.state.isVisible}
                animationType={'fade'}
                onRequestClose={() => {
                }}>
                <TouchableOpacity style={styles.container} activeOpacity={1} onPress={this.dismiss.bind(this)}>
                    <Animated.View style={[styles.tip, {
                        transform: [{
                            translateY: this.state.offset.interpolate({
                                inputRange: [0, 1],
                                outputRange: [height, (height - aHeight)]
                            }),
                        }]
                    }]}>
                        <View style={styles.topView}>
                            <View style={{flexDirection: 'row', height: 50, alignItems: 'center'}}>
                                <TouchableOpacity activeOpacity={0.7} onPress={() => {
                                    this.dismiss()
                                }}>
                                    <XImage source={ic_cancelPay_cross}
                                            style={{marginLeft: 20, width: 10, height: 10, resizeMode: 'contain'}}/>
                                </TouchableOpacity>
                                <Text style={{
                                    flex: 1,
                                    color: titleTextColor,
                                    fontSize: 15,
                                    textAlign: 'center',
                                    marginRight: 35
                                }}>{'选择汽车型号'}</Text>
                            </View>
                            <View style={{
                                marginLeft: 15,
                                marginRight: 15,
                                height: 0.5,
                                backgroundColor: placeholderTextColor
                            }}/>
                            <FlatList
                                data={this.props.data}
                                numColumns={1}
                                ItemSeparatorComponent={() => <View style={{
                                    marginLeft: 15,
                                    marginRight: 15,
                                    height: 0.5,
                                    backgroundColor: placeholderTextColor
                                }}/>}
                                keyExtractor={this._keyExtractor}
                                renderItem={({item, index}) => {
                                    return (
                                        <View>
                                            <TouchableOpacity activeOpacity={0.7} onPress={() => {
                                                this.dismiss()
                                                this.props.selectItem(item)
                                            }}>
                                                <View style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    marginVertical: 10
                                                }}>
                                                    <XImage uri={item.imgUrl}
                                                            style={{
                                                                width: 50,
                                                                height: 50,
                                                                marginLeft: 20
                                                            }}/>
                                                    <View style={{marginLeft: 30,}}>
                                                        <Text style={{
                                                            color: contentTextColor,
                                                            fontSize: 16,
                                                            marginBottom: 10
                                                        }}>{item.productName}</Text>
                                                        {/*<Text style={{color:content2TextColor,fontSize:16}}>{this.replaceStr(item.bankCardNo)}</Text>*/}
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                }}
                            />
                        </View>
                    </Animated.View>
                </TouchableOpacity>
            </Modal>
        </View>);
        return content;
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
