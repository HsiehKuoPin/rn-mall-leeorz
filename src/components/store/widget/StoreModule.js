import React, {Component} from 'react';
import {Text, TouchableOpacity, View,Linking,} from 'react-native';
import {ic_store_category, ic_store_collect, ic_store_custom, ic_store_index} from "../../../constraint/Image";
import {connect} from "react-redux";
import {showToastShort} from "../../../common/CommonToast";
import XImage from "../../../widgets/XImage";
import {mainColor} from "../../../constraint/Colors";
import TipDialog from "../../../widgets/dialog/TipDialog";
import {SERVICE_CALL} from "../../../common/AppUtil";

class StoreModule extends Component {
    render() {
        let data = [
            {
                name: '店铺首页',
                uri: ic_store_index,
            },
            {
                name: '分类',
                uri: ic_store_category,
            },

            {
                name: '联系客服',
                uri: ic_store_custom,
            },
            {
                name: '收藏本店',
                uri: ic_store_collect,
            },
        ];
        return (
            <View style={{
                backgroundColor: '#ffffff',
                flexDirection: 'row',
                marginTop: -95,
                marginLeft:15,
                marginRight:15
            }}>
                {
                    data.map((item, i) => {
                        return <TouchableOpacity
                            key={i}
                            style={{
                                flex: 1,
                                padding: 10,
                                paddingTop:15,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            activeOpacity={0.7}
                            onPress={() => {
                                if (item.name === '店铺首页') {

                                } else if (item.name === '分类') {
                                    this.props.pressCategory();
                                } else if (item.name === '联系客服') {
                                    this.refs.CallDialog.showDialog();
                                } else {
                                    showToastShort('敬请期待');
                                }
                            }}>
                            <XImage source={item.uri} style={{width: 30, height: 30}}/>
                            <Text style={{
                                fontSize: 12,
                                textAlign: 'center',
                                color: i===0?mainColor:'#333333',
                                marginTop: 5,
                            }}>{item.name}</Text>
                        </TouchableOpacity>
                    })
                }
                <View>
                    <TipDialog
                        ref='CallDialog'
                        dialogMessage={'确定要拨打客服电话吗？'}
                        onClickConfirm={this._callCustomService.bind(this)}/>
                </View>
            </View>
        )
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
}

selector = (state) => {
    return {
        token: state.loginStore.token,
    }
};
export default connect(selector)(StoreModule);