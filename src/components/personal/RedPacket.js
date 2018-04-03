import React, {Component} from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Image,
    Text,
    ImageBackground,
    Animated,
    DeviceEventEmitter
} from 'react-native';
import {ic_e, ic_red_packet_border} from '../../constraint/Image'
import {connect} from 'react-redux';
import TitleBar from '../../widgets/TitleBar';
import {goto} from "../../reducers/RouterReducer";

let {width, height} = Dimensions.get('window');
import {mainBackgroundColor, mainColor, contentTextColor} from '../../constraint/Colors';
import {BALANCE_ACCOUNT} from "../../constraint/AssetsType";

class RedPacket extends Component {

    constructor(props) {
        super(props);
        this.state = {
            translateAnimation: new Animated.Value(0),
            bgColor: mainColor,
            hide: false,
        };
        this.redPacketInfo = this.props.navigation.state.params.redPacketInfo;
    }

    componentDidMount() {
        this.loadRedPacket();
        DeviceEventEmitter.emit('REDENVELOPES');
    }

    _titleView() {
        return <View style={{position: 'absolute'}}>
            <TitleBar title={''} customBarStyle={{backgroundColor: 'transparent'}}/>
            <View style={styles.titleBg}/>
            <View style={{width: width, position: 'absolute',}}>
                <TitleBar title={'红包'} customBarStyle={{backgroundColor: 'transparent'}}/>
            </View>
            <View style={{width: width, alignItems: 'center', top: -50}}>
                <Image source={ic_e} resizeMode='contain' style={styles.image}/>
            </View>
        </View>
    }

    loadRedPacket() {
        this.timer = setTimeout(() => {
            this.in();
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    };

    //显示动画
    in() {
        Animated.timing( // 以一个初始速度开始并且逐渐减慢停止。  S=vt-（at^2）/2   v=v - at
            this.state.translateAnimation,
            {
                duration: 650,
                toValue: 0.8,
            }
        ).start();
    }

    render() {
        return (
            <View style={{
                backgroundColor: mainBackgroundColor,
                flex: 1
            }}>
                <ImageBackground source={ic_red_packet_border}
                                 style={{
                                     width: width - 60,
                                     marginTop: width * 0.5,
                                     height: height / 3,
                                     alignSelf: 'center',
                                     backgroundColor: '#00000000',
                                 }} resizeMode={'cover'}>
                    <View style={{alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{
                            fontSize: 35,
                            color: mainColor,
                            textAlignVertical: 'center',
                            top: height / 10
                        }}>
                            {this.redPacketInfo}元
                        </Text>
                        <Text style={{fontSize: 17, color: contentTextColor, top: height / 9}}>恭喜您,红包领取成功</Text>
                        <Text
                            style={{
                                fontSize: 17,
                                color: contentTextColor,
                                top: height / 4 - 40
                            }}>再接再厉，明天记得来领取哦~</Text>
                    </View>
                </ImageBackground>
                <View style={{backgroundColor: mainColor, flex: 1, alignItems: 'center'}}>
                    <TouchableOpacity style={styles.buttonItem} activeOpacity={0.7}
                                      onPress={() => this.props.dispatch(goto('PaymentsBalance',{assetType: BALANCE_ACCOUNT}))}>
                        <Text style={{fontSize: 17, color: 'white'}}>查看余额</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.buttonItem, {marginTop: 30}]} activeOpacity={0.7}
                                      onPress={() => this.props.dispatch(goto('MyRedPacket'))}>
                        <Text style={{fontSize: 17, color: 'white'}}>完成</Text>
                    </TouchableOpacity>
                </View>
                <Animated.View style={[styles.mask, {
                    top: this.state.translateAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1.5 * height]
                    })
                }]}/>
                {this._titleView()}
            </View>
        )
    }
}

const styles = StyleSheet.create({

    titleBg: {
        backgroundColor: mainColor,
        marginTop: -width * 1.85,
        marginLeft: -width / 2,
        width: width * 2,
        height: width * 2,
        borderRadius: width,
        borderWidth: 5,
        borderColor: 'white'
    },
    image: {
        width: 100,
        height: 100
    },
    buttonItem: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        width: width - 120,
        marginTop: 40,
        borderRadius: 3,
        borderWidth: 1,
        borderColor: 'white'
    },
    mask: {
        position: 'absolute', width: width, height: height, top: 0, backgroundColor: mainColor
    },
});

export default connect()(RedPacket)