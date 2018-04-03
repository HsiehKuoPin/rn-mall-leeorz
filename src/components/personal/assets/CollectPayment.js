import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    TouchableOpacity,
    NativeEventEmitter,
    DeviceEventEmitter,
    NativeModules, ImageBackground, ActivityIndicator
} from 'react-native';
import {
    mainBackgroundColor,
    mainColor,
    titleTextColor,
} from "../../../constraint/Colors";
const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
import TitleBar from '../../../widgets/TitleBar';
import {connect} from 'react-redux';
import SetAmount from '../../../widgets/SetAmount'
import {ic_scan,ic_QRcode} from "../../../constraint/Image";
import {showToastShort} from "../../../common/CommonToast";
import {dealQRCode, getPaymentQRCode} from "../../../common/QRcodeUtil";
import {isIPhone5} from "../../../common/AppUtil";
import {formatMoney} from "../../../common/StringUtil";
import {getHost} from "../../../common/CommonRequest";

const qrcodeLayoutWidth = 200;
const qrcodeLayoutHeight = 300;
const qrcodeViewWidth = 170;
const qrcodeViewMarginTop = 18;
const qrcodeImageWidth = 165;
const qrCodeTipMarginBottom = 25;
const qrCodeTipTextSize = isIPhone5()?14:16;
const ruleTitleTextSize = isIPhone5()?14:18;
const ruleTitleMarginBottom = isIPhone5()?10:20;
const ruleContentTextSize = isIPhone5()?10:14;
const ruleContentTMarginBottom = isIPhone5()?5:10;

class CollectPayment extends Component {

    constructor(props) {
        super(props);
        this.state = {
            inputValue: '0.00',
            isLoadingQRCode:true,
        };
    }

    componentWillMount() {
        if(NativeModules.InteractionModule){
            let eventEmitter = new NativeEventEmitter(NativeModules.InteractionModule);
            this.listener = eventEmitter.addListener('QRCode', (result) => {
                dealQRCode(this.props.dispatch,result, this.props.token, this.props.isRealNameAuth);
            });
        }
    }

    componentDidMount() {
        this.AmountListener = DeviceEventEmitter.addListener('Amount',(money)=>{
            // if(money > 10000){
            //     showToastShort('收付款单笔最多1万,已经将金额调整为10000元');
            //     money = 10000;
            // }else
                if(money > 0 && money < 0.01){
                showToastShort('收付款单笔最少0.01元,请重新输入');
                money = 0.00;
                return;
            }
            this.setState({inputValue:money})
        });

    }

    componentWillUnmount(){
        if(NativeModules.InteractionModule){
            this.AmountListener.remove();
            this.listener.remove();
        }
    }

    render(){
        return (
            <View style={styles.container}>
                <TitleBar title={'收付款'}
                          hideRight={false}
                          onRightViewClick={()=> {NativeModules.InteractionModule.openScanQRCode()}
                          }
                          customRightView={() => (<Image source={ic_scan}
                                                         style={styles.rightBarImageStyle}/>)}
                />

                    <View style={{width:screenW,height:screenH * 0.55,backgroundColor:mainColor,position:'absolute',marginTop:screenH * 0.45}}/>
                    <View style={styles.inputMoneyLayout}>
                            <Text style={styles.inputMoneyTipStyle}>{'收款金额:￥'}</Text>

                            <Text style={styles.inputMoneyStyle}>{formatMoney(this.state.inputValue,false)}</Text>

                            <TouchableOpacity activeOpacity={0.7} style={styles.btnSetMoneyStyle} onPress={() => {this.refs.SetAmount.show()}}>
                                <View style={{backgroundColor:mainColor,borderRadius:3,paddingHorizontal:8,paddingVertical:5,}}>
                                    <Text style={{fontSize:14,color:'white',textAlign:'center'}}>{'设置金额'}</Text>
                                </View>
                            </TouchableOpacity>
                    </View>


                        <View style={{alignItems:'center'}}>
                                <ImageBackground source={ic_QRcode}
                                                 resizeMode='contain'
                                       style={{
                                           width:qrcodeLayoutWidth,
                                           height:qrcodeLayoutHeight,
                                           backgroundColor:'transparent',
                                       }}>
                                        <View style={{
                                            width:qrcodeViewWidth,
                                            height:qrcodeViewWidth,
                                            // padding:5,
                                            marginHorizontal:(qrcodeLayoutWidth - qrcodeImageWidth - 2) / 2,
                                            marginTop:(qrcodeLayoutWidth - qrcodeImageWidth - 2) / 2 + qrcodeViewMarginTop,
                                            alignItems:'center',
                                            justifyContent:'center',
                                            borderWidth:2,borderColor: mainColor}}>

                                            <Image
                                                onLoad={()=>{this.setState({isLoadingQRCode:false})}}
                                                style={{width:qrcodeImageWidth,height:qrcodeImageWidth,position:'absolute'}}
                                                source={{uri:getHost() + 'main/getQRCode?width=300&height=300&content=' + encodeURIComponent(getPaymentQRCode(this.props.userInfo.realName.length > 0 ? this.props.userInfo.realName : this.props.userInfo.name,this.props.userInfo.memberId,this.state.inputValue))}}
                                            />
                                            {this.state.isLoadingQRCode?
                                                <ActivityIndicator
                                                    animating={true}
                                                    size="large"
                                                />:null}


                                        </View>
                                    <View style={{flex:1}}/>
                                    <View style={{marginBottom:qrCodeTipMarginBottom}}>
                                        <Text style={styles.qrCodeTip}>{'扫描二维码'}</Text>
                                        <Text style={styles.qrCodeTip}>{'向二维码账户付款'}</Text>
                                    </View>
                                </ImageBackground>
                        </View>

                        <View style={{backgroundColor:'#00000000'}}>
                            <Text style={styles.ruleTitle}>{'二维码及扫一扫收付规则'}</Text>
                            {/*<Text style={styles.ruleContent}>{'1、收付款单笔最少0.01元，最多1万；一天上线10笔，一天转账总额上线10万'}</Text>*/}
                            <Text style={styles.ruleContent}>{'1、二维码账户为收款方，扫码账号为支付方'}</Text>
                            <Text style={styles.ruleContent}>{'2、二维码配合本APP扫一扫使用，暂不支持跨应用操作'}</Text>
                        </View>

                    <SetAmount ref={'SetAmount'} gotoLogin={() => {this.refs.SetAmount.dismiss();}}/>
                </View>

        )
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: mainBackgroundColor
    },
    rightBarImageStyle:{
        resizeMode:'cover',
        width:20,
        height:20,
        position:'relative',
    },
    inputMoneyLayout:{
        backgroundColor:'white',
        marginTop:10,
        marginHorizontal:10,
        height:100,
        flexDirection:'row',
        borderWidth: 0,
        borderRadius: 5,
        shadowColor: 'gray',
        shadowOffset: {height: 2, width: 2},
        shadowRadius: 5,
        shadowOpacity: 0.2,
        elevation: 4
    },
    inputMoneyTipStyle:{
        color:titleTextColor,
        marginLeft:10,
        marginTop:20,
        fontSize:14,
        backgroundColor:'white',
    },
    inputMoneyStyle:{
        flex:1,
        alignSelf:'flex-end',
        fontSize:30,
        textAlign:'center',
        marginBottom:20,
    },
    btnSetMoneyStyle:{
        marginHorizontal:10,
        alignSelf:'center',
    },
    qrCodeTip:{
        textAlign:'center',
        fontSize:qrCodeTipTextSize,
        marginBottom:3,
        color:titleTextColor
    },
    ruleTitle:{
        width:screenW,
        textAlign:'center',
        fontSize:ruleTitleTextSize,
        color:'white',
        marginBottom:ruleTitleMarginBottom,
    },
    ruleContent:{
        marginLeft:15,
        marginRight:15,
        marginBottom:ruleContentTMarginBottom,
        color:'white',
        fontSize:ruleContentTextSize
    },
});

selector=(state)=>{
    return {
        userInfo:state.userInfoStore.userInfo,
        token: state.loginStore.token,
        isRealNameAuth:state.loginStore.otherConfig.isRealNameAuth,
    }
};
export default connect(selector)(CollectPayment);
