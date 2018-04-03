import React, {Component} from 'react';
import {
    ImageBackground,
    View,
    StyleSheet,
    Text,
    TouchableOpacity
} from 'react-native';

import TitleBar from '../../widgets/TitleBar';
import {connect} from 'react-redux';
import {
    ic_serviceCenter_upgrade_iphoneX, ic_serviceCenter_upgrade_other
} from "../../constraint/Image";
import {isIphoneX} from "react-native-iphone-x-helper";
import LoadingView from "../../widgets/LoadingView";
import {goto} from "../../reducers/RouterReducer";
import {isSuccess, post} from "../../common/CommonRequest";
import {showToastShort} from "../../common/CommonToast";
import {showLoadingDialog} from "../../reducers/CacheReducer";
import BaseComponent from "../../widgets/BaseComponent";
import {
    content2TextColor, contentTextColor, mainColor, placeholderTextColor,
    titleTextColor
} from "../../constraint/Colors";
import {formatMoney} from "../../common/StringUtil";
import RequestErrorView from "../../widgets/RequestErrorView";

class UpgradeServiceCenter extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isRequestError: false,
            data: null,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.isResume(nextProps) && this.isUserTokenChange(nextProps)) {
            this._loadServiceCenter();

        }
    }

    componentDidMount() {
        this._loadServiceCenter();
    }

    _loadServiceCenter() {
        post('order/company/getServiceCentre', {token: this.props.token})
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    if (responseData.result.serviceCentre === null)
                    {
                        this.setState({
                            isLoading: false,
                            isRequestError: false,
                        })
                    }
                    else
                    {
                        this.setState({
                            data: responseData.result.serviceCentre,
                            isLoading: false,
                            isRequestError: false,
                        })
                    }

                } else if (this.checkUserTokenValid({response: responseData, title: '您的登录已失效'})) {
                    this._errorMsg(responseData.message);
                }
            })
            .catch((e) => {
                this._errorMsg(e.message);
            });
    }

    _errorMsg(msg) {
        this.setState({
            isLoading: false,
            isRequestError: true,
        });
        showToastShort(msg);
        this.props.dispatch(showLoadingDialog(false))
    }

    render() {
        let showView = this.state.isRequestError ? (
            <RequestErrorView onPress={() => {
                this.setState({isRequestError: false, isLoading: true,});
                this._loadServiceCenter();
            }}/>
        ) :(this.state.isLoading ? <LoadingView/> : <View style={{flex: 1, backgroundColor: '#00000000'}}>
            <View style={{flex: 1}}/>
            <View style={styles.viewStyle}>
                <Text style={styles.titleStyle}>升级服务中心</Text>
                <View style={styles.lineStyle}/>
                <View style={styles.jadeStyle}>
                    <Text
                        style={styles.textStyle}>{this.state.data.accounts[0].accountTypeLabel + '\n' + this.state.data.pays[0].accountTypeLabel}</Text>
                    <Text style={[styles.textStyle, {
                        color: mainColor,
                        marginHorizontal: 20
                    }]}>{formatMoney(this.state.data.accounts[0].amount, false) + '\n' + formatMoney(this.state.data.pays[0].amount, false)}</Text>
                </View>
                <TouchableOpacity disabled={!this.state.data.canBuy}
                                  style={[styles.buttonStyle, {backgroundColor: this.state.data.canBuy ? mainColor : content2TextColor}]}
                                  activeOpacity={0.7} onPress={() => {
                    let itemData = this.state.data;
                    itemData = {...itemData, isMakerSelected: false};
                    this.props.dispatch(goto('MerchantsPaymentDetail', itemData))
                }}>
                    <Text style={{color: 'white', fontSize: 15}}>确认升级</Text>
                </TouchableOpacity>
            </View>
        </View>)
        return (
            <ImageBackground style={styles.container} resizeMode='stretch'
                             onLoad={() => this.setState({isLoading: false})}
                             source={{uri: isIphoneX() ? ic_serviceCenter_upgrade_iphoneX : ic_serviceCenter_upgrade_other}}>
                <TitleBar title={'升级服务中心'} customBarStyle={{backgroundColor: 'transparent'}}/>
                {this.state.isLoading ? <LoadingView/> : showView}
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2'
    },
    viewStyle: {
        backgroundColor: 'white',
        marginHorizontal: 30,
        borderRadius: 8,
        marginBottom: isIphoneX() ? 104 : 35,
    },
    titleStyle: {
        fontSize: 16,
        color: titleTextColor,
        textAlign: 'center',
        marginVertical: 15
    },
    lineStyle: {
        backgroundColor: placeholderTextColor,
        marginHorizontal: 17,
        height: 0.5,
    },
    jadeStyle: {
        flexDirection: 'row',
        marginHorizontal: 35,
        marginVertical: 15
    },
    textStyle: {
        fontSize: 14,
        textAlign: 'left',
        color: contentTextColor,
        lineHeight: 30,
    },
    buttonStyle: {
        backgroundColor: mainColor,
        borderRadius: 5,
        height: 35,
        marginHorizontal: 35,
        marginBottom: 28,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

selector = (state) => {
    return {
        nav: state.nav,
        token: state.loginStore.token,
    }
};

export default connect(selector)(UpgradeServiceCenter);