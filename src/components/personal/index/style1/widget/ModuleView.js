import React, {Component} from 'react';
import {
    Image,
    Text,
    View,
    StyleSheet,
    Linking,
    FlatList,
    Platform,
    TouchableOpacity,
    Dimensions,
} from 'react-native';

import {titleTextColor} from '../../../../../constraint/Colors';
import {goto} from '../../../../../reducers/RouterReducer';
import {clearToken, saveToken} from '../../../../../reducers/LoginReducer';
import {clearUser} from '../../../../../reducers/UserInfoReducer';
import {clearShoppingCartProductTotalCount,clearShoppingCart} from '../../../../../reducers/ShoppingCartReducer';
import {
    ic_custom, ic_about_us, ic_my_recommand, ic_collect,
    ic_address, ic_exit, ic_money, ic_store, ic_n_member, ic_recharge_center, ic_red_packet, ic_history_order,
    ic_msg_identity, ic_manager, ic_store_manager
} from "../../../../../constraint/Image";
import {connect} from "react-redux";
import {showToastShort} from "../../../../../common/CommonToast";
import TipDialog from "../../../../../widgets/dialog/TipDialog";
import {getAgentLink, isTrue, SERVICE_CALL} from "../../../../../common/AppUtil";
import {getRequestFailTip, isSuccess, post} from "../../../../../common/CommonRequest";
import TintImage from "../../../../../widgets/TintImage";

class ModuleView extends Component {
    constructor(props) {
        super(props);
        let {dispatch} = this.props;
    }

    getModulesList(){
        let {dispatch,userInfo} = this.props;
        return [
            {img: ic_my_recommand, name: '创友圈',func:()=>{dispatch(goto('MyRecommendation'))}},
            {img: ic_red_packet, name: '红包',func:()=>{dispatch(goto('MyRedPacket'))}},
            {img: ic_history_order, name: '历史订单',func:()=>{this._gotoHistoryOrderList()}},
            {img: ic_about_us, name: '开店赚钱',func:()=>{
                if (isTrue(this.props.isRealNameAuth)) {
                    this.props.dispatch(goto('MerchantsIndex'));
                } else {
                    this.props.dispatch(goto('Certification'));
                }
            }},
            {img: ic_address, name: '收货地址',func:()=>{dispatch(goto('AddressList',{isSelectAddress:false}))}},
            {img: ic_recharge_center, name: '充值中心',func:()=>{dispatch(goto('RechargeCenter'))}},
            this.props.userInfo.isAgent ? {
                img: ic_manager, name: '服务中心', func: () => {
                    if(this.props.userInfo.isServiceCenter){
                        this.props.dispatch(goto('UpgradeServiceCenter'));
                    }else{
                        dispatch(goto('CommonWebView', {url: getAgentLink(), injectedParams: {isAgent: true}}))
                    }
                }
            } : null,
            this.props.userInfo.isMerchant ? {img: ic_store_manager, name: '店主管理', func: () => {dispatch(goto('CommonWebView', {url: getAgentLink(),injectedParams:{isAgent:false}}))}} : null,
            {img: ic_n_member, name: 'N+会员',func:()=>{dispatch(goto('RichMore'))}},
            {img: ic_collect, name: '我的收藏',func:()=>{dispatch(goto('CollectList'))}},
            {img: ic_msg_identity, name: '信息认证',func:()=>{
                if (isTrue(this.props.isRealNameAuth)) {
                    dispatch(goto('RealAuthInfo'));
                } else {
                    dispatch(goto('Certification'));
                }
            }},
            // {img: ic_custom, name: '联系客服',func:()=>{dispatch(goto('CommonWebView',{url:`https://webchat.7moor.com/wapchat.html?clientId=${userInfo.memberId}&accessId=10612020-2cba-11e8-b2a5-39f27a77cc15&fromUrl=&urlTitle=`}))}},
            {img: ic_custom, name: '联系客服',func:()=>{this.refs.CallDialog.showDialog()}},
        ]
    }

    /**
     * 获取历史订单
     * @private
     */
    _gotoHistoryOrderList() {
        post('user/getMemberToken', {token: this.props.token},true)
            .then(response => {
                    if(isSuccess(response)){
                        let {orderHistoryUrl,yijiaToken} = response.result;
                        this.props.dispatch(goto('CommonWebView',{title:'历史订单',url:orderHistoryUrl + '?platform=app','token':yijiaToken}));
                    }else{
                        showToastShort(getRequestFailTip(response));
                    }
                }).catch(e=>{
                    showToastShort(getRequestFailTip(e));
            });
    }


    /**
     * 联系客服
     * @private
     */
    _callCustomService(){
        let url = 'tel: '+SERVICE_CALL;
        Linking.canOpenURL(url)
            .then(supported => {
                if (!supported) {
                    console.log('Can\'t handle url: ' + url);
                } else {
                    return Linking.openURL(url);
                }
        }).catch(err => console.warn('An error occurred', err))
    }

    _keyExtractor = (item, index) => index;

    _renderItem(item,numColumns){
        return (<View style={{flexDirection: 'row', width:(Dimensions.get('window').width - 20) / numColumns}} opacity={item.disable?0.7:1}>
            <TouchableOpacity activeOpacity={item.disable?1:0.7} style={styles.moduleLayout} onPress={()=>{
                if(item.disable){
                    showToastShort('敬请期待');
                }else{
                    if(item.func){
                        item.func();
                    }
                }
            }}>
                <Image style={styles.moduleImg} source={{uri:item.img}}/>
                <Text style={styles.moduleName}>{item.name}</Text>
            </TouchableOpacity>
        </View>);
    }

    render() {

        let finalModuleList = [];
        this.getModulesList().map(item=>{
            if(item) finalModuleList.push(item)
        });
        return (
            <View style={styles.module}>
                <FlatList data={finalModuleList}
                          numColumns={4}
                          keyExtractor={this._keyExtractor}
                          renderItem={({item, index}) =>
                              this._renderItem(item,4)
                          }
                />
                <View>
                    <TipDialog
                        ref='CallDialog'
                        // show={this.state.showLogoutDialog}
                        dialogMessage={'确定要拨打客服电话吗？'}
                        onClickConfirm={this._callCustomService.bind(this)}/>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({

    module: {
        backgroundColor: 'white',
        marginTop: 10,
        padding: 10,
    },
    moduleLayout: {
        backgroundColor: 'white',
        flex: 1,
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    moduleImg: {
        width: 30,
        height: 30,
        marginTop: 10,
        resizeMode: 'contain'
    },
    moduleName: {
        color: titleTextColor,
        marginBottom: 10,
        marginTop: 10,
        fontSize: 13,
    },
});

selector=(state)=>{
    return{
        token: state.loginStore.token,
        userInfo: state.userInfoStore.userInfo,
        isRealNameAuth: state.loginStore.otherConfig ? state.loginStore.otherConfig.isRealNameAuth : undefined
    }
};

export default connect(selector)(ModuleView);

