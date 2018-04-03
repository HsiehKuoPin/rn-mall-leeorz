import React, {Component} from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    TextInput,
    DeviceEventEmitter,
} from 'react-native';
import {
    mainColor, mainBackgroundColor, content2TextColor, placeholderTextColor
} from '../../../constraint/Colors';
import TitleBar from '../../../widgets/TitleBar';
import {connect} from 'react-redux'
import {getRequestFailTip,isSuccess, post} from "../../../common/CommonRequest";
import {showToastShort} from "../../../common/CommonToast";
import Stepper from '../../../widgets/Stepper';
import {goBack} from '../../../reducers/RouterReducer';
import XImage from '../../../widgets/XImage';
import {styles} from '../../../styles/ApplyCustomerServiceStyle';
import {checkInputIsNumber} from "../../../common/StringUtil";

class ApplyCustomerService extends Component {

    constructor(props) {
        super(props)
        this.state = {
            type: [{text: '退货退款', refundType: 'REFUNDS'}, {text: '仅退款', refundType: 'ONLY_A_REFUND'}],
            selectIndex: null,
            amount: '', // 退款金额
            contactPerson: '',// 联系人
            phone: '', // 联系号码
            user_problem: '',// 问题描述,
            inputAmount: ''
        }
        this.categoryId = this.props.navigation.state.params.orderItems[0];
    }

    componentDidMount() {
        this._applyAfterSaleAmount(1)
    }

    _applyAfterSaleAmount(num) {
        this.quantity = num;
        let requestObj =
            {
                'token': this.props.token,
                'orderItemId': this.categoryId.id,
                'quantity': this.quantity
            };
        post('order/applyAfterSaleAmount', requestObj)
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    this.setState({
                        inputAmount: responseData.result.amount.toString(),
                        amount: responseData.result.amount,
                    })
                } else {
                    showToastShort(responseData.message);
                }
            }).catch((e) => {
            showToastShort(e.message);
        });
    }

    _onEndEditing() {
        let amount = this.state.amount;
        if (Number(this.state.inputAmount) > Number(this.state.amount)) {
            this.setState({inputAmount: amount.toString()})
        }
    }

    _applyAfterSale() {
        if (this.state.selectIndex === null) {
            showToastShort("您还没有填写服务类型...");
            return;
        } else if (this.state.user_problem === '') {
            showToastShort("您还没有描述商品问题...");
            return;
        } else if (this.state.contactPerson === '') {
            showToastShort("您还没有输入申请人...");
            return;
        } else if (this.state.phone === '') {
            showToastShort("您还没输入手机号码...");
            return;
        } else if (!checkInputIsNumber(this.state.phone)) {
            showToastShort("手机号码不合法...");
            return;
        }

        let requestObj = {
            'token': this.props.token, 'afterSale': {
                'orderId': this.categoryId.orderId,
                'orderItemId': this.categoryId.id,
                'refundType': this.state.type[this.state.selectIndex].refundType,
                'quantity': this.quantity,
                'amount': this.state.inputAmount,
                'contactPerson': this.state.contactPerson,
                'note': this.state.user_problem,
                'phone': this.state.phone
            }
        };

        post('order/applyAfterSale', requestObj)
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    showToastShort("提交成功");
                    DeviceEventEmitter.emit('UPDATESERVICELIST');
                    this.props.dispatch(goBack());
                } else {
                    showToastShort(getRequestFailTip(responseData));
                }
            }).catch((e) => {
            showToastShort(e.message);
        });
    }

    render() {
        return (
            <View style={{backgroundColor: mainBackgroundColor, flex: 1}}>
                <TitleBar title={'申请售后服务'}/>
                <ScrollView>
                    <View style={styles.orderInfo}>
                        <XImage uri={this.categoryId.imgUrl} style={styles.orderImg}/>
                        <View style={{marginLeft: 10, flexDirection: 'column', flex: 1,}}>
                            <Text style={[styles.orderText, {paddingRight: 10, marginTop: 5}]}
                                  numberOfLines={1}>{this.categoryId.productName}</Text>
                            <Text numberOfLines={1}
                                  style={styles.orderTime}>{'下单时间 : ' + this.categoryId.createTime}</Text>
                            <Text style={styles.orderTime}>{'数量 : ' + this.categoryId.quantity}</Text>
                        </View>
                    </View>
                    <View style={styles.serviceInfo}>
                        <Text style={styles.tipText}>服务类型:</Text>
                        <View style={styles.line}/>
                        <View style={{flexDirection: 'row'}}>
                            {this.state.type.map((item, index) => {
                                return (
                                    <TouchableOpacity key={index}
                                                      activeOpacity={0.7}
                                                      style={[styles.type, {borderColor: (this.state.selectIndex === index ? mainColor : placeholderTextColor)}]}
                                                      onPress={() => {
                                                          if (this.state.selectIndex !== index) {
                                                              this.setState({selectIndex: index})
                                                          }
                                                      }}>
                                        <Text style={{
                                            color: (this.state.selectIndex === index ? mainColor : content2TextColor),
                                            fontSize: 15
                                        }}>{item.text}</Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                        <View style={styles.line}/>
                        <Text style={styles.tipText}>退款信息:</Text>
                        <View style={styles.line}/>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={[styles.refundText, {marginTop: 6}]}>退款金额</Text>
                            <View style={styles.refundMoney}>
                                <TextInput
                                    style={{height: 42, fontSize: 15}}
                                    keyboardType={"numeric"}
                                    underlineColorAndroid='transparent'
                                    onEndEditing={() => this._onEndEditing()}
                                    defaultValue={this.state.inputAmount}
                                    onChangeText={(inputAmount) => this.setState({inputAmount})}/>
                            </View>
                            <Text style={[styles.orderTime, {marginLeft: 10}]}>元</Text>
                        </View>
                        <Text style={{
                            color: content2TextColor,
                            fontSize: 15,
                            marginTop: 5
                        }}>(商品最多退款{Number(this.state.amount)}元)</Text>
                        <View style={{flexDirection: 'row', marginTop: 15}}>
                            <Text style={[styles.refundText, {marginTop: 5}]}>申请数量</Text>
                            <Stepper max={this.categoryId.quantity} min={1} style={{marginLeft: 20}} defaultValue={1}
                                     onChange={v => {
                                         this._applyAfterSaleAmount(v)
                                     }}
                            />
                        </View>
                        <View style={styles.line}/>
                        <Text style={styles.tipText}>问题描述:</Text>
                        <View style={styles.problemDesc}>
                            <TextInput
                                underlineColorAndroid='transparent'
                                style={styles.inputLayout}
                                multiline={true}
                                maxLength={500}
                                placeholder="请您在此描述商品问题"
                                placeholderTextColor={placeholderTextColor}
                                onChangeText={(user_problem) => this.setState({user_problem})}/>
                            <View style={{flexDirection: 'row'}}>
                                <View style={{flex: 1}}/>
                                <Text
                                    style={{paddingRight: 5, fontSize: 13, color: placeholderTextColor}}>
                                    {this.state.user_problem.length + '/500'}</Text>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', marginVertical: 20,}}>
                            <Text style={[styles.refundText, {alignSelf: 'center'}]}>申请人:</Text>
                            <View style={[styles.textInput, {marginLeft: 35}]}>
                                <TextInput
                                    style={{padding: 5, fontSize: 15}}
                                    underlineColorAndroid='transparent'
                                    autoCapitalize="none"
                                    placeholder={'填写联系人'}
                                    placeholdertTextColor={placeholderTextColor}
                                    onChangeText={(text) => {
                                        this.setState({contactPerson: text})
                                    }}>
                                </TextInput>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={[styles.refundText, {alignSelf: 'center'}]}>手机号码:</Text>
                            <View style={styles.textInput}>
                                <TextInput
                                    style={{padding: 5, fontSize: 15}}
                                    underlineColorAndroid='transparent'
                                    autoCapitalize="none"
                                    maxLength={11}
                                    keyboardType={"numeric"}
                                    placeholder={'填写手机号码'}
                                    placeholdertTextColor={placeholderTextColor}
                                    onChangeText={(text) => {
                                        this.setState({phone: text})
                                    }}>
                                </TextInput>
                            </View>
                        </View>
                        <Text style={{color: placeholderTextColor, fontSize: 13, marginTop: 10, lineHeight: 20,}}>
                            提交售后单后，售后专员可能与您电话沟通，请保持手机畅通</Text>
                        <TouchableOpacity style={styles.commit}
                                          activeOpacity={0.7}
                                          onPress={() => this._applyAfterSale()}>
                            <Text style={{color: 'white', fontSize: 17, alignSelf: 'center'}}>提 交</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

selector = (state) => {
    return {
        token: state.loginStore.token,
    }
};

export default connect(selector)(ApplyCustomerService)