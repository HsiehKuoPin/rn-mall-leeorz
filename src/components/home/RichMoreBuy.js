import React, {Component} from 'react'
import {View, StyleSheet, Image, TouchableOpacity, Text, Dimensions, ImageBackground,ScrollView} from 'react-native';
import {connect} from "react-redux";
import TitleBar from "../../widgets/TitleBar";
import {goto} from "../../reducers/RouterReducer";
import LoadingView from "../../widgets/LoadingView";
import RequestErrorView from "../../widgets/RequestErrorView";
import { content2TextColor, titleTextColor} from "../../constraint/Colors";
import {ic_n_left, ic_n_more_bg, ic_n_more_chassis, ic_n_more_title, ic_n_right} from "../../constraint/Image";
import Swiper from 'react-native-swiper';
import {getRequestFailTip,isSuccess, post} from "../../common/CommonRequest";
import {showToastShort} from "../../common/CommonToast";
import {formatMoney} from "../../common/StringUtil";
import BaseComponent from "../../widgets/BaseComponent";

const {width, height} = Dimensions.get('window');
const contentImageWidth = (width - 80 - 16 * 2) * 0.7;
class RichMoreBuy extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            isRequestError: false,
            isLoading: true,
            data: [],
            index:0,
        };
    }

    componentDidMount(){
        this._loadNPlusComboList();
    }

    _loadNPlusComboList(){
        post('product/activity/combo/listNplusCombo')
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    this.setState({
                        data: responseData.result,
                        isLoading:false,
                        isRequestError: false,
                    });
                } else{
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
            <ImageBackground
                resizeMode='stretch'
                source={{uri: ic_n_more_bg}}
                style={{flex: 1}}>
                <TitleBar title={'富诚N+'} customBarStyle={{backgroundColor: 'transparent'}}/>
                {this.state.isLoading ? <LoadingView/> : (!this.state.isRequestError ? (this.state.data.length===0?null:this.showView()) :
                    <RequestErrorView onPress={() => {
                        this.setState({isRequestError: false, isLoading: true});
                        this._loadNPlusComboList();
                    }}/>)
                }
            </ImageBackground>
        )
    }

    showView() {
        let itemData = this.state.data[this.state.index];
        return (
            <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1, paddingHorizontal: 40}}>
                <Image source={{uri: ic_n_more_title}} style={styles.imgTitle}/>

                    <View style={{marginTop:35,}}>
                        <Image source={{uri: ic_n_more_chassis}} style={styles.imgChassis}/>
                        <Swiper
                        style={{height: contentImageWidth * 0.7,}}
                        showsPagination={false}
                        showsButtons={true}
                        loop={false}
                        autoplay={false}
                        onIndexChanged={index => this.setState({index})}
                        prevButton={<Image source={ic_n_left} style={styles.imgNext}/>}
                        nextButton={<Image source={ic_n_right} style={styles.imgNext}/>}
                    >
                        {
                            this.state.data.map((item, index) => {
                                    return <Image key={index} source={{uri: item.detailImg}} style={styles.img}/>
                                }
                            )
                        }
                    </Swiper>

                    </View>
                <View style={styles.bottom}>
                    <Text style={styles.textTitle}>￥<Text
                        style={{fontSize: 26}}>{formatMoney(itemData.price,false)}</Text></Text>
                    <Text style={styles.text}>可使用玉积分 {formatMoney(itemData.jadeIntegralPay,false)}，余额 {formatMoney(itemData.balancePay,false)}</Text>
                    {/*<Text style={styles.textContent} numberOfLines={2}>{itemData.items}</Text>*/}
                    <Text style={styles.textContent}>{itemData.name}</Text>
                </View>
                <TouchableOpacity activeOpacity={1} style={styles.touch}
                                  onPress={() => {
                                      if(this.checkUserTokenValid()){
                                          this.props.dispatch(goto('RichMoreConfirmOrder',itemData.id));
                                      }
                                  }}>
                    <Text style={{color: '#fff', fontSize: 18}}>立 即 购 买</Text>
                </TouchableOpacity>
            </ScrollView>
        )
    }
    isForceLogout(){
        return false;
    }
}

const styles = StyleSheet.create({
    imgTitle: {
        width: width - 80,
        height: (width - 80) * 0.65,
        resizeMode: 'contain'
    },
    img: {
        width: contentImageWidth,
        height: contentImageWidth * 0.7,
        resizeMode: 'contain',
        alignSelf: 'center',
    },
    imgNext: {
        width: 16,
        height: 41,
        resizeMode: 'contain'
    },
    imgChassis: {
        position:'absolute',
        bottom:-20,
        width: width - 80,
        height: (width - 80) * 0.2,
        resizeMode: 'contain',
        // marginTop: contentImageWidth * -0.3,
    },
    bottom: {
        marginTop:50,
        backgroundColor:'#fff',
        borderTopRightRadius:8,
        borderTopLeftRadius:8,
        padding:15,
        // marginTop:10
    },
    textTitle:{
        color: '#4673fd',
        fontSize: 18
    },
    textContent:{
        color: titleTextColor,
        fontSize: 16,
        paddingVertical:2
    },
    text:{
        color:content2TextColor,
        fontSize:14,
        paddingVertical:2,
        marginBottom:10
    },
    touch:{
        borderBottomLeftRadius:8,
        borderBottomRightRadius:8,
        backgroundColor:'#4673ff',
        justifyContent:'center',
        alignItems:'center',
        height:45,
        marginBottom:20
    },
});
selector = (state) =>{
    return {
        token:state.loginStore.token,
    }
};

export default connect(selector)(RichMoreBuy);