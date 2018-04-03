import React, {Component} from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Text,
    TextInput
} from 'react-native';

import TitleBar from '../../widgets/TitleBar';
import {connect} from 'react-redux';
import {post, isSuccess} from "../../common/CommonRequest"
import {showToastShort} from "../../common/CommonToast";
import {content2TextColor, mainColor} from "../../constraint/Colors";
import TipDialog from "../../widgets/dialog/TipDialog";
import PayPasswordView from "../../widgets/PayPasswordView";
import {placeholderTextColor, titleTextColor} from "../../constraint/Colors";
import {goBack, goto, gotoAndClose} from "../../reducers/RouterReducer";
import {isTrue} from "../../common/AppUtil";
import {PAYMENTS_CONFIG} from "../../constraint/AssetsType";
import {formatInputNumber, formatMoney} from "../../common/StringUtil";

var itemData = null;

class PaymentDetailView extends Component {

    constructor(props) {
        super(props);
        itemData = this.props.navigation.state.params;
        this.state = {
            showPayPassword: false,
            recommend_input: '',//推荐人的手机
            recommend_login_name: '',//推荐人用户名
            recomment_login_id: '',
            data: null,
            showTitle: '',
            showButton: '确定',
            isFindUser: true,
            isUserReferees: false
        }
    }

    componentDidMount() {
        if (itemData.isMakerSelected)//true为商家入驻，false为升级服务中心
        this._checkUserReferees();
    }

    //支付订单

    _loadPayOrder(pass) {
        let requestObj;
        let url;
        if (itemData.isMakerSelected)
        {
            requestObj = {
                'companyInId': itemData.id,
                token: this.props.token,
                'companyRecommendId': this.state.recomment_login_id,
                'payPassword': pass
            };
            url = 'order/company/createOrder';
        }
        else
        {
            requestObj = {
                'companyInId': itemData.id,
                token: this.props.token,
                'payPassword': pass
            };
            url = 'order/company/createServiceCentreOrder';
        }

        post(url, requestObj, true)
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    showToastShort(responseData.message);
                    if (itemData.isMakerSelected)
                    {
                        this.props.dispatch(gotoAndClose('FranchiseRecord', ['Main', 'MerchantsIndex']));
                    }
                    else
                    {
                        this.props.dispatch(goBack('Main'));
                    }
                }
                else {
                    showToastShort(responseData.message);
                }
            }).catch((e) => {
            showToastShort(e.message);
        });
    }

    _errorMsg(msg) {
        this.setState({
            isLoading: false,
            isRequestError: true,
        });
        showToastShort(msg);
    }

    _checkUserReferees() {
        post('order/company/getAgentRecommendId', {token: this.props.token})
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    this.setState({
                        recommend_input: responseData.result.phone,
                        recomment_login_id: responseData.result.id,
                        recommend_login_name: responseData.result.name,
                        isUserReferees: responseData.result.editable,
                    })
                }
            })
    }

    _findUserName(input) {
        post('order/company/getCompanyRecommendByPhone', {'phone': input, token: this.props.token})
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    this.setState({
                        recomment_login_id: responseData.result.id,
                        recommend_login_name: responseData.result.name,
                        isFindUser: true
                    })
                } else {
                    this.setState({recommend_login_name: '推荐人不存在', isFindUser: false})
                }
            })
    }

    render() {
        return (
            <View style={styles.container}>
                <TitleBar title={'付款详情'}/>
                <ScrollView>
                    <View
                        style={styles.ViewStyle}>
                        {this.paymentMessage()}
                        {itemData.isMakerSelected?this.showMerchantsReferees():null}
                        {this.confirmPayment()}

                    </View>
                    <PayPasswordView
                        ref={'PayPasswordView'}
                        pay={(password) => this._loadPayOrder(password)}
                    />
                    <TipDialog
                        ref={'TipDialog'}
                        confirmBtnText={this.state.showButton}
                        dialogMessage={this.state.showTitle}
                        onClickConfirm={this.onDeletePress.bind(this, this.state.showTitle)}/>
                </ScrollView>
            </View>
        );
    }

    paymentMessage() {
        return (
            <View>
                <Text style={{
                    marginTop: 20,
                    marginLeft: 20,
                    fontSize: 15,
                    color: titleTextColor,
                }}>支付明细:</Text>
                <View style={{flexDirection: 'row'}}>
                    <View style={{flexDirection: 'column', marginLeft: 20,}}>
                        {

                            itemData.pays.map((item, index) => {
                                return <View
                                    key={index}>
                                    <Text style={{
                                        marginTop: 10,
                                        fontSize: 13,
                                        color: content2TextColor,
                                    }}>
                                        {PAYMENTS_CONFIG[item.accountType].name + '支付'}
                                    </Text>
                                </View>
                            })

                        }
                    </View>
                    <View style={{flexDirection: 'column', marginLeft: 30,}}>
                        {
                            itemData.pays.map((item, index) => {
                                return <View
                                    key={index}
                                    style={{marginLeft: 30}}>
                                    <Text style={{
                                        textAlign: 'left',
                                        marginTop: 10,
                                        fontSize: 13,
                                        color: content2TextColor,
                                    }}>
                                        {formatMoney(item.amount, false)}
                                    </Text>
                                </View>
                            })

                        }
                    </View>
                </View>
                <View style={styles.lineStyle}/>
            </View>
        )
    }

    showMerchantsReferees() {
        return (
            <View>
                <View style={styles.InputLayout}>
                    <Text style={styles.holderText}>推荐人:</Text>
                    <TextInput
                        maxLength={11}
                        editable={this.state.isUserReferees}
                        placeholder="填写商家推荐人的手机号码"
                        placeholderTextColor={placeholderTextColor}
                        underlineColorAndroid={'transparent'}
                        keyboardType={"numeric"}
                        onBlur={() => {
                            let input = this.state.recommend_input;
                            if (input.length == 11) {
                                this._findUserName(input);
                            }
                            else if (input.length == 0) {
                                return;
                            }
                            else {
                                showToastShort('手机号码格式不正确...');
                                return;
                            }
                        }}
                        style={[styles.registerInput,]}
                        value={this.state.recommend_input}
                        onChangeText={(text) => this.setState({recommend_input: formatInputNumber(text)})}
                    />
                </View>

                <View style={styles.InputLayout}>
                    <Text style={[styles.holderText, {width: 90, backgroundColor: '#00000000'}]}>推荐人用户名:</Text>
                    <Text
                        style={[styles.RecommendName, {color: this.state.isFindUser ? titleTextColor : 'red'}]}>{this.state.recommend_login_name}</Text>
                </View>
                <View style={styles.lineStyle}/>
            </View>
        )
    }

    confirmPayment() {

        return (
            <TouchableOpacity
                style={styles.buttonStyle}
                activeOpacity={0.7}
                // disabled={this.state.data !== null ? (this.state.data.total === undefined ? false : this.state.payDisable) : this.state.payDisable}
                onPress={() => {
                    if (itemData.isMakerSelected)
                    {
                        if (this.state.recommend_login_name === '') {
                            showToastShort('推荐人不能为空...')
                            return;
                        }
                        else if (this.state.recommend_login_name === '推荐人不存在') {
                            showToastShort('推荐人不存在...')
                            return;
                        }
                    }

                    this.onPayPassword();
                }}>
                <Text style={{color: 'white', fontSize: 15,}}>{'支付服务费'}</Text>
            </TouchableOpacity>
        );
    }

    onPayPassword() {

        isTrue(this.props.otherConfig.isSetPayPassword) ?
            this.refs.PayPasswordView.show() : (
                this.setState({
                    showTitle: '是否去设置支付密码?',
                }, () => this.refs.TipDialog.showDialog())
            )
    }

    onDeletePress = (title) => {
        if (title === '是否去设置支付密码?') {
            this.props.dispatch(goto('ResetPaymentPsw'))
        }
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2'
    },
    ViewStyle: {
        shadowColor: 'gray',
        shadowOffset: {height: 2, width: 2},
        shadowRadius: 5,
        shadowOpacity: 0.2,
        elevation: 2,
        backgroundColor: 'white',
        borderRadius: 5,
        margin: 10,
    },
    viewStyle: {
        flexDirection: 'row',
        backgroundColor: 'white',
        alignItems: 'center'
    },
    imageStyle: {
        margin: 20,
        width: 26,
        height: 26,
    },
    lineStyle: {
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: placeholderTextColor,
        height: 0.5
    },
    InputLayout: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
        marginTop: 10,
    },
    RecommendName: {
        fontSize: 15,
        flex: 1,
        justifyContent: 'center',
        color: 'black',
        paddingLeft: 15,
    },
    holderText: {
        marginLeft: 10,
        color: titleTextColor,
        fontSize: 14,
        width: 90,
    },
    buttonStyle: {
        marginTop: 30,
        marginLeft: 40,
        marginRight: 50,
        marginBottom: 30,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: mainColor
    },
    registerInput: {
        fontSize: 14,
        flex: 1,
        padding: 0,
        height: 30,
        justifyContent: 'center'
    },
});

selector = (state) => {
    return {
        token: state.loginStore.token,
        otherConfig: state.loginStore.otherConfig,
    }
};

export default connect(selector)(PaymentDetailView);