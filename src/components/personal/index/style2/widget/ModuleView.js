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
import {CommonStyles} from "../../../../../styles/CommonStyles";
import {
    ic_arrow_right,
    ic_personal_module_address, ic_personal_module_collect,
    ic_personal_module_group, ic_personal_module_history, ic_personal_module_open, ic_personal_module_recharge,
    ic_personal_module_redpacket, ic_personal_module_service_phone,
    ic_right_arrows
} from "../../../../../../resources/index";


class ModuleView extends Component {
    constructor(props) {
        super(props);
        let {dispatch} = this.props;
    }

    getModulesList(){
        let {dispatch,userInfo} = this.props;
        return [
            {img: ic_personal_module_group, name: '我的推荐',func:()=>{dispatch(goto('MyRecommendation'))}},
            {img: ic_personal_module_redpacket, name: '红包',func:()=>{dispatch(goto('MyRedPacket'))}},
            // {img: ic_personal_module_history, name: '历史订单',func:()=>{this._gotoHistoryOrderList()}},
            {img: ic_personal_module_address, name: '收货地址',func:()=>{dispatch(goto('AddressList',{isSelectAddress:false}))}},
            // {img: ic_personal_module_recharge, name: '充值中心',func:()=>{dispatch(goto('RechargeCenter'))}},
            {img: ic_personal_module_collect, name: '我的收藏',func:()=>{dispatch(goto('CollectList'))}},
            // {img: ic_personal_module_service_phone, name: '联系客服',func:()=>{this.refs.CallDialog.showDialog()}},
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
        return (
            <TouchableOpacity activeOpacity={item.disable?1:0.7} style={styles.moduleLayout} onPress={()=>{
                if(item.disable){
                    showToastShort('敬请期待');
                }else{
                    if(item.func){
                        item.func();
                    }
                }
            }}>
                <Image style={styles.moduleImg} source={item.img}/>
                <Text style={styles.moduleName}>{item.name}</Text>
                <Image style={CommonStyles.rightArrowsStyle} source={ic_arrow_right}/>
            </TouchableOpacity>);
    }

    render() {

        let finalModuleList = [];
        this.getModulesList().map(item=>{
            if(item) finalModuleList.push(item)
        });
        return (
            <View style={styles.module}>
                <FlatList data={finalModuleList}
                          keyExtractor={this._keyExtractor}
                          ItemSeparatorComponent={()=><View style={CommonStyles.vline}/>}
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
        flexDirection:'row',
        paddingVertical:10,
        paddingLeft:10,
        alignItems: 'center',
        // justifyContent: 'center',
    },
    moduleImg: {
        width: 30,
        height: 30,
        resizeMode: 'contain'
    },
    moduleName: {
        marginLeft:10,
        color: titleTextColor,
        fontSize: 13,
        flex:1,
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

