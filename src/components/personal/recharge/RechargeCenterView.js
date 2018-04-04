import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    FlatList,
    Dimensions,
    ScrollView
} from 'react-native';
import {connect} from 'react-redux';
import {
    mainBackgroundColor, mainColor, titleTextColor,
    contentTextColor, content2TextColor, placeholderTextColor
} from "../../../constraint/Colors";
import PayPasswordView from '../../../widgets/PayPasswordView';
import {showToastShort} from "../../../common/CommonToast";
import {checkInputPassword, checkPhone, checkInputIsNumber} from "../../../common/StringUtil";
import {goBack, goto} from '../../../reducers/RouterReducer';
import {post, getRequestFailTip,isSuccess} from "../../../common/CommonRequest"
import {isTrue} from "../../../common/AppUtil";

class RechargeCenterView extends Component {

    constructor(props) {
        super(props)
        this.rechargeType = this.props.rechargeType;
        this.state = {
            phone: '',
            money: '',
            selectIndex: null,
            data: [],
        }
    }

    componentDidMount() {
        post("order/virtual/prePaidPhoneList", {token: this.props.token})
            .then((response) => {
                if (isSuccess(response)) {
                    this.setState({data: response.result})
                } else {
                    showToastShort(getRequestFailTip(response))
                }
            }).catch((e) => {
            showToastShort(getRequestFailTip());
            console.warn(e.message)
        });
    }

    _renderItem = ({item, index}) => {
        return (
            <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.itemContain, {borderColor: (this.state.selectIndex === index ? mainColor : placeholderTextColor)}]}
                onPress={() => {
                    if (this.state.selectIndex !== index) {
                        this.setState({selectIndex: index})
                    }
                }}>
                <Text style={{
                    fontSize: 17,
                    color: (this.state.selectIndex === index ? mainColor : contentTextColor)
                }}>{item.denomination}元</Text>
                <Text style={{
                    fontSize: 13,
                    marginTop: 3,
                    color: (this.state.selectIndex === index ? mainColor : content2TextColor)
                }}>售价: {item.amount}元</Text>
            </TouchableOpacity>
        )
    };

    recharge() {
        if (this.state.phone === '') {
            showToastShort('您还没有输入手机号码...')
        } else if (!checkInputIsNumber(this.state.phone)) {
            showToastShort("手机号码不合法...");
        } else if (this.state.selectIndex === null) {
            showToastShort('您还没有选择充值金额...')
        } else {
            if (!isTrue(this.props.otherConfig.isSetPayPassword)) {
                this.props.dispatch(goto('ResetPaymentPsw'))
            } else {
                this.refs.PayPasswordView.show()
            }
        }
    }

    pay(obj) {
        let requestObj = {
            token: this.props.token,
            phone: this.state.phone,
            denomination: this.state.data[this.state.selectIndex].denomination,
            payPassword: obj
        };
        post("order/virtual/prePaidPhone", requestObj, true)
            .then((response) => {
                showToastShort(getRequestFailTip(response))
                if (isSuccess(response)) {
                    this.props.dispatch(goBack());
                }
            }).catch((e) => {
            showToastShort(getRequestFailTip());
            console.warn(e.message)
        });
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: mainBackgroundColor,}}>
                <ScrollView style={styles.container}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={styles.text}>手机号码:</Text>
                        <TextInput
                            style={styles.inputLayout}
                            maxLength={this.rechargeType === 'OIL_CARD' ? 19 : 11}
                            keyboardType={"numeric"}
                            placeholder={"填写您要充值的手机号码"}
                            placeholderTextColor={placeholderTextColor}
                            underlineColorAndroid={'transparent'}
                            value={this.state.phone}
                            onChangeText={(text) => this.setState({phone: checkInputPassword(text)})}/>
                    </View>
                    <View style={styles.line}/>
                    <View>
                        <Text style={styles.text}>充值金额</Text>
                        <FlatList
                            data={this.state.data}
                            numColumns={3}
                            extraData={this.state.selectIndex}
                            keyExtractor={(item, index) => index}
                            renderItem={this._renderItem}
                        />
                    </View>
                    <TouchableOpacity style={styles.recharge} onPress={() => this.recharge()} activeOpacity={0.7} >
                        <Text style={{color: 'white', fontSize: 17, alignSelf: 'center'}}>确 定</Text>
                    </TouchableOpacity>
                </ScrollView>
                <PayPasswordView
                    ref={'PayPasswordView'}
                    pay={(password) => this.pay(password)}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({

    container: {
        backgroundColor: 'white',
        padding: 20,
        // borderRadius: 3,
        // shadowOpacity: 0.2,
        // shadowOffset: {height: 2, width: 2},
        // shadowRadius: 3,
        // elevation: 2,
        // marginHorizontal: 10,
        // marginVertical: 10,
    },
    text: {
        color: titleTextColor,
        fontSize: 16,
    },
    inputLayout: {
        backgroundColor: mainBackgroundColor,
        height: 42,
        marginLeft: 10,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 0.5,
        borderColor: placeholderTextColor,
        borderRadius: 3,
        paddingLeft: 5,
        fontSize: 15,
    },
    line: {
        height: 0.5,
        backgroundColor: placeholderTextColor,
        flex: 1,
        marginTop: 20,
        marginBottom: 15
    },
    itemContain: {
        backgroundColor: 'white',
        width: (Dimensions.get('window').width - 70) / 3,
        borderRadius: 3,
        borderWidth: 1,
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 5,
        marginTop: 15,
    },
    recharge: {
        backgroundColor: mainColor,
        height: 40,
        alignSelf: 'center',
        justifyContent: 'center',
        width: Dimensions.get('window').width - 120,
        borderRadius: 5,
        marginTop: 35,
        marginBottom: 30
    },
})

selector = (state) => {
    return {
        otherConfig: state.loginStore.otherConfig,
        token: state.loginStore.token
    }
}

export default connect(selector)(RechargeCenterView);