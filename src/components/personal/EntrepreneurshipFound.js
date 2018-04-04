import React, {Component} from 'react'
import {
    View, StyleSheet, Image, TouchableOpacity, Text, Dimensions, ImageBackground, FlatList,
    ScrollView
} from 'react-native';
import TitleBar from "../../widgets/TitleBar";
import {goto} from "../../reducers/RouterReducer";
import LoadingView from "../../widgets/LoadingView";
import RequestErrorView from "../../widgets/RequestErrorView";
import {getRequestFailTip, isSuccess, post} from "../../common/CommonRequest";
import {showToastShort} from "../../common/CommonToast";
import {formatMoney} from "../../common/StringUtil";
import BaseComponent from "../../widgets/BaseComponent";
import XImage from "../../widgets/XImage";
import {connect} from "react-redux";
import {
    content2TextColor, contentTextColor, mainBackgroundColor, mainColor, placeholderTextColor, priceColor,
    titleTextColor
} from "../../constraint/Colors";
import {ic_entrepreneurship_found} from "../../constraint/Image";
import {ENTREPRENEURSHIP_COUPON_ACCOUNT, getAssetTypeName} from "../../constraint/AssetsType";

const {width, height} = Dimensions.get('window');

class EntrepreneurshipFound extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            isRequestError: false,
            isLoading: true,
            data: {},
        };
    }

    componentWillReceiveProps(nextProps){
        if(this.isResume(nextProps)){
            this._loadData();
        }
    }

    componentDidMount() {
        this._loadData();
    }

    _loadData() {
        post('order/company/getEntrepreneurshipPage',{token:this.props.token})
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    this.setState({
                        data: responseData.result,
                        isLoading: false,
                        isRequestError: false,
                    });
                }else if(this.checkUserTokenValid({responseData, title: '您的登录已失效'})) {
                    this._errorMsg(responseData);
                }
            }).catch((e) => {
            this._errorMsg(e);
        });
    }

    _errorMsg(msg) {
        this.setState({
            isLoading: false,
            isRequestError: true,
        });
        showToastShort(getRequestFailTip(msg));
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <TitleBar title={'创业扶持计划'} />
                {
                    this.state.isLoading ? <LoadingView/> :
                        (!this.state.isRequestError ? this.showView() :
                            <RequestErrorView onPress={() => {
                                this.setState({isRequestError: false, isLoading: true});
                                this._loadData();
                            }}/>)
                }
            </View>
        )
    }

    showView() {
        return (
            <ScrollView style={{flex: 1,backgroundColor: mainBackgroundColor}}>
                <View style={styles.content}>
                    <Text style={styles.txtTile}>申请创业补贴</Text>
                    <View style={styles.line}/>
                    <View style={{paddingHorizontal:15,paddingVertical:10}}>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <View style={{flex:1}}>
                                <Text style={styles.txtPrice}>{formatMoney(this.state.data.getAmount,false)}</Text>
                                <Text style={styles.txtName}>可申请额度</Text>
                            </View>
                            <XImage source={ic_entrepreneurship_found} style={{height: width/4 * 0.84, width: width/4,marginRight:20}}/>
                        </View>
                        <View style={styles.line}/>
                        <Text style={styles.txtName}>{this.state.data.accountTypeLabel} {formatMoney(this.state.data.accountAmountLabel,false)}</Text>
                        <Text style={styles.txtName}>{this.state.data.payTypeLabel} {formatMoney(this.state.data.payAmountLabel,false)}</Text>
                        <TouchableOpacity
                            disabled={!this.state.data.canBuy}
                            style={[styles.touch,{backgroundColor: this.state.data.canBuy?mainColor:content2TextColor}]}
                            activeOpacity={0.7}
                            onPress={() => {
                                this.props.dispatch(goto('VentureFundPaymentDetail',this.state.data))}}>
                            <Text style={{color: '#fff', fontSize: 16}}>前 往 支 付</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {
                    this.state.data.orders.length < 1 ? null :
                        <View style={[styles.content,{marginVertical:0,marginBottom:10}]}>
                            <Text style={styles.txtTile}>购买记录</Text>
                            <View style={styles.line}/>
                            <View style={{paddingHorizontal:15,flexDirection:'row',justifyContent:'center' }}>
                                <Text style={styles.txt}>{getAssetTypeName(ENTREPRENEURSHIP_COUPON_ACCOUNT)}</Text>
                                <Text style={styles.txt}>支付玉积分</Text>
                                <Text style={styles.txt}>时间</Text>
                            </View>
                            <View style={{paddingHorizontal:15,paddingBottom:10}}>
                                <View style={styles.line}/>
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    data={this.state.data.orders}
                                    ItemSeparatorComponent={() => <View style={styles.line}/>}
                                    keyExtractor={(item, index) => index}
                                    renderItem={({item, index}) =>
                                        <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                            <Text style={[styles.txtName,{flex:1,textAlign:'center'}]}>{formatMoney(item.getAmount,false)}</Text>
                                            <Text style={[styles.txtName,{flex:1,textAlign:'center'}]}>{formatMoney(item.amount,false)}</Text>
                                            <Text style={[styles.txtName,{flex:1,textAlign:'center'}]}>{item.createTime}</Text>
                                        </View>
                                    }/>
                            </View>
                        </View>
                }

            </ScrollView>
        )
    }

}

const styles = StyleSheet.create({
    content: {
        backgroundColor: '#fff',
        marginVertical: 10,
        marginHorizontal:10,
        borderRadius: 4,
        shadowColor: 'gray',
        shadowOffset: {height: 2, width: 2},
        shadowRadius: 3,
        shadowOpacity: 0.2,
        elevation: 2,
    },
    txtTile: {
        fontSize: 16,
        color: titleTextColor,
        margin: 15,
        marginBottom:0
    },
    txtPrice: {
        fontSize: 25,
        color: priceColor,
    },
    txtName: {
        fontSize: 14,
        color: content2TextColor,
        marginVertical:5
    },
    txt: {
        fontSize: 15,
        margin: 5,
        flex:1,
        textAlign:'center',
        color:contentTextColor
    },
    line: {
        height: 0.5,
        backgroundColor: placeholderTextColor,
        marginVertical:10
    },
    touch: {
        width: width*0.65,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        height: 35,
        marginVertical: 20,
        alignSelf: 'center'
    },
});
selector = (state) => {
    return {
        token: state.loginStore.token,
        nav:state.nav,
    }
};

export default connect(selector)(EntrepreneurshipFound);