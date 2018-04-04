import React, {Component} from 'react';
import {View, Dimensions, TouchableOpacity, Platform} from "react-native";
import Swiper from 'react-native-swiper';
import {connect} from "react-redux";
import {goto} from "../reducers/RouterReducer";
import XImage from "./XImage";
import {mainColor} from "../constraint/Colors";

var width = Dimensions.get('window').width;

/**
 * 商品详情广告轮播图
 */
class CarouselProduct extends Component {
    render() {
        let {dispatch} = this.props;
        let imgUrlList = [];
        for (let i = 0; i < this.props.data.length; i++) {
            imgUrlList.push(this.props.data[i].path)
        }
        return (
            <View style={{height: width}}>
                <Swiper
                    autoplayTimeout={3}
                    loop={true}
                    autoplay={true}
                    paginationStyle={{bottom: 10, justifyContent: 'flex-end', marginRight: 10}}
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
                        imgUrlList.map((item, i) => {
                                return (
                                    <TouchableOpacity
                                        activeOpacity={1}//点击时的透明度
                                        key={i}
                                        onPress={() => {
                                            dispatch(goto('PhotoView', {imgUrlList: imgUrlList, index: i}))
                                        }}>
                                        <XImage uri={item}
                                                style={{
                                                    resizeMode:'cover',
                                                    height: width,
                                                }}/>
                                    </TouchableOpacity>
                                );
                            }
                        )
                    }
                </Swiper>
            </View>
        )
    }
}

export default connect()(CarouselProduct);