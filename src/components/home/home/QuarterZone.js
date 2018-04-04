import React, {Component} from 'react';
import {Dimensions, FlatList, Text, TouchableOpacity, View} from "react-native";
import {commonAction} from "../../../common/CommonAction";
import XImage from "../../../widgets/XImage";
import Swiper from 'react-native-swiper';
import {getMiddle} from "../../../common/PhotoUtil";
import {mainColor, placeholderTextColor, priceColor, titleTextColor} from "../../../constraint/Colors";
import {formatMoney} from "../../../common/StringUtil";
import {gotoDetail} from "../../../common/ProductUtil";
import {connect} from "react-redux";
const {width, height} = Dimensions.get('window');
class QuarterZone extends Component{
    render(){
        let data=this.props.data;
        return(
            <View style={{backgroundColor:'#fff',marginBottom:5}}>
                {
                    data.imgs.length===0?null:
                        <Swiper
                            removeClippedSubviews={false}
                            autoplayTimeout={3}
                            style={{height:  width * 0.6}}
                            loop={true}
                            autoplay={true}
                            showsPagination={false}
                        >
                            {
                                data.imgs.map((item, i) => {
                                        return <TouchableOpacity
                                            key={i}
                                            activeOpacity={1}
                                            onPress={() => commonAction(this.props.dispatch,{item,token:this.props.token})}>
                                            <XImage uri={item.imgUrl} style={{resizeMode: 'stretch',width: width, height: width * 0.6}}/>
                                        </TouchableOpacity>
                                    }
                                )
                            }
                        </Swiper>
                }
                <View >
                    <FlatList
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        data={data.contents}
                        keyExtractor={(item, index) => index}
                        renderItem={({item,index}) =>
                            <TouchableOpacity
                                key={index}
                                activeOpacity={0.7}//点击时的透明度
                                style={{marginVertical: 10, marginLeft:10,marginRight:(index===data.contents.length-1)?10:0, justifyContent:'center',width: (width - 40) / 3}}
                                onPress={() => commonAction(this.props.dispatch,{item,token:this.props.token})}>
                                <XImage uri={getMiddle(item.imgUrl)}
                                        style={{marginBottom: 10, width: (width - 40) / 3,height:(width - 40) / 3}}/>
                                <Text numberOfLines={1} style={{fontSize:12.5,color:titleTextColor}}>{item.text}</Text>
                                <View style={{flexDirection:'row'}}>
                                    <Text numberOfLines={1}
                                          style={{fontSize:12,color:priceColor,paddingTop:3,flex:1}}>{formatMoney(item.price)}</Text>
                                    {/*{
                                        (index + 1) % 3 !== 0 ? null :
                                            <Text numberOfLines={1}
                                                  style={{
                                                      fontSize: 13,
                                                      color: placeholderTextColor,
                                                      paddingTop: 3,
                                                      textDecorationLine: 'line-through'
                                                  }}>{formatMoney(item.price)}</Text>
                                    }*/}
                                </View>
                            </TouchableOpacity>
                        }/>
                </View>
            </View>
        )
    }
}
selector = (state) => {
    return {
        token: state.loginStore.token,
    }
};
export default connect(selector)(QuarterZone);