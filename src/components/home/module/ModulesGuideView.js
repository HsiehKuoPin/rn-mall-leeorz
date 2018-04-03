import React, {Component} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {
    ic_cars_order, ic_join_businessman, ic_msg_identity, ic_n_more,
} from "../../../constraint/Image";
import {connect} from "react-redux";
import {goto} from "../../../reducers/RouterReducer";
import {showToastShort} from "../../../common/CommonToast";
import {isIPhone5, isTrue} from "../../../common/AppUtil";

class ModulesGuideView extends Component {
    render() {
        let data = [
            {
                name: '信息认证',
                uri: ic_msg_identity,
            },
            {
                name: '加盟商家',
                uri: ic_join_businessman,
            },
            {
                name: '名车馆',
                uri: ic_cars_order,
            },
            {
                name: '富诚N+',
                uri: ic_n_more,
            },
        ];
        return (
            <View style={{
                margin: 10,
                backgroundColor: '#ffffff',
                flexDirection: 'row',
                shadowColor: 'gray',
                shadowOffset: {height: 2, width: 2},
                shadowRadius: 3,
                shadowOpacity: 0.2,
                elevation: 2
            }}>
                {
                    data.map((item, i) => {
                        return (
                            <TouchableOpacity
                                key={i}
                                style={{
                                    width: 80,
                                    flex: 1,
                                    paddingHorizontal: 10,
                                    paddingVertical: 15,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                activeOpacity={0.7}
                                onPress={() => {
                                    if (item.name==='信息认证'){

                                        if(this.props.isRealNameAuth === undefined) {
                                            this.props.dispatch(goto('Login'));
                                        }else if(isTrue(this.props.isRealNameAuth)){
                                            showToastShort('您已通过实名认证');
                                        } else {
                                            this.props.dispatch(goto('Certification'));
                                        }
                                    }
                                    else if (item.name==='加盟商家'){
                                        this.props.dispatch(goto('MerchantsIndex'));
                                    }
                                    // else if (item.name==='升级会员')this.props.dispatch(goto('BindingBankCard'));
                                    else if (item.name==='富诚N+'){
                                        this.props.dispatch(goto('RichMoreBuy'));
                                    }
                                    else this.props.dispatch(goto('BuyCarIndex'));
                                }}>
                                    <Image source={{uri:item.uri}} style={{width:isIPhone5()?50: 55, height:isIPhone5()?50: 55}}/>
                                    <Text style={{fontSize:isIPhone5()?12:14,textAlign: 'center', color: '#333333', marginTop: 5}}>{item.name}</Text>
                            </TouchableOpacity>
                        )
                    })
                }
            </View>
        )
    }
}

selector=(state)=>{
  return {
      isRealNameAuth:state.loginStore.otherConfig?state.loginStore.otherConfig.isRealNameAuth:undefined,
  }
};
export default connect(selector)(ModulesGuideView);