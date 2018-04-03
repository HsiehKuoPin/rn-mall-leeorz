import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    ScrollView,
    TouchableOpacity
} from 'react-native';

import TitleBar from '../../../../widgets/TitleBar';
import {post, getRequestFailTip, isSuccess,} from "../../../../common/CommonRequest"
import {showToastShort} from "../../../../common/CommonToast";
import {titleTextColor, mainBackgroundColor} from "../../../../constraint/Colors";
import {goto} from "../../../../reducers/RouterReducer";
import {connect} from 'react-redux';
import {
    ic_balance_of_payments, ic_bank_card,
    ic_payment_of_payment, ic_personal_background, ic_recharge, ic_right_arrows, ic_roll_out, ic_transfer, ic_webbank,
    ic_withdrawals
} from "../../../../constraint/Image";
import {isIphoneX} from "react-native-iphone-x-helper";
import {updateAsset} from "../../../../reducers/UserInfoReducer";
import {BALANCE_ACCOUNT, COMPANY_BALANCE_ACCOUNT, getAssetTypeName} from "../../../../constraint/AssetsType";
import IntegralStatus from "./module/IntegralStatus";
import {IntegralStyles} from "../../../../styles/IntegralStyles";
import {TotalNumber} from "./module/TotalNumber";
import XImage from '../../../../widgets/XImage';
import BaseComponent from "../../../../widgets/BaseComponent";
import {CommonStyles} from "../../../../styles/CommonStyles";
import {isTrue} from "../../../../common/AppUtil";

const screenW = Dimensions.get('window').width;
class Balance extends BaseComponent {

    constructor(props) {
        super(props);
        this.isRealNameAuth = this.props.isRealNameAuth;
        this.isBindBankCard = this.props.isBindBankCard;
        this.assetType = this.props.navigation.state.params;
        let mouduleArr =
            {
                [BALANCE_ACCOUNT]:[
                    [
                        {
                            ico: ic_withdrawals ,
                            tip: '提现',
                            func: (() => this._gotoTarget({target: 'Withdrawals',params: {assetType: this.assetType}}, isTrue(this.isRealNameAuth), isTrue(this.isBindBankCard)))
                        },
                        {
                            ico: ic_recharge,
                            tip: '充值',
                            func: (() => this._gotoTarget({target: 'RechargeAmount'}, isTrue(this.isRealNameAuth), isTrue(this.isBindBankCard)))
                        },
                        // {
                        //     ico: ic_webbank,
                        //     tip: '网银充值',
                        //     func: (() => this._gotoTarget({target: 'CommonWebView',params:{url:'http://directpay.ejiamall.cn/#/Pay'}}))
                        // }

                    ],
                    [
                        {
                            ico: ic_payment_of_payment,
                            tip: '收付款',
                            func: (() => this._gotoTarget({target: 'CollectPayment'}, isTrue(this.isRealNameAuth)))
                        },
                        {
                            ico: ic_transfer,
                            tip: '转账',
                            func: (() => this._gotoTarget({target: 'TransferAccounts',params: {type: this.assetType}}, isTrue(this.isRealNameAuth)))
                        },
                        {
                            ico: ic_balance_of_payments,
                            tip: '收支明细',
                            func: (() => this._gotoTarget({target: 'PaymentsBalance',params: {assetType: this.assetType}}))
                        },
                        {
                            ico: ic_bank_card,
                            tip: '银行卡管理',
                            func: (() => this._gotoTarget({target: 'BankCard'}, isTrue(this.isRealNameAuth), isTrue(this.isBindBankCard)))
                        },
                    ]
                ],
                [COMPANY_BALANCE_ACCOUNT]:[
                    [
                        {
                            ico: ic_withdrawals,
                            tip: '提现',
                            func: (() => this._gotoTarget({target: 'Withdrawals',params: {assetType: this.assetType}}, isTrue(this.isRealNameAuth), isTrue(this.isBindBankCard)))
                        },
                        // {ico:ic_roll_out,tip:'转出',func:(()=>this._gotoTarget({target:'TurnOut'}))}
                    ],
                    [
                        {
                            ico: ic_balance_of_payments,
                            tip: '收支明细',
                            func: (() => this._gotoTarget({
                                target: 'PaymentsBalance',
                                params: {assetType: this.assetType}
                            }))
                        },
                    ]
                ]
            };

        this.module =  mouduleArr[this.assetType];
    }

    _gotoTarget({target,params={}},isRealNameAuth = true,isBindBankCard = true){
        if(!isRealNameAuth){
            this.props.dispatch(goto('Certification'));
        }else if(!isBindBankCard){
            this.props.dispatch(goto('BindingBankCard'));
        }else{
            this.props.dispatch(goto(target,params));
        }

    }

    componentWillReceiveProps(nextProps){
        this.isRealNameAuth = nextProps.isRealNameAuth;
        this.isBindBankCard = nextProps.isBindBankCard;

        if(this.isResume(nextProps)){
            this._loadAsset();
        }
    }
    componentDidMount() {
        this._loadAsset();
        this.isRefresh = true;
    }

    _loadAsset() {
        let url = this.assetType === BALANCE_ACCOUNT?'user/getBalanceAccount':'user/getCompanyBalanceAccount';
        post(url,{token: this.props.token})
            .then((assetData) => {
                if (isSuccess(assetData)) {
                    this.props.dispatch(updateAsset(this.assetType,assetData.result))
                } else {
                    showToastShort(getRequestFailTip(assetData));
                }
            }).catch((e) => {
                showToastShort(getRequestFailTip());
                console.warn(e.message)
        });
    }


    //获取每个模块
    _getModuleItem=(module,index,length)=> {
        return<View key={index}>
            <TouchableOpacity activeOpacity={0.7} onPress={() => module.func()}>
                <View style={styles.moduleItemStyle}>
                    <Image source={module.ico} style={styles.iconStyle}/>
                    <Text style={styles.cellLibelStyle}>{module.tip}</Text>
                    <Image source={ic_right_arrows} style={CommonStyles.rightArrowsStyle}/>
                </View>
            </TouchableOpacity>
            {(index+1)!==length?<View style={IntegralStyles.verticalLine}/>:null}
        </View>
    };

    _getModule=()=>{
        let moduleArr = [];
        this.module.map((item,index)=>{
            let itemArr = [];
            item.map((module,index)=>itemArr.push(this._getModuleItem(module,index,item.length)));
            moduleArr.push((<View key={index} style={styles.moudleLayoutStyle}>{itemArr}</View>))
        });
        return moduleArr;
    };

    render(){
        let asset = this.props.asset[this.assetType];
        asset = asset?asset:{};
        return (
            <View style={styles.container}>

                    <View style={{height:isIphoneX()?screenW*0.5+25:screenW*0.5}}>
                        <XImage source={ic_personal_background}
                               style={styles.backgroundImageStyle}/>
                        <TitleBar
                                  title={getAssetTypeName(this.assetType)}
                                  customBarStyle={{backgroundColor:'transparent',}}
                        />
                        <TotalNumber total={asset.total} totalTip={getAssetTypeName(this.assetType) + '总额'}/>
                    </View>

                    <IntegralStatus
                        available = {asset.available}
                        availableText = {'可用' + getAssetTypeName(this.assetType)}
                        frozen = {asset.frozen}
                        frozenText = {'冻结' + getAssetTypeName(this.assetType)}
                    />

                    <ScrollView style={{backgroundColor:'transparent',flex:1,marginTop:10}}>
                        {this._getModule()}
                    </ScrollView>

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
        height: isIphoneX()?screenW*0.5+25:screenW*0.5
    },

    moudleLayoutStyle:{
        backgroundColor:'white',
        marginBottom:15,
        marginHorizontal:10,
        width:screenW-20,
        borderRadius:5,
        shadowColor:'gray',
        shadowOffset:{height:2,width:2},
        shadowRadius:3,
        shadowOpacity:0.2,
        elevation: 2,
    },
    moduleItemStyle:{
        flexDirection:'row',
        marginHorizontal:10,
        height:60,
        justifyContent:'center',
        alignItems:'center'
    },
    cellLibelStyle:{
        fontSize:15,
        color:titleTextColor,
        flex:1,
        marginLeft:20,
    },
    iconStyle:{
        width:40,
        height:40,
        resizeMode:'contain',
        marginLeft:10,
        marginVertical:10
    },
});

selector = (state) => {
    return {
        nav:state.nav,
        token: state.loginStore.token,
        isBindBankCard:state.loginStore.otherConfig.isBindBankCard,
        isRealNameAuth:state.loginStore.otherConfig.isRealNameAuth,
        asset:state.userInfoStore.assetInfo,
    }
};
export default connect(selector)(Balance);
