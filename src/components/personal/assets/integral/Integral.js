import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions, TouchableOpacity,
} from 'react-native';

import TitleBar from '../../../../widgets/TitleBar';
import {showToastShort} from "../../../../common/CommonToast";
import {post, getRequestFailTip,isSuccess} from '../../../../common/CommonRequest';

import {connect} from 'react-redux';
import {
    ic_personal_background,
} from "../../../../constraint/Image";
import {mainBackgroundColor, mainColor} from "../../../../constraint/Colors";

const screenW = Dimensions.get('window').width;
import {isIphoneX} from "react-native-iphone-x-helper";
import IntegralStatus from "./module/IntegralStatus";
import {updateAsset} from "../../../../reducers/UserInfoReducer";
import {
    GENERAL_INTEGRAL_ACCOUNT, getAssetTypeName, JADE_INTEGRAL_ACCOUNT, K_INTEGRAL_ACCOUNT, PLATINUM_INTEGRAL_ACCOUNT,
    SPECIAL_INTEGRAL_ACCOUNT, COMPANY_BALANCE_ACCOUNT, CONSUMER_INTEGRAL_ACCOUNT, CONSUMER_COUPON_ACCOUNT,
    ENTREPRENEURSHIP_COUPON_ACCOUNT
} from "../../../../constraint/AssetsType";
import {IntegralStyles} from "../../../../styles/IntegralStyles";
import {TotalNumber} from "./module/TotalNumber";
import TransactionHistoryList from "./module/TransactionHistoryList";
import XImage from '../../../../widgets/XImage';
import {goto} from "../../../../reducers/RouterReducer";
import {isTrue} from "../../../../common/AppUtil";
import IphoneModel from "../../../../widgets/IphoneModel";
import BaseComponent from "../../../../widgets/BaseComponent";

// {assetType:类型}
class Integral extends BaseComponent {
    constructor(props) {
        super(props);

        this.assetType = this.props.navigation.state.params.assetType
        this.assetName = getAssetTypeName(this.assetType);

    }

    componentDidMount() {
        this._loadIntegralAccount();
    }

    componentWillReceiveProps(nextProps){

        if(this.isResume(nextProps)){
            this._loadIntegralAccount();
        }
    }

    _loadIntegralAccount(){
        let url = 'user/';
        switch(this.assetType) {
            case CONSUMER_COUPON_ACCOUNT:url += 'getConsumerCouponAccount';break;
            case ENTREPRENEURSHIP_COUPON_ACCOUNT:url += 'getEntrepreneurshipCouponAccount';break;
            case PLATINUM_INTEGRAL_ACCOUNT:url += 'getPlatinumIntegralAccount';break;
            case JADE_INTEGRAL_ACCOUNT:url += 'getJadeIntegralAccount';break;
            case GENERAL_INTEGRAL_ACCOUNT:url += 'getGeneralIntegralAccount';break;
            case SPECIAL_INTEGRAL_ACCOUNT:url += 'getSpecialIntegralAccount';break;
            case K_INTEGRAL_ACCOUNT:url += 'getKIntegralAccount';break;
            case CONSUMER_INTEGRAL_ACCOUNT:url += 'getConsumerIntegralAccount';break;
        }

        post(url, {token: this.props.token})
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    this.props.dispatch(updateAsset(this.assetType,responseData.result))
                } else {
                    showToastShort(getRequestFailTip(responseData));
                }
            }).catch((e) => {
            showToastShort(getRequestFailTip());
            console.warn(e.message);
        });
    }


    _renderTitleBar(asset){
        return <TitleBar
            title={this.assetName}
            customBarStyle={{backgroundColor: 'transparent',}}
            hideRight={!asset.isTransferQualification}
            customRightView={() => (<Text style={{color: 'white', fontSize: 15}}>转账</Text>)}
            onRightViewClick={() => this.props.dispatch(goto(!isTrue(this.props.isRealNameAuth) ? 'Certification' : 'TransferAccounts', {type: this.assetType}))}
        />;
    }

    _renderRechargeBtn(){
        let asset = this.props.assetInfo[this.assetType];
        if(this.assetType === PLATINUM_INTEGRAL_ACCOUNT){
            return this._getRechargeBtn(asset,this.assetName + '充值');
        }else if(this.assetType === ENTREPRENEURSHIP_COUPON_ACCOUNT && asset.isRechargePrivileges){
            return this._getRechargeBtn(asset,'申请创业补贴');
        }
    }

    _getRechargeBtn(asset,btnText){
        return <View>
            <TouchableOpacity
                activeOpacity={0.7}
                style={{
                    backgroundColor: mainColor,
                    height: 40,
                    marginTop: -20,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                onPress={() => {
                    if(this.assetType === PLATINUM_INTEGRAL_ACCOUNT){
                        this.props.dispatch(goto(!isTrue(this.props.isRealNameAuth) ? 'Certification' : 'PlatinumRecharge'))
                    }else if(this.assetType === ENTREPRENEURSHIP_COUPON_ACCOUNT && asset.isRechargePrivileges){
                        if(!isTrue(this.props.isRealNameAuth)){
                            this.props.dispatch(goto('Certification'));
                        }else{
                            this.props.dispatch(goto('EntrepreneurshipCouponRecharge',{assetType:this.assetType}));
                        }
                    }
                }}>
                <Text style={{fontSize: 17, color: 'white', textAlign: 'center',}}>{btnText}</Text>
            </TouchableOpacity>
            <IphoneModel/>
            </View>
    }



    render() {
        let asset = this.props.assetInfo[this.assetType];
        return (
            <View style={styles.container}>
                <View style={{height:isIphoneX()?screenW*0.5+25:screenW*0.5}}>
                    <XImage source={ic_personal_background}
                            style={styles.backgroundImageStyle}/>
                    {this._renderTitleBar(asset)}
                    <TotalNumber total={asset.total} totalTip={`${this.assetName}总额`}/>
                </View>

                <IntegralStatus
                     available = {asset.available}
                     availableText = {`可用${this.assetName}`}
                     frozen = {asset.frozen}
                     frozenText = {`冻结${this.assetName}`}
                />

                <View style={styles.ViewStyle}>
                    <View style={IntegralStyles.transactionLayoutView}>
                        {/*<View style={IntegralStyles.listViewTitleLayoutStyle}>*/}
                            {/*<Text style={IntegralStyles.listViewTitleStyle}>{'时间'}</Text>*/}
                            {/*<Text style={IntegralStyles.listViewTitleStyle}>{this.assetName}</Text>*/}
                            {/*<Text style={IntegralStyles.listViewTitleStyle}>{'备注'}</Text>*/}
                        {/*</View>*/}
                        {/*<View style={IntegralStyles.verticalLine}/>*/}

                        <View style={{backgroundColor: 'white', paddingBottom:10,flex:1}}>
                            <TransactionHistoryList token={this.props.token} type={this.assetType}/>
                        </View>
                    </View>
                </View>
                {this._renderRechargeBtn()}
            </View>
        )
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: mainBackgroundColor
    },

    backgroundImageStyle:{
        resizeMode:'cover',
        position:'absolute',
        width:screenW,
        // height:(isIphoneX()?(screenW*480)/750+25:(screenW*480)/750),
        height: isIphoneX()?screenW*0.5+25:screenW*0.5
    },

    ViewStyle:{
        backgroundColor:'white',
        marginTop:10,
        flex:1,
        marginBottom: isIphoneX() ? 44 : 10,
        borderRadius:3,
        marginLeft:10,
        marginRight:10
    },

    intergralView: {
        backgroundColor:'white',
        marginHorizontal:10,
        flex:1
    },

    numberStyle:{
        fontSize:35,
        fontWeight: 'bold',
        marginTop:-5,
        backgroundColor:'transparent',
        textAlign:'center',
        color:'white',
    },
});

selector = (state) => {
    return {
        token: state.loginStore.token,
        nav:state.nav,
        assetInfo: state.userInfoStore.assetInfo,
        isRealNameAuth:state.loginStore.otherConfig.isRealNameAuth,
    }
};

export default connect(selector)(Integral);
