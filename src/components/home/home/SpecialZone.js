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
import {ic_buy_more} from "../../../constraint/Image";
const {width, height} = Dimensions.get('window');
class SpecialZone extends Component{
    render(){
        let data=this.props.data;
        return(
            <View style={{backgroundColor:'#fff'}}>
                {
                    data.imgs.length===0?null:
                        <Swiper
                            removeClippedSubviews={false}
                            autoplayTimeout={3}
                            style={{height:  width * 0.33}}
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
                                            <XImage uri={item.imgUrl} style={{width: width, height: width * 0.33,resizeMode: 'stretch',}}/>
                                        </TouchableOpacity>
                                    }
                                )
                            }
                        </Swiper>
                }
                {
                    (!this.props.isHYBuy)||data.imgs.length===0 ? null :
                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={{
                                width: width,
                                height: 40,
                                justifyContent: 'center',
                                alignItems: 'flex-end',
                                borderBottomColor: placeholderTextColor,
                                borderBottomWidth: 0.5,
                                paddingRight:10,
                            }}
                            onPress={() => {
                                if(data.imgs.length>0){
                                    commonAction(this.props.dispatch, {item:data.imgs[0], token: this.props.token})
                                }}
                            }>
                            <View style={{flexDirection: 'row',alignItems:'center'}}>
                                <Text style={{fontSize: 15,marginRight:3}}>更多</Text>
                                <XImage source={ic_buy_more} style={{width: 18, height: 18}}/>
                            </View>
                        </TouchableOpacity>
                }
                <View style={{paddingLeft: 10}}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={data.contents}
                        numColumns={3}
                        keyExtractor={(item, index) => index}
                        renderItem={({item,index}) =>
                            <TouchableOpacity
                                key={index}
                                activeOpacity={0.7}//点击时的透明度
                                style={{marginVertical: 10, marginRight:10, justifyContent:'center',width: (width - 40) / 3}}
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

export default connect(selector)(SpecialZone);