import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    TouchableOpacity,
    Platform,
    StatusBar,
} from 'react-native';

import {
    whiteBackIco,
    shareIco
} from '../constraint/Image';
import {connect} from 'react-redux';
import {mainColor} from '../constraint/Colors';
import {goBack} from '../reducers/RouterReducer';
import {isIphoneX} from 'react-native-iphone-x-helper';
import {ic_arrow_left} from "../../resources/index";

const {width} = Dimensions.get('window');

class TitleBar extends Component {
    constructor(props) {
        super(props);
    }

    static defaultProps = {
        title: "标题",
        onlyTitle: false,
        hideRight: true,
        hideLeft: false,
        customBarStyle: {},
        customBarTextStyle: {},
        customRightView: null,
        customLeftView: null,
        onBackViewClick: null,//function
        onRightViewClick: null,//function
        statusBarBackgroundColor:'black'
        // statusBarBackgroundColor:mainColor
    };

    render() {
        const {customLeftView,dispatch, onBackViewClick, onRightViewClick} = this.props;
        let leftView = (this.props.hideLeft || this.props.onlyTitle) ? null : (

            <View style={styles.leftViewLayout}>
                {customLeftView?customLeftView():
                <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.icoLayout}
                    onPress={() => {
                        if (onBackViewClick) {
                            onBackViewClick();
                        } else {
                            dispatch(goBack());
                        }
                    }}>
                    <Image source={ic_arrow_left} style={styles.backIco}/>
                </TouchableOpacity>}
            </View>
        );
        let rightView = (this.props.onlyTitle || this.props.hideRight) ? null : (
            <View style={styles.rightViewLayout}>
                <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.icoLayout}
                    onPress={onRightViewClick}>
                    {
                        this.props.customRightView ? this.props.customRightView() : (
                            <Image source={{uri: shareIco}} style={styles.backIco}/>
                        )
                    }
                </TouchableOpacity>
            </View>
        );

        return (
            <View style={[styles.header, this.props.customBarStyle]}>
                <StatusBar
                    backgroundColor={this.props.statusBarBackgroundColor}
                    translucent={false}
                    barStyle={'light-content'}
                />
                <View style={styles.titleLayout}>
                    <Text numberOfLines={1} style={[styles.titleText, this.props.customBarTextStyle]}>{this.props.title}</Text>
                </View>
                {leftView}
                {rightView}
            </View>
        );
    }
}

const titleBarHeight = 45;
const defaultTop = Platform.OS === 'android' ? 0 : 20;
// const defaultTop = Platform.OS === 'android' ? ((Platform.Version >= 21) ? 20 : 0) : 20;
const topValue = 44;
const styles = StyleSheet.create({
    header: {
        height: isIphoneX() ? (topValue + titleBarHeight) : (titleBarHeight + defaultTop),
        flexDirection: 'row',
        position: 'relative',
        backgroundColor: mainColor,
    },
    icoLayout: {
        height: titleBarHeight,
        padding: 15,
        justifyContent: 'center',
    },
    backIco: {
        width: 15,
        height: 15,
        resizeMode: 'contain',
    },
    titleLayout: {
        top: isIphoneX() ? topValue : defaultTop,
        position: 'absolute',
        height: titleBarHeight,
        width: width,
        justifyContent: 'center',

    },
    titleText: {
        marginHorizontal:50,
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
    },
    leftViewLayout: {
        top: isIphoneX() ? topValue : defaultTop,
        width: 60,
        position: 'absolute',
        height: titleBarHeight,
        justifyContent: 'center',
    },
    rightViewLayout: {
        top: isIphoneX() ? topValue : defaultTop,
        right: 0,
        position: 'absolute',
        height: titleBarHeight,
        justifyContent: 'center',
    },
    rightText: {
        color: 'black',
        textAlign: 'center',
        fontSize: 15,
    }
});

export default connect()(TitleBar);