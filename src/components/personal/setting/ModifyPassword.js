import React, {Component} from 'react';
import {
    TextInput,
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from 'react-native';
import {connect} from 'react-redux';
import TitleBar from "../../../widgets/TitleBar";
import {mainBackgroundColor, mainColor, placeholderTextColor, titleTextColor} from "../../../constraint/Colors";
import {showToastShort} from "../../../common/CommonToast";
import {isSuccess, post} from "../../../common/CommonRequest";
import {goBack} from "../../../reducers/RouterReducer";
import {encryption} from "../../../common/StringUtil";

const {width} = Dimensions.get('window');

class ModifyPassword extends Component{
    constructor(props) {
        super(props);
        this.state = {
            old_psw: '',
            new_psw: '',
            confirm_psw: '',
        };
    }

    _submit = () => {
        if (this.state.old_psw === '') {
            showToastShort("您还没有输入旧密码...")
        }else if (this.state.old_psw.length < 6) {
            showToastShort("密码要在6~20位之间哦...")
        }  else if (this.state.new_psw === '') {
            showToastShort("您还没输入新登录密码...")
        } else if (this.state.new_psw.length < 6) {
            showToastShort("密码要在6~20位之间哦...")
        } else if (this.state.confirm_psw === '') {
            showToastShort("您还没输入确认密码...")
        } else if (this.state.confirm_psw.length < 6) {
            showToastShort("密码要在6~20位之间哦...")
        } else if (this.state.new_psw !== this.state.confirm_psw) {
            showToastShort("密码不一致...")
        } else {
            let requestObj = {
                token:this.props.token,
                'oldPassword': encryption(this.state.old_psw),
                'password': encryption(this.state.new_psw),
            };
            post('user/editPassword', requestObj,true)
                .then((responseData) => {
                    if (isSuccess(responseData)) {
                        showToastShort("修改密码成功");
                        this.props.dispatch(goBack());
                    } else if (responseData.status === 10001) {
                        this.errMsg(responseData.message)
                    } else {
                        this.errMsg("修改密码失败，请稍后再试")
                    }
                })
        }
    };

    render(){
        return (
            <View style={{backgroundColor: mainBackgroundColor, flex: 1,}}>
                <TitleBar title={'修改登录密码'}/>
                <View style={{marginTop: 10,backgroundColor: 'white', borderRadius: 5, marginHorizontal: 10,}}>

                    <View style={styles.itemLayout}>
                        <View style={styles.inputLayout}>
                            <Text style={styles.holderText}>旧登录密码:</Text>
                            <TextInput
                                maxLength={20}
                                placeholder="填写您现在的登录密码"
                                placeholderTextColor={placeholderTextColor}
                                underlineColorAndroid={'transparent'}
                                style={[styles.input,]}
                                secureTextEntry={true}
                                onChangeText={(old_psw) => this.setState({old_psw})}
                            />
                        </View>

                        <View style={styles.inputLayout}>
                            <Text style={styles.holderText}>新登录密码:</Text>
                            <TextInput
                                maxLength={20}
                                placeholder="设置您的新登录密码"
                                placeholderTextColor={placeholderTextColor}
                                underlineColorAndroid={'transparent'}
                                // keyboardType={"numeric"}
                                style={[styles.input,]}
                                secureTextEntry={true}
                                onChangeText={(new_psw) => this.setState({new_psw})}
                            />
                        </View>

                        <View style={styles.inputLayout}>
                            <Text style={styles.holderText}>确认密码:</Text>
                            <TextInput
                                maxLength={20}
                                placeholder="确认您的新登录密码"
                                placeholderTextColor={placeholderTextColor}
                                underlineColorAndroid={'transparent'}
                                // keyboardType={"numeric"}
                                style={[styles.input,]}
                                secureTextEntry={true}
                                onChangeText={(confirm_psw) => this.setState({confirm_psw})}
                            />
                        </View>

                        <Text style={styles.tipsText}>6-20英文字母、数字或符号组成</Text>

                        <TouchableOpacity style={styles.buttonStyle} activeOpacity={0.7}
                                          onPress={() => this._submit()}>
                            <Text style={styles.buttonText}>确定修改</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };
}

const styles = StyleSheet.create({
    inputLayout:{
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 13,
        borderBottomColor: placeholderTextColor,
        paddingBottom: 5,
        borderBottomWidth: 0.5,
    },
    itemLayout:{
        marginTop: 10,
        paddingLeft:20,
        paddingRight:20,
    },
    holderText: {
        color: titleTextColor,
        fontSize: 15,
        width:90,
        backgroundColor: 'white'
    },
    tipsText: {
        color: placeholderTextColor,
        fontSize: 14,
        marginTop:20,
    },
    buttonStyle: {
        backgroundColor: mainColor,
        width: width * 0.7,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        marginTop: 30,
        marginBottom: 30,
        marginLeft: (width - width * 0.7 - 60) / 2
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    input: {
        fontSize: 16,
        flex: 1,
        height: 40,
    },
});

selector = (state) => {
    return {
        token: state.loginStore.token,
    }
};

export default connect(selector)(ModifyPassword);