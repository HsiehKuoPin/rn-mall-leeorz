import React, {Component} from 'react';
import {
    TextInput,
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    Keyboard
} from 'react-native';

import {connect} from 'react-redux';
import TitleBar from '../../../widgets/TitleBar';
import {goBack} from '../../../reducers/RouterReducer';
import {showToastShort} from '../../../common/CommonToast';
import {post, getRequestFailTip,isSuccess} from '../../../common/CommonRequest';
import {mainBackgroundColor, mainColor, placeholderTextColor} from "../../../constraint/Colors";
import {notifyUpdateAddressList} from "../../../reducers/CacheReducer";
import Region from "../../../widgets/Region"
import {
    checkInputEmoji,
    checkInputIsNumber, checkInputPassword, checkPhone,
    replaceBlank
} from "../../../common/StringUtil";

class EditAddress extends Component {

    constructor(props) {
        super(props);
        this.addressData = this.props.navigation.state.params.addressDetail;
        this.state = this.addressData?{...this.addressData}:{
            contactPerson: '',
            phone: '',
            area: '',
            addressDetail: '',
            postcode: '',
            regions:undefined,
        };
    }

    lostBlur(){
        Keyboard.dismiss();
        this.refs.Region.show()
    }

    render() {
        return (
            <View style={styles.container}>
                <TitleBar
                    title={'编辑收货地址'}
                    hideRight={true}
                    isWhiteBackIco={true}
                    customBarStyle={{backgroundColor: mainColor}}
                    customBarTextStyle={{color: 'white'}}/>
                <View style={styles.ViewStyle}>
                    <View style={styles.viewStyle}>
                        <Text style={styles.textStyle}>收件人:</Text>
                        <TextInput
                            maxLength={20}
                            placeholder="收件人姓名"
                            defaultValue={this.state.contactPerson}
                            placeholderTextColor={placeholderTextColor}
                            underlineColorAndroid={'transparent'}
                            style={styles.registerInput}
                            onChangeText={(contactPerson) => this.setState({contactPerson})}
                        />
                    </View>
                    <View
                        style={{marginLeft: 15, marginRight: 15, backgroundColor: placeholderTextColor, height: 0.5}}/>
                    <View style={styles.viewStyle}>
                        <Text style={styles.textStyle}>手机号:</Text>
                        <TextInput
                            maxLength={11}
                            placeholder="收件人手机号"
                            keyboardType={"numeric"}
                            autoCapitalize="none"
                            placeholderTextColor={placeholderTextColor}
                            selectTextOnFocus={true}
                            underlineColorAndroid={'transparent'}
                            style={styles.registerInput}
                            value={this.state.phone}
                            onChangeText={(text) => this.setState({phone:checkInputPassword(text)})}
                        />
                    </View>
                    <View
                        style={{marginLeft: 15, marginRight: 15, backgroundColor: placeholderTextColor, height: 0.5}}/>
                    <View style={styles.viewStyle}>
                        <Text style={styles.textStyle}>选择地址:</Text>
                        <Text style={styles.selectStyle}
                              suppressHighlighting={true}
                              onPress={
                                  this.lostBlur.bind(this)
                              }>{this.state.area !== '' ? this.state.area : '\u2000\u2000' + '省份' + '\u2000\u2000' + '城市' + '\u2000\u2000' + '县区'}</Text>

                    </View>
                    <View
                        style={{marginLeft: 15, marginRight: 15, backgroundColor: placeholderTextColor, height: 0.5}}/>
                    <View style={styles.viewStyle}>
                        <Text style={styles.textStyle}>详细地址:</Text>
                        <TextInput
                            placeholder="街道门牌号"
                            placeholderTextColor={placeholderTextColor}
                            defaultValue={this.state.addressDetail}
                            underlineColorAndroid={'transparent'}
                            style={styles.registerInput}
                            onChangeText={(addressDetail) => this.setState({addressDetail})}
                        />
                    </View>
                    <View
                        style={{marginLeft: 15, marginRight: 15, backgroundColor: placeholderTextColor, height: 0.5}}/>
                    <View style={styles.viewStyle}>
                        <Text style={styles.textStyle}>邮政编码:</Text>
                        <TextInput
                            maxLength={6}
                            placeholder="邮政编码"
                            keyboardType={"numeric"}
                            placeholderTextColor={placeholderTextColor}
                            defaultValue={this.state.postcode}
                            underlineColorAndroid={'transparent'}
                            style={styles.registerInput}
                            value={this.state.postcode}
                            onChangeText={(text) => this.setState({postcode:checkInputPassword(text)})}
                        />
                    </View>
                    <View
                        style={{marginLeft: 15, marginRight: 15, backgroundColor: placeholderTextColor, height: 0.5}}/>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.touchCommit}
                        onPress={this.onPress.bind(this)}>
                        <Text style={{fontSize: 18, color: '#fff'}}>确认保存</Text>

                    </TouchableOpacity>
                </View>
                <Region
                    ref={'Region'}
                    onSurePress={(value) => {
                        this.setState({
                            regions: {provinceCode:value.province.id,cityCode:value.city.id,zoneCode:value.area.id},
                            area: value.province.name + value.city.name + value.area.name
                        })
                    }}
                    // onValueChange={onValueChange => console.warn(JSON.stringify(onValueChange))}
                />

            </View>
        );
    }

    onPress = () => {
        let info = {};
        Object.keys(this.state).map(key=> Object.assign(info,{[key]:replaceBlank(this.state[key])}));

        let {id,contactPerson, phone, area, addressDetail, postcode} = {...info};

        if (contactPerson.length === 0) {
            showToastShort("您还没有输入收件人姓名...");
            return;
        } else if (phone.length === 0) {
            showToastShort("您还没有输入手机号码...");
            return;
        } else if (area.length === 0) {
            showToastShort("您还没有选择地区...");
            return;
        } else if (addressDetail.length === 0) {
            showToastShort("您还没输入详细地址...");
            return;
        } else if(checkInputEmoji(addressDetail)){
            showToastShort("您的详细地址存在特殊字符,请检查...");
            return;
        }

        let requestObj = {
            'address': {id, contactPerson, phone, area, addressDetail, postcode, ...this.state.regions},
            token: this.props.token
        };
        let url = this.addressData?'user/updateAddress':'user/createAddress';
        let tips = this.addressData?'编辑成功':'新增成功';
        post(url, requestObj,true)
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    showToastShort(tips);
                    this.props.dispatch(notifyUpdateAddressList(new Date().valueOf()));
                    this.props.dispatch(goBack());
                } else {
                    showToastShort(getRequestFailTip(responseData))
                }
            }).catch((e) => {
                console.warn(e.message);
                showToastShort(getRequestFailTip())
        });
    };

    errMsg(msg) {
        showToastShort(msg);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: mainBackgroundColor
    },
    ViewStyle: {
        margin: 10,
        backgroundColor: 'white',
        borderRadius: 5,
        shadowColor: 'gray',
        shadowOffset: {height: 4, width: 4},
        shadowRadius: 3,
        shadowOpacity: 0.2,
        elevation: 4
    },
    viewStyle: {
        margin: 10,
        marginLeft: 15,
        marginRight: 15,
        height: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textStyle: {
        fontSize: 16,
        marginLeft: 10,
        marginRight: 15,
    },
    registerInput: {
        fontSize: 16,
        flex: 1,
    },
    selectStyle: {
        flex: 1,
        fontSize: 16,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#00000000'
    },
    touchCommit: {
        backgroundColor: mainColor,
        margin: 30,
        marginLeft: 45,
        marginRight: 45,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        height: 45

    },
});

selector = (state) => {
    return {
        token: state.loginStore.token
    }
};

export default connect(selector)(EditAddress);