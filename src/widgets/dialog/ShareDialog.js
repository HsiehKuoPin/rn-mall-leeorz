import React, {Component} from 'react';
import {
    Modal,
    ActivityIndicator,
    View,
    StyleSheet, Image, Text,
    Dimensions, TouchableOpacity, TouchableWithoutFeedback,
    Animated,
} from 'react-native';
import {ic_qq, ic_qq_zone, ic_wechat, ic_wechat_moment} from "../../constraint/Image";

const {width, height} = Dimensions.get('window');

export default class ShareDialog extends Component {
    constructor(props) {
        super(props);

        this.state = {
            translateY: new Animated.Value(-1),
            visible: false,
        };
        this.platformList = [
            {icon: ic_wechat, name: '微信好友'},
            {icon: ic_wechat_moment, name: '朋友圈'},
            {icon: ic_qq, name: 'QQ好友'},
            {icon: ic_qq_zone, name: 'QQ空间'},
        ]
    }

    in() {
        Animated.parallel([
            Animated.timing(this.state.translateY,
                {
                    // easing: Easing.spring,
                    duration: 300,
                    toValue: 0,
                }
            )
        ]).start();
    }

    show() {
        // this.setState({visible: true});
        this.setState({visible: true}, this.in());
    }

    dismiss() {
        Animated.parallel([
            Animated.timing(this.state.translateY,
                {
                    // easing: Easing.linear,
                    duration: 300,
                    toValue: -1,
                }
            )
        ]).start();

        setTimeout(() => this.setState({visible: false}), 300);
    }


    _getPlatformItem(item, index) {
        return <TouchableOpacity
            style={styles.platformItem}
            key={index}
            activeOpacity={0.7}
                                 onPress={() => {
                                    switch (item.name){
                                        case '微信好友':
                                            if(this.props.onClickWechatBtn){
                                                this.props.onClickWechatBtn();
                                            }
                                            break;
                                        case '朋友圈':
                                            if(this.props.onClickMomentBtn){
                                                this.props.onClickMomentBtn();
                                            }
                                            break;
                                        case 'QQ好友':
                                            if(this.props.onClickQQBtn){
                                                this.props.onClickQQBtn();
                                            }
                                            break;
                                        case 'QQ空间':
                                            if(this.props.onClickQZoneBtn){
                                                this.props.onClickQZoneBtn();
                                            }
                                            break;
                                    }
                                     this.dismiss();
                                 }}>
            <View>
                <Image source={item.icon} style={styles.platformIcon}/>
                <Text style={styles.platformText}>{item.name}</Text>
            </View>
        </TouchableOpacity>
    }


    render() {
        return (
            <Modal
                animationType={"fade"}
                transparent={true}
                onRequestClose={() => {}}
                visible={this.state.visible}
            >
                <TouchableWithoutFeedback
                    onPress={() => this.dismiss()}>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'column',
                            backgroundColor: 'rgba(0,0,0,0.5)',

                        }}>

                        <View style={{flex: 1}}/>
                        <TouchableWithoutFeedback
                            onPress={() => {
                            }}>
                            <Animated.View style={[styles.container, {
                                transform: [{
                                    translateY: this.state.translateY.interpolate({
                                            inputRange: [-1, 0],
                                            outputRange: [height * 0.35, 0]
                                        }
                                    )
                                }]
                            }]}>

                                <Text style={styles.shareTip}>请选择要分享的平台</Text>
                                <View style={styles.platformLayout}>
                                    {this.platformList.map((item, index) => {
                                        return this._getPlatformItem(item, index);
                                    })}
                                </View>

                                <View style={{flex: 1}}/>
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={() => this.dismiss()}>
                                    <View style={styles.btnCancel}>
                                        <Text>取消</Text>
                                    </View>
                                </TouchableOpacity>
                            </Animated.View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: height * 0.35,
        backgroundColor: '#eaedf2',
        justifyContent: 'center',
        alignItems: 'center'
    },
    shareTip: {
        marginTop: 10,
        marginBottom: 20,
        fontSize: 14,
    },
    platformLayout: {
        flexDirection: 'row',
        paddingHorizontal: 10,
    },
    platformItem: {
        flexDirection: 'column',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    platformIcon: {
        height: 50,
        width: 50,
    },
    platformText: {
        marginVertical: 7,
        fontSize: 14,
    },
    btnCancel: {
        width: width * 0.9,
        marginHorizontal: 10,
        marginTop: 20,
        marginBottom: 20,
        height: 35,
        backgroundColor: 'white',
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    }
});
