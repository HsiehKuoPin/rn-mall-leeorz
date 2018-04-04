import React, {Component} from 'react';
import {View, Dimensions, TouchableOpacity, ImageBackground} from "react-native";
import Swiper from 'react-native-swiper';
import {connect} from "react-redux";
import {commonAction} from "../../../common/CommonAction";
import XImage from "../../../widgets/XImage";
import {mainColor} from "../../../constraint/Colors";
import {ic_street_banner, ic_street_brand, ic_street_discount} from "../../../constraint/Image";

var deviceWidth = Dimensions.get('window').width;

/**
 * 广告轮播图
 */
class CarouselHome extends Component {
    render() {
        let {isHeight, isNeedDot} = this.props;
        let dot = isNeedDot ? <View/> : (<View style={{
            backgroundColor: '#cacaca',
            width: 8,
            height: 8,
            borderRadius: 4,
            marginLeft: 4,
            marginRight: 4
        }}/>);
        let activeDot = isNeedDot ? <View/> : (<View style={{
            backgroundColor: mainColor,
            width: 8,
            height: 8,
            borderRadius: 4,
            marginLeft: 4,
            marginRight: 4
        }}/>);
        return (
            <View style={{height: isHeight ? deviceWidth * 0.8 : deviceWidth * 0.6}}>
                <Swiper
                    removeClippedSubviews={false}
                    autoplayTimeout={3}
                    style={{height: isHeight ? deviceWidth * 0.8 : deviceWidth * 0.6}}
                    loop={true}
                    autoplay={true}
                    paginationStyle={{bottom: 10}}
                    dot={dot}
                    activeDot={activeDot}>
                    {
                        this.props.data.map((item, i) => {
                                return (
                                    <TouchableOpacity
                                        activeOpacity={1}//点击时的透明度
                                        key={i}
                                        onPress={() => {
                                            commonAction(this.props.dispatch, {
                                                item,
                                                token: this.props.token,
                                                isRealName: this.props.isRealNameAuth,
                                                isHasRecommend: this.props.isHasRecommend
                                            });
                                        }}>
                                        <XImage uri={item.imgUrl}
                                                style={{
                                                    height: isHeight ? deviceWidth * 0.8 : deviceWidth * 0.6,
                                                    resizeMode: 'stretch'
                                                }}/>
                                    </TouchableOpacity>
                                );
                            }
                        )
                    }
                </Swiper>
                {/*{*/}
                {/*!this.props.action ? null :*/}
                {/*<XImage source={ic_street_banner} style={{position:'absolute',bottom:0,width: deviceWidth,height:deviceWidth*0.22,resizeMode:'cover'}}/>*/}
                {/*}*/}
                {/*{*/}
                {/*!this.props.action ? null :*/}
                {/*<XImage source={this.props.action==='APP_HOME_DISCOUNT'?ic_street_discount:ic_street_brand}*/}
                {/*style={{position:'absolute',bottom:12,width: deviceWidth * 0.5,marginLeft:deviceWidth * 0.25,height:deviceWidth * 0.5* 0.13}}/>*/}
                {/*}*/}
            </View>
        )
    }
}

selector = (state) => {
    return {
        token: state.loginStore.token,
        isRealNameAuth: state.loginStore.otherConfig.isRealNameAuth,
        isHasRecommend: state.loginStore.otherConfig.isHasRecommend,
    }
};

export default connect(selector)(CarouselHome);