'use strict';
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
    TouchableOpacity,
    Animated,
    Easing,
    Dimensions,
    Platform
} from 'react-native';
import {isIphoneX} from "react-native-iphone-x-helper";
import {content2TextColor, placeholderTextColor} from "../../../constraint/Colors";
import Stepper from "../../../widgets/Stepper";

const titleBarHeight = 45;
const defaultTop = Platform.OS === 'android' ? ((Platform.Version >= 21) ? 20 : 25) : 20;
const topValue = 44;

const {width, height} = Dimensions.get('window');
const navigatorH = 64; // navigator height
const [aWidth, aHeight] = [width, 195];
const [left, top] = [0, 0];
const [middleLeft, middleTop] = [(width - aWidth) / 2, (height - aHeight) / 2 - navigatorH];

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
        // backgroundColor:"#fff",
        // alignItems:"center",
        // justifyContent:"space-between",
    },
    topView: {
        width: aWidth - 20,
        height: 130,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    txtTile: {
        color: content2TextColor,
        fontSize: 12,
    },
    txtContent: {
        color: '#1884ff',
        fontSize: 18,
    },
    touch: {
        height: 45,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cancel: {
        height: 45,
        margin: 10,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },

});
export default class SelectPhotoDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            offset: new Animated.Value(0),
            opacity: new Animated.Value(0),
            hide: true,
            type: '',
        };
    }

    render() {
        let type = this.state.type;
        let content = this.state.hide ? null : ( <View style={[styles.container,]}>
            <Animated.View style={styles.mask}/>
            <Animated.View style={[styles.tip, {
                transform: [{
                    translateY: this.state.offset.interpolate({
                        inputRange: [0, 1],
                        outputRange: [height, (height - aHeight - (isIphoneX() ? (topValue + titleBarHeight) : (titleBarHeight + defaultTop)))]
                    }),
                }]
            }]}>
                <View style={styles.topView}>
                    <View style={{height: 40, borderRadius: 8, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={styles.txtTile}>请选择相片来源</Text>
                    </View>
                    <View style={{height: 0.5, backgroundColor: placeholderTextColor}}/>
                    <TouchableOpacity
                        onPress={()=>{this.state.type === '' ? this.props.onTakePhotos :this.props.onTakePhotos(this.state.type)}}
                        activeOpacity={0.7}
                        style={styles.touch}>
                        <Text style={styles.txtContent}>拍照</Text>
                    </TouchableOpacity>
                    <View style={{height: 0.5, backgroundColor: placeholderTextColor}}/>
                    <TouchableOpacity
                        onPress={()=>{this.state.type === '' ? this.props.onAlbumChoose : this.props.onAlbumChoose(this.state.type)}}
                        activeOpacity={0.7}
                        style={styles.touch}>
                        <Text style={styles.txtContent}>相册图片</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    onPress={this.dismiss.bind(this)}
                    activeOpacity={0.7}
                    style={styles.cancel}>
                    <Text style={styles.txtContent}>取消</Text>
                </TouchableOpacity>
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

    show() {
        if (this.state.hide) {
            this.setState({hide: false}, this.in);
        }
    }

    show(type) {
        if (this.state.hide) {
            this.setState({hide: false, type: type}, this.in);
        }
    }
}
