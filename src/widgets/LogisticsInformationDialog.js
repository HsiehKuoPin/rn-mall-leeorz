'use strict';
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
    TouchableOpacity,
    Animated,
    Easing,
    Dimensions,
    Platform,
    TextInput,
    DeviceEventEmitter
} from 'react-native';
import {titleTextColor,mainColor,placeholderTextColor,mainBackgroundColor} from "../constraint/Colors";
import {checkInputMoney} from "../common/StringUtil";
import {ic_n_drop_down} from "../constraint/Image";
import LogisticsDown from "../components/personal/service/LogisticsDown";

const {width, height} = Dimensions.get('window');
const navigatorH = 64; // navigator height
const [aWidth, aHeight] = [width, 314];
const [left, top] = [0, 0];

import {getRequestFailTip, isSuccess, post} from "../common/CommonRequest";
import {showToastShort} from "../common/CommonToast";

const [middleLeft, middleTop] = [(width - aWidth) / 2, (height - aHeight) / 2 - navigatorH];

export default class LogisticsInformationDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            offset: new Animated.Value(0),
            opacity: new Animated.Value(0),
            hide: true,
            title:'',
            valueCustom: 1,
            logisticsCompany:null, // 物流公司数据
            logisticsSingleNumber:'',
            user_order:'',
            courierName:'',  //物流公司
            courierKey:'',   // 物流公司key
        };
          this.token = this.props.token;
          this.afterSaleId = this.props.afterSaleId
    }

    componentDidMount() {
        this._getCourierCompanyList()

        DeviceEventEmitter.addListener('Informatio', (courierName, courierKey,) => {
            this.setState({
                courierName:courierName,
                courierKey:courierKey,
            })
        })
    }

    componentDidUnMount() {
        this.listener.remove();
    }

    _getCourierCompanyList(){
        post('main/getCourierCompanyList', {token: this.token})
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    this.setState({logisticsCompany: responseData.result.courierCompanyList})
                } else {
                    showToastShort(getRequestFailTip(responseData))
                }
            })
    }

    _getDetermineRequest(){
        let requestObj = {
            token: this.token,'courierName':this.state.courierName,'courierKey':this.state.courierKey,
            'courierNumber':this.state.logisticsSingleNumber,'afterSaleId':this.afterSaleId,
        };
        post('order/addCourier', requestObj)
            .then((responseData) => {
                if (responseData.status !== 10000) {
                    showToastShort(getRequestFailTip(responseData))
                }else
                {
                    showToastShort('提交成功')
                    DeviceEventEmitter.emit('isShowLogistics',true);
                    this.dismiss()
                }
            })
    }

    renderDetermine(){
        if (this.state.courierName === '') {
            showToastShort("您还没有填写物流公司...");
            return;
        } else if (this.state.logisticsSingleNumber === '') {
            showToastShort("您还没有物流单号...");
            return;
        }
        this._getDetermineRequest();
    }

    render() {
        let content = this.state.hide? null:( <View style={[styles.container, ]}>
            <Animated.View style={styles.mask}>
                <Text style={styles.mask} onPress={this.dismiss.bind(this)}/>
            </Animated.View>

            <Animated.View style={
                [styles.tip, {
                    transform: [{
                        translateY: this.state.offset.interpolate({
                            inputRange: [0, 1],
                            outputRange: [height/2.5, (height/2-100)]
                        }),
                    }]
                }]
            }>
                <View style={{marginHorizontal:10,backgroundColor:'white',borderRadius:3}}>
                    <View style={{flexDirection:'row',marginTop:20,alignItems:'center'}}>
                        <Text style={{color:titleTextColor,fontSize:18,marginLeft:20,marginRight:10}}>{'物流公司:'}</Text>

                        <View ref={'dropDown'} style={styles.textCon}>
                            <Text numberOfLines={1} style={this.state.user_order?[styles.text,{ color: titleTextColor}]
                                                                                :[styles.text,{ color: placeholderTextColor}]}>
                                {this.state.user_order?this.state.user_order:'填写物流公司'}</Text>
                        </View>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={styles.dropDown}
                            onPress={() => {
                                this.refs.dropDown.measureInWindow((x, y, width, height) => {
                                    this.refs.LogisticsDown.show(x, y, width+40, height+10);
                                });
                            }}
                        >
                            <Image style={{height: 13, width: 24, resizeMode: 'center'}} source={ic_n_drop_down}/>
                        </TouchableOpacity>
                    </View>

                    <View style={{flexDirection:'row',marginTop:20,alignItems:'center'}}>
                        <Text style={{color:titleTextColor,fontSize:18,marginLeft:20,marginRight:10}}>{'物流单号:'}</Text>
                        <View style={styles.textInputStyle}>
                            <TextInput
                                placeholder={'  填写物流单号'}
                                underlineColorAndroid='transparent'
                                keyboardType='default'
                                style={{flex: 1, paddingHorizontal:5, fontSize: 18, borderRadius:3}}
                                autoFocus={true}
                                autoCapitalize="none"
                                value={checkInputMoney(this.state.logisticsSingleNumber)}
                                onChangeText={(text) => {
                                    this.setState({ logisticsSingleNumber:text})
                                }}
                            />
                        </View>
                    </View>

                    <TouchableOpacity activeOpacity={0.7} style={{backgroundColor:mainColor,margin:20,height:40, borderRadius: 3,}} onPress={()=> this.renderDetermine()}>
                        <Text style={{color:'white',paddingVertical:12,textAlign:'center',fontSize:17}}>确定</Text>
                    </TouchableOpacity>

                    <LogisticsDown data={this.state.logisticsCompany} ref={'LogisticsDown'} selectValue={(user_order)=> this.setState({user_order})}/>

                </View>
            </Animated.View>
        </View>);

        return content;
    }

    //显示动画
    in() {
        Animated.parallel([
            Animated.timing(this.state.opacity,
                {
                    // easing: Easing.spring,
                    duration: 250,
                    toValue: 0.8,
                }
            ),
            Animated.timing(this.state.offset,
                {
                    // easing: Easing.spring,
                    duration: 250,
                    toValue: 1,
                }
            )
        ]).start();
    }

    //隐藏动画
    out(){
        Animated.parallel([
            Animated.timing(this.state.opacity,
                {
                    // easing: Easing.linear,
                    duration: 0,
                    toValue: 0,
                }
            ),
            Animated.timing(this.state.offset,
                {
                    // easing: Easing.linear,
                    duration: 0,
                    toValue: 0,
                }
            )
        ]).start();

        setTimeout(() => this.setState({hide: true}), 0.00001);
    }

    //取消
    dismiss(event) {
        if(!this.state.hide){
            this.out();
        }
    }

    //选择
    choose(msg) {
        if(!this.state.hide){
            this.out();
        }
    }

    show(title) {
        if(this.state.hide){
            this.setState({hide: false, title: title}, this.in);
        }
    }
}

const styles = StyleSheet.create({
    container: {
        position:"absolute",
        width:width,
        height:height,
        left:left,
        top:top,
        elevation: 5,
    },
    mask: {
        justifyContent:"center",
        backgroundColor:"#383838",
        opacity:0.3,
        position:"absolute",
        width:width,
        height:height,
        left:left,
        top:top,
    },
    tip: {
        width:aWidth,
        height:250,
        left:middleLeft,
        backgroundColor:'transparent'

    },
    textInputStyle:{
        flex:1,
        height: 42,
        marginRight:20,
        backgroundColor:mainBackgroundColor,
        borderRadius:6,
        borderColor:placeholderTextColor,
        borderWidth:0.5,
        justifyContent:'center',
    },
    dropDown: {
        backgroundColor: mainColor,
        height: 40,
        width: 40,
        borderTopRightRadius: 3,
        borderBottomRightRadius: 3,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight:20
    },
    text: {
        fontSize: 18,
        marginLeft:10,
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
    },
});



