import React, {Component} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {
    ic_brand_guan, ic_cars_order, ic_discount_guan, ic_join_businessman, ic_legou_guan, ic_msg_identity,
    ic_n_more
} from "../../../constraint/Image";
import {connect} from "react-redux";
import {goto} from "../../../reducers/RouterReducer";
import {showToastShort} from "../../../common/CommonToast";
import {isIPhone5, isTrue} from "../../../common/AppUtil";
import XImage from "../../../widgets/XImage";

class GuideModules extends Component {
    render() {
        let data = [
            // {
            //     name: '信息认证',
            //     uri: ic_msg_identity,
            // },
            // {
            //     name: '加盟商家',
            //     uri: ic_join_businessman,
            // },
            {
                name: '品牌馆',
                uri: ic_brand_guan,
            },
            {
                name: '乐购馆',
                uri: ic_legou_guan,
            },
            // {
            //     name: '折扣馆',
            //     uri: ic_discount_guan,
            // },
            {
                name: '名车馆',
                uri: ic_cars_order,
            },
            {
                name: '活动',
                uri: ic_n_more,
            },
        ];
        return (
            <View style={{backgroundColor: '#ffffff', flexDirection: 'row'}}>
                {
                    data.map((item, i) => {
                        return <TouchableOpacity
                                key={i}
                                style={{
                                    width: 80,
                                    flex: 1,
                                    padding: 15,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                activeOpacity={0.7}
                                onPress={() => {
                                    // if (item.name === '信息认证') {
                                    //     if (!this.props.token) {
                                    //         this.props.dispatch(goto('Login'));
                                    //     } else if (isTrue(this.props.isRealNameAuth)) {
                                    //         showToastShort('您已通过实名认证');
                                    //     } else {
                                    //         this.props.dispatch(goto('Certification'));
                                    //     }
                                    // } else if (item.name === '加盟商家') {
                                    //     if (!this.props.token) {
                                    //         this.props.dispatch(goto('Login'));
                                    //     } else if (isTrue(this.props.isRealNameAuth)) {
                                    //         this.props.dispatch(goto('MerchantsIndex'));
                                    //     } else {
                                    //         this.props.dispatch(goto('Certification'));
                                    //     }
                                    //
                                    // }
                                    if (item.name === '品牌馆') {
                                        this.props.dispatch(goto('HomeStreet','APP_HOME_BRAND'));
                                    } else if (item.name === '乐购馆') {
                                        this.props.dispatch(goto('HomeStreet','APP_HOME_LEGOU'));
                                    } else if (item.name === '活动') {
                                        // this.props.dispatch(goto('RichMoreBuy'));
                                        showToastShort('敬请期待');
                                    } else {
                                        this.props.dispatch(goto('BuyCarIndex'));
                                    }
                                }}>
                                <XImage uri={item.uri} style={{width:45, height: 45}}/>
                                {/*<XImage uri={item.uri} style={{width: isIPhone5() ? 55 : 60, height: isIPhone5() ? 55 : 60}}/>*/}
                                <Text style={{fontSize: 12, textAlign: 'center', color: '#333333', marginTop: 5}}>{item.name}</Text>
                            </TouchableOpacity>
                    })
                }
            </View>
        )
    }
}

selector = (state) => {
    return {
        isRealNameAuth: state.loginStore.otherConfig ? state.loginStore.otherConfig.isRealNameAuth : undefined,
        token: state.loginStore.token,
    }
};
export default connect(selector)(GuideModules);