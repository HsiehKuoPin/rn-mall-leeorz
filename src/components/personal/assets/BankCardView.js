import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    Text,
    TouchableOpacity,
    ScrollView
} from 'react-native';

import TitleBar from '../../../widgets/TitleBar';
import RequestErrorView from '../../../widgets/RequestErrorView';
import {post, isSuccess} from "../../../common/CommonRequest"
import {showToastShort} from "../../../common/CommonToast";
import {
    content2TextColor, mainBackgroundColor, mainColor, placeholderTextColor,
    titleTextColor
} from "../../../constraint/Colors";
import LoadingView from "../../../widgets/LoadingView";
import {connect} from 'react-redux';
import {saveSingleOtherConfig} from "../../../reducers/LoginReducer";
import {goBack, goto} from "../../../reducers/RouterReducer";
import TipDialog from "../../../widgets/dialog/TipDialog";
import {ic_bankCar_cancel} from "../../../constraint/Image";
import XImage from "../../../widgets/XImage";
import BaseComponent from "../../../widgets/BaseComponent";

class BankCardView extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            isRequestError: false,
            isLoading: true,
        }

        this.bankCardId = '';
        this.bankCardIndex = 0;
    };

    componentWillReceiveProps(nextProps){
        if(this.isResume(nextProps)){
            this._loadBankCardList();
        }
    }

    componentDidMount(){
        this._loadBankCardList();
    }

    _loadBankCardList() {
        post('user/bindBankCardList', {token: this.props.token})
            .then((responseData) => {
                if (isSuccess(responseData)) {

                    this.setState({
                        isLoading: false,
                        isRequestError: false,
                        data: responseData.result,
                    });
                } else {
                    this._errorMsg("请求出现异常");
                }
            }).catch((e) => {
            this._errorMsg(e.message);
        });
    };

    _errorMsg(msg) {
        this.setState({
            isLoading: false,
            isRequestError: true,
        });
        showToastShort(msg);
    };

    _unBindBankCard = () => {
        if (this.bankCardId !== '') {
            let requestObj = {
                token: this.props.token,
                'bankCardId': this.bankCardId,
            };
            post('user/unBindBankCard', requestObj)
                .then((responseData) => {
                    if (isSuccess(responseData)) {
                        showToastShort("解除绑定成功");
                        this.refs.TipDialog.dismiss();
                        let editData = this.state.data;
                        editData.splice(this.bankCardIndex, 1);
                        editData.length === 0 ? (
                                this.props.dispatch(saveSingleOtherConfig('isBindBankCard', 'N')),
                                    this.props.dispatch(goBack())
                            ) :
                            (
                                this.setState({
                                    data: editData
                                })
                            )

                    } else if (responseData.status === 10001) {
                        showToastShort(responseData.message)
                    } else {
                        showToastShort("解除绑定失败，请稍后再试")
                    }
                })
        }
    };

    _keyExtractor = (item, index) => index;

    _header = () => {
        return <View style={{padding: 15, paddingBottom: 0}}>
            <View style={{flexDirection: 'row'}}>
                <Text style={{fontSize: 15, color: titleTextColor, paddingLeft: 5}}>
                    {'已绑定银行卡'}
                </Text>
                <View style={{flex: 1}}/>
                <Text style={{fontSize: 13, color: content2TextColor, paddingRight: 5}}
                      onPress={() => {
                          this.props.dispatch(goto('BindingBankCard'))
                      }
                      }>
                    {'添加银行卡'}
                </Text>
            </View>
            <View style={{
                marginLeft: 5,
                marginRight: 5,
                marginTop: 15,
                height: 0.5,
                backgroundColor: placeholderTextColor
            }}/>
        </View>
    };

    render() {

        var showView = this.state.isRequestError ? (
            <RequestErrorView onPress={() => {
                this.setState({isRequestError: false, isLoading: true,});
                this._loadBankCardList();
            }}/>
        ) : (<ScrollView style={{flex: 1}}>
                    <FlatList
                        ListHeaderComponent={this._header()}
                        horizontal={false}
                        style={styles.listStyle}
                        data={this.state.data}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={this._keyExtractor}
                        renderItem={({item, index}) =>
                            <View
                                key={index}
                                style={[styles.viewStyle,{marginBottom:index===this.state.data.length-1?15:0}]}>
                                <View style={{flexDirection: 'row', padding: 10}}>
                                    <XImage
                                        uri={item.logoImageUrl}
                                        style={{
                                            marginLeft: 5,
                                            paddingTop: 15,
                                            width: 52,
                                            height: 52,
                                            borderRadius: 26
                                        }}/>
                                    <View style={{justifyContent: 'center', marginLeft: 20}}>
                                        <Text
                                            style={{
                                                fontSize: 15,
                                                color: 'white',
                                            }}>{item.bankName}</Text>
                                        <Text style={{
                                            fontSize: 13,
                                            paddingTop: 5,
                                            color: 'white',
                                        }}>{item.bankAddress}</Text>
                                    </View>
                                    <View style={{flex: 1}}/>
                                    <TouchableOpacity
                                        style={{width: 30, height: 30, alignItems: 'center', justifyContent: 'center'}}
                                        activeOpacity={0.7}
                                        onPress={() => {
                                            this.bankCardId = item.bankCardId;
                                            this.bankCardIndex = index;
                                            this.refs.TipDialog.showDialog()
                                        }}>
                                        <XImage source={ic_bankCar_cancel}
                                                style={{width: 30, height: 30}}/>
                                    </TouchableOpacity>
                                </View>
                                <Text style={{
                                    fontSize: 26,
                                    textAlign: 'center',
                                    color: 'white',
                                    marginTop: 10,
                                }}>{item.bankCardNo.length === 0 ? '****' : item.bankCardNo = item.bankCardNo.replace((item.bankCardNo.substring(4, item.bankCardNo.length - 4)), ('\u2000' + '****' + '\u3000' + '****' + '\u2000'))}</Text>
                                <View style={{flexDirection: 'row', paddingTop: 20}}>
                                    <Text style={{
                                        fontSize: 15,
                                        marginLeft: 15,
                                        color: 'white',
                                    }}>{item.bankCardName}</Text>
                                    <View style={{flex: 1}}/>
                                    <Text style={{
                                        fontSize: 15,
                                        marginRight: 15,
                                        color: 'white',
                                        marginBottom: 15,
                                    }}>{'预留手机号:' + (item.bankCardPhone.length == 0 ? '****' : item.bankCardPhone.replace(item.bankCardPhone.substring(3, item.bankCardPhone.length - 4), ('****')))}</Text>
                                </View>
                            </View>
                        }
                    />
                    <TipDialog
                        ref='TipDialog'
                        dialogMessage={'确定要解除绑卡吗?'}
                        onClickConfirm={() => this._unBindBankCard()}/>
            </ScrollView>
        );
        return (
            <View style={styles.container}>
                <TitleBar
                    title={'银行卡管理'}
                    hideRight={true}
                />
                {this.state.isLoading ? <LoadingView/> : showView}
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: mainBackgroundColor
    },
    listStyle: {
        margin: 10,
        backgroundColor: 'white',
        borderRadius: 5,
        shadowColor: 'gray',
        shadowOffset: {height: 4, width: 4},
        shadowRadius: 5,
        shadowOpacity: 0.2,
        elevation: 2
    },
    viewStyle: {
        margin: 15,
        marginBottom:0,
        backgroundColor: mainColor,
        borderRadius: 5,
    },
});

selector = (state) => {
    return {
        nav:state.nav,
        token: state.loginStore.token
    }
};

export default connect(selector)(BankCardView);
