import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    DeviceEventEmitter
} from 'react-native';

import {connect} from 'react-redux';
import TitleBar from '../../../widgets/TitleBar';
import {
    mainBackgroundColor,
    titleTextColor,
    content2TextColor,
    contentTextColor,
    placeholderTextColor
} from '../../../constraint/Colors';
import styles from '../../../styles/recharge_style';
import {showToastShort} from '../../../common/CommonToast';
import {goBack, goto} from '../../../reducers/RouterReducer';
import {post, getRequestFailTip, isSuccess} from '../../../common/CommonRequest';
import PayPasswordView from '../../../widgets/PayPasswordView';
import {checkInputMoney} from "../../../common/StringUtil";
import {isTrue} from "../../../common/AppUtil";

class TurnOut extends Component {

    constructor(props) {
        super(props);
        this.state = {
            money: '',
        }
    }


    render() {
        return (
            <View style={{backgroundColor: mainBackgroundColor, flex: 1}}>
                <TitleBar title={'转出'}/>
                <View style={styles.container}>
                    <View style={{flexDirection: 'row', marginTop: 30, marginLeft: 30}}>
                        <Text style={{color: titleTextColor, fontSize: 16}}>转出金额</Text>
                    </View>
                    <View style={{marginLeft: 30}}>
                        <View style={{height: 120}}>
                            <Text style={styles.symbol}>￥</Text>
                            <TextInput
                                keyboardType={"numeric"}
                                style={styles.inputLayout}
                                underlineColorAndroid={'transparent'}
                                value={this.state.money}
                                onChangeText={(text) => this.setState({money: checkInputMoney(text)})}
                            />
                        </View>
                        <View style={styles.inputLine}/>
                        <View style={{flexDirection: 'row', marginTop: 15,alignItems:'center'}}>
                            <Text style={{
                                color: contentTextColor,
                                fontSize: 15
                            }}>可用余额: 10086</Text>
                            <TouchableOpacity activeOpacity={0.7} style={{marginLeft:20}}>
                            <Text style={{fontSize:15,color:'#2B8FFF'}}>{'全部转出'}</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={{color: placeholderTextColor, fontSize: 15, marginTop: 10}}>注: 转出的商家余额将入账账户余额</Text>
                    </View>
                    <TouchableOpacity style={styles.recharge}>
                        <Text style={{color: 'white', fontSize: 17, alignSelf: 'center'}}>确认转出</Text>
                    </TouchableOpacity>
                </View>

            </View>
        )
    }
}

export default connect()(TurnOut)