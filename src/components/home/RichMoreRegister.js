import React from 'react';
import {
    TextInput,
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    Image,
    ScrollView
} from 'react-native';
import {connect} from 'react-redux';
import TitleBar from '../../widgets/TitleBar';
import {mainColor, placeholderTextColor, mainBackgroundColor, titleTextColor} from '../../constraint/Colors';
import {post, getRequestFailTip, isSuccess} from '../../common/CommonRequest';
import {showToastShort} from '../../common/CommonToast';
import {goBack} from '../../reducers/RouterReducer';
import {ic_n_drop_down} from "../../constraint/Image";
import DropDownDialog from "./module/DropDownDialog";
import BaseComponent from "../../widgets/BaseComponent";
import {notifyUpdateRichMore, showLoadingDialog} from "../../reducers/CacheReducer";
import {checkInputIsNumber} from "../../common/StringUtil";

class RichMoreRegister extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            user_order: '',
            orderList:[],
            servicePersonalData:{},
            serviceCenterData:{},
            supportData:{},
        };
    }
    componentDidMount(){
        this._loadNPlusUnRegisteredOrderList();
    }
    _loadNPlusUnRegisteredOrderList() {//N+未注册会员订单列表
        post('order/combo/nplusUnRegisteredOrderList', {token: this.props.token},true)
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    this.setState({orderList: responseData.result});
                }  else if(this.checkUserTokenValid({response:responseData,title:'您的登录已失效'})){
                    showToastShort(getRequestFailTip(responseData));
                }
            }).catch((e) => {
            showToastShort(getRequestFailTip(e));
        });
    }

    _submit() {//N+未注册会员订单列表
        if (!this.user_name) {
            showToastShort("您还没有输入姓名...")
        } else if (!this.user_idNumber) {
            showToastShort("您还没有输入身份证号...")
        } else if (!this.user_phone) {
            showToastShort("您还没有输入手机号码...")
        } else if (!checkInputIsNumber(this.user_phone)) {
            showToastShort("手机号码不合法...");
        } else if (this.state.user_order === '') {
            showToastShort("您还没有选择订单...")
        } else if (!this.servicePersonalName || !this.user_service) {
            showToastShort("请输入正确的服务人会员编号...")
        } else if (!this.serviceCenterName || !this.user_service_center) {
            showToastShort("请输入正确的服务中心会员编号...")
        } else if (!this.supportName || !this.user_support) {
            showToastShort("请输入正确的扶持人会员编号...")
        } else {
            let requestObj = {
                token: this.props.token,
                nMember: {
                    "name": this.user_name,
                    "idCard": this.user_idNumber,
                    "mobile": this.user_phone,
                    "orderId": this.state.user_order,
                    "servicePersonal": this.user_service,
                    "serviceCenter": this.user_service_center,
                    "support": this.user_support
                },
            };
            post('user/createNMember', requestObj,true)
                .then((responseData) => {
                    if (isSuccess(responseData)) {
                        this.props.dispatch(notifyUpdateRichMore(new Date().valueOf()));
                        this.props.dispatch(goBack());
                    }  else if(this.checkUserTokenValid({response:responseData,title:'您的登录已失效'})){
                        showToastShort(getRequestFailTip(responseData));
                    }
                }).catch((e) => {
                showToastShort(getRequestFailTip(e));
            });
        }
    }

    _loadNPlusService(type){
        let servicePersonal=null;
        let serviceCenter=null;
        let support=null;
        let host='';
        switch (type) {
            case '服务人':
                servicePersonal = this.user_service;
                host = 'nplusServicePersonal';
                break;
            case '服务中心':
                serviceCenter = this.user_service_center;
                host = 'nplusServiceCenter';
                break;
            case '扶持人':
                support = this.user_support;
                host = 'nplusSupport';
                break;
        }
        let requestObj = {
            token: this.props.token,
            servicePersonal: servicePersonal,//校验与获取服务人
            serviceCenter: serviceCenter,//获取服务中心
            support: support,//获取扶持人和区域
        };

        post('user/'+host, requestObj,true)
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    if (type === '服务人'){
                        this.setState({servicePersonalData: responseData.result});
                    }else if (type === '服务中心'){
                        this.setState({serviceCenterData: responseData.result});
                    }else {
                        this.setState({supportData: responseData.result});
                    }
                } else if(this.checkUserTokenValid({response:responseData,title:'您的登录已失效'})){
                    this._reset(responseData ,type);
                }
            }).catch((e) => {
            this._reset(e ,type);
        });
    }

    _reset(msg ,type){
        showToastShort(getRequestFailTip(msg));
        if (type === '服务人'){
            this.setState({servicePersonalData: {}});
        }else if (type === '服务中心'){
            this.setState({serviceCenterData: {}});
        }else {
            this.setState({supportData: {}});
        }
    }

    render() {
        this.servicePersonalName=this.state.servicePersonalData.servicePersonalName?this.state.servicePersonalData.servicePersonalName:'';
        this.serviceCenterName=this.state.serviceCenterData.serviceCenterName?this.state.serviceCenterData.serviceCenterName:'';
        this.supportName=this.state.supportData.supportName?this.state.supportData.supportName:'';
        return (
            <View style={{backgroundColor: mainBackgroundColor, flex: 1}}>
                <TitleBar title={'注册N+会员'}/>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.container}>
                        {this.textInput('姓名','填写您的姓名')}
                        {this.textInput('身份证号','填写您的身份证号',18)}
                        {this.textInput('手机号码','填写绑定的手机号码',11,'','numeric')}
                        <View style={styles.inputLayout}>
                            <Text style={styles.holderText}>选择订单：</Text>
                            <View ref={'dropDown'} style={styles.textCon}>
                                <Text numberOfLines={1}
                                      style={{fontSize: 16, marginLeft:10,color: this.state.user_order === '' ?placeholderTextColor:titleTextColor}}>
                                    {this.state.user_order === '' ? '选择订单号' : this.state.user_order}
                                </Text>
                            </View>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                style={styles.dropDown}
                                onPress={() => {
                                    this.refs.dropDown.measureInWindow((x, y, width, height) => {
                                        if(this.state.orderList.length===0)showToastShort('暂无订单号选择');
                                        else this.refs.DropDownDialog.show(x, y, width + 40, height + 10);
                                    });
                                }}>
                                <Image style={{height: 13, width: 24, resizeMode: 'center'}} source={ic_n_drop_down}/>
                            </TouchableOpacity>
                        </View>
                        {this.textInput('服务人','填写服务人会员编号',7,this.servicePersonalName,'numeric')}
                        {this.textInput('服务中心','填写服务中心会员编号',7,this.serviceCenterName,'numeric')}
                        {this.textInput('扶持人','填写扶持人会员编号',7,this.supportName,'numeric')}
                        <TouchableOpacity
                            style={styles.confirmTouch}
                            activeOpacity={0.7}
                            onPress={() => this._submit()}>
                            <Text style={{fontSize: 18, color: '#fff'}}>确认注册</Text>
                        </TouchableOpacity>
                    </View>
                    <DropDownDialog data={this.state.orderList} ref={'DropDownDialog'} selectValue={(user_order)=> this.setState({user_order})}/>
                </ScrollView>
            </View>
        )
    }

    textInput(title, tips, maxLength, txt='', keyboardType) {
        return <View style={styles.inputLayout}>
            <Text style={styles.holderText}>{title}：</Text>
            <View style={styles.input}>
                <TextInput
                    maxLength={maxLength?maxLength:200}
                    keyboardType={keyboardType?keyboardType:'default'}
                    placeholder={tips}
                    placeholderTextColor={placeholderTextColor}
                    underlineColorAndroid={'transparent'}
                    style={styles.inputText}
                    onEndEditing={() => {
                        switch(title){
                            case '服务人':
                                if (this.user_service) this._loadNPlusService(title);
                                break;
                            case '服务中心':
                                if (this.user_service_center) this._loadNPlusService(title);
                                break;
                            case '扶持人':
                                if (this.user_support) this._loadNPlusService(title);
                                break;
                        }
                    }}
                    onChangeText={(text) => {
                        switch(title){
                            case '姓名': this.user_name=text; break;
                            case '身份证号': this.user_idNumber=text; break;
                            case '手机号码': this.user_phone=text; break;
                            case '服务人': this.user_service=text; break;
                            case '服务中心': this.user_service_center=text; break;
                            case '扶持人': this.user_support=text; break;
                        }
                    }}
                />
                <Text style={{fontSize: 16,color: titleTextColor,paddingRight:10}}>{txt}</Text>
            </View>
        </View>;
    }
}

const styles = StyleSheet.create({
    container: {
        margin: 10,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 6,
        shadowColor: 'gray',
        shadowOffset: {height: 2, width: 2},
        shadowRadius: 3,
        shadowOpacity: 0.2,
        elevation: 2,
    },
    inputLayout:{
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        paddingBottom: 5,
    }   ,
    holderText: {
        color: titleTextColor,
        fontSize: 16,
        width:90,
        textAlign:'right',
    },
    input: {
        flex: 1,
        height: 40,
        backgroundColor:mainBackgroundColor,
        borderRadius:6,
        borderColor:placeholderTextColor,
        borderWidth:0.5,
        marginLeft:5,
        flexDirection:'row',
        alignItems: 'center',
    },
    inputText: {
        fontSize: 16,
        flex: 1,
        padding:0,
        // height: 40,
        borderRadius:6,
        paddingLeft:10,
    },
    textCon: {
        flex: 1,
        height: 40,
        backgroundColor:mainBackgroundColor,
        borderRadius:6,
        borderColor:placeholderTextColor,
        borderWidth:0.5,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        justifyContent:'center',
        marginLeft:5,
    },
    dropDown: {
        backgroundColor: mainColor,
        height: 40,
        width: 40,
        borderTopRightRadius: 3,
        borderBottomRightRadius: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    confirmTouch: {
        backgroundColor: mainColor,
        height: 40,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal:20,
        marginVertical:20,
    },
});
selector = (state) =>{
    return {
        token:state.loginStore.token,
    }
};
export default connect(selector)(RichMoreRegister);