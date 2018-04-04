import React, {Component} from 'react';
import {
    StyleSheet,
    ScrollView,
    Dimensions,
    Platform,
    View,
    TouchableOpacity,
    Image,
    Text
} from 'react-native';

import {connect} from 'react-redux';
import HeadView from './widget/HeadView';
import OrderView from './widget/OrderView';
import MyAssetView from './widget/MyAssetView';
import ModuleView from './widget/ModuleView';
import {mainBackgroundColor, mainColor, placeholderTextColor} from '../../../../constraint/Colors';
import {post, getRequestFailTip, isSuccess} from '../../../../common/CommonRequest';
import {showToastShort} from '../../../../common/CommonToast';
import {saveUser} from '../../../../reducers/UserInfoReducer';
import {goto} from "../../../../reducers/RouterReducer";
import {isIphoneX} from "react-native-iphone-x-helper";
import {ic_qr_code, ic_setting} from "../../../../constraint/Image";
import ScanRegistration from '../../../../widgets/ScanRegistration'
import BaseComponent from "../../../../widgets/BaseComponent";
import RedPacketDialog from '../../../../widgets/RedPacketDialog'
import ServiceMessageView from '../../../login/ServiceMessageView';

let {width} = Dimensions.get('window');

class PersonalIndex extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            redPacketInfo: {}
        };
        this.updateFlag = 0;
    }

    _titleView() {
        return <View>
            <View style={styles.titleBg}/>
            <View style={styles.titleLayout}>
                <Text style={styles.title}>我的</Text>
            </View>
            <View style={{
                flexDirection: 'row',
                position: 'absolute',
                top: (isIphoneX() ? 55 : Platform.OS === 'android' ? 15 : 30),
                right: 0
            }}>
                <TouchableOpacity activeOpacity={0.7} onPress={() => this.props.dispatch(goto('Setting'))}>
                    <Image
                        source={ic_setting}
                        resizeMode='contain' style={styles.setting}/>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.7}
                                  onPress={() => {
                                      this.refs.ScanRegistration.show()
                                  }}
                >
                    <Image
                        source={ic_qr_code}
                        resizeMode='contain' style={styles.setting}/>
                </TouchableOpacity>
            </View>
        </View>
    }

    render() {
        let showView = (
            <ScrollView style={styles.contentContainer}>
                {this._titleView()}
                <View style={styles.topContainer}>
                    <HeadView userInfo={this.props.userInfo}/>
                    <View style={styles.line}/>
                    <OrderView userInfo={this.props.userInfo}/>
                </View>
                <MyAssetView userInfo={this.props.userInfo}/>
                <ModuleView/>
                <ServiceMessageView/>
            </ScrollView>
        );
        return (
            <View style={{flex: 1, backgroundColor: mainBackgroundColor}}>
                {showView}
                <ScanRegistration
                    memberId={this.props.userInfo.memberId}
                    ref={'ScanRegistration'}
                />
                <RedPacketDialog
                    token={this.props.token}
                    redPacketInfo={this.state.redPacketInfo !== undefined ? this.state.redPacketInfo.amount : ''}
                    dispatch={this.props.dispatch}
                    ref={'RedPacketDialog'}
                />
            </View>
        )
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.updateFlag !== this.updateFlag) {
            this.loadUserInfo();
            this.updateFlag = nextProps.updateFlag;
        }
    }

    loadUserInfo() {
        post('user/self', {token: this.props.token})
            .then((response) => {
                if (isSuccess(response)) {
                    this.props.dispatch(saveUser(response.result))
                } else if (this.checkUserTokenValid({response, title: '您的登录已失效'})) {
                    showToastShort(getRequestFailTip(response));
                }
            }).catch((e) => {
            showToastShort(getRequestFailTip());
            console.warn(e.message)
        });
        post('main/getRedPackageOfUnclaimed', {token: this.props.token})
            .then((responseData) => {
                if (isSuccess(responseData) && responseData.result !== null && responseData.result !== "") {
                    this.refs.RedPacketDialog.showDialog();
                    this.setState({redPacketInfo: responseData.result})
                } else if (this.checkUserTokenValid({responseData, title: '您的登录已失效'})) {
                    // showToastShort(getRequestFailTip(responseData));
                }
            }).catch((e) => {
            showToastShort(getRequestFailTip());
            console.warn(e.message)
        });
    }

}

const styles = StyleSheet.create({
    contentContainer: {
        backgroundColor: mainBackgroundColor,
        flex: 1,
    },
    setting: {
        width: 25,
        height: 25,
        marginRight: 10,
    },
    titleLayout: {
        flex: 1,
        width: width,
        position: 'absolute',
        top: (isIphoneX() ? 55 : Platform.OS === 'android' ? 15 : 30),
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        color: 'white',
        backgroundColor: '#00000000',
        alignItems: 'center',
        height: 50,
        textAlign: 'center',
        fontSize: 18
    },
    titleBg: {
        backgroundColor: mainColor,
        marginTop: -width * 1.6,
        marginLeft: -width / 2,
        width: width * 2,
        height: (isIphoneX() ? width * 2 + 24 : width * 2),//width * 2,
        borderRadius: width,
    },
    topContainer: {
        backgroundColor: 'white',
        // flex: 1,
        // position:'absolute',
        // top:80,
        marginTop: -width * 0.4 + (Platform.OS === 'android' ? 50 : (isIphoneX() ? 70 : 64)),
        marginHorizontal: 10,
        borderRadius: 5,
        shadowColor: 'gray',
        shadowOpacity: 0.2,
        shadowOffset: {height: 2, width: 2},
        shadowRadius: 3,
        elevation: 2
    },
    line: {
        backgroundColor: placeholderTextColor,
        height: 0.5,
    }
});

selector = (state) => {
    return {
        token: state.loginStore.token,
        userInfo: state.userInfoStore.userInfo,
        updateFlag: state.cacheStore.updateFlag,
    }
};
export default connect(selector)(PersonalIndex);