import React, {Component} from 'react';
import {View, Dimensions, TouchableOpacity} from "react-native";
import Swiper from 'react-native-swiper';
import {connect} from "react-redux";
import {commonAction} from "../common/CommonAction";
import XImage from "./XImage";
import {mainColor} from "../constraint/Colors";

var deviceWidth = Dimensions.get('window').width;

/**
 * 广告轮播图
 */
class Carousel extends Component {
    render() {
        return (
                <Swiper
                    removeClippedSubviews={false}
                    autoplayTimeout={3}
                    style={{height: deviceWidth * 0.359375,}}
                    loop={true}
                    autoplay={true}
                    paginationStyle={{bottom: 10,justifyContent:'flex-end',marginRight:10}}
                    dot={<View style={{
                        backgroundColor: '#cacaca',
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        marginLeft: 4,
                        marginRight: 4
                    }}/>}
                    activeDot={<View style={{
                        backgroundColor: mainColor,
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        marginLeft: 4,
                        marginRight: 4
                    }}/>}>
                    {
                        this.props.data.map((item, i) => {
                                return (
                                    <TouchableOpacity
                                        activeOpacity={1}//点击时的透明度
                                        key={i}
                                        onPress={() => {

                                            commonAction(this.props.dispatch,{item,token:this.props.token,isRealName:this.props.isRealNameAuth,isHasRecommend:this.props.isHasRecommend});
                                            // this.props.dispatch(goto(this.props.isFromCart?'ProductCarDetail':'ProductDetail',item.id));
                                        }}>
                                        <XImage uri={item.imgUrl} style={{height: deviceWidth * 0.359375}}/>
                                    </TouchableOpacity>
                                );
                            }
                        )
                    }
                </Swiper>
        )
    }
}

selector = (state) => {
    return {
        token: state.loginStore.token,
        isRealNameAuth:state.loginStore.otherConfig.isRealNameAuth,
        isHasRecommend: state.loginStore.otherConfig.isHasRecommend,
    }
};

export default connect(selector)(Carousel);