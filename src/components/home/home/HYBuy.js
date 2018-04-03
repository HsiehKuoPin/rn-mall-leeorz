import React, {Component} from 'react';
import {Dimensions, FlatList, Text, TouchableOpacity, View} from "react-native";
import Swiper from 'react-native-swiper';
import XImage from "../../../widgets/XImage";
import {placeholderTextColor} from "../../../constraint/Colors";
import {connect} from "react-redux";
import {commonAction} from "../../../common/CommonAction";
import {ic_buy_more} from "../../../constraint/Image";
const {width, height} = Dimensions.get('window');
class HYBuy extends Component{
    render(){
        let data=this.props.data;
        return(
            <View>
                {
                    data.imgs.length===0?null:
                        <Swiper
                            removeClippedSubviews={false}
                            autoplayTimeout={3}
                            style={{height:  width * 0.26}}
                            loop={true}
                            autoplay={true}
                            showsPagination={false}>
                            {
                                data.imgs.map((item, i) => {
                                        return <TouchableOpacity
                                            key={i}
                                            activeOpacity={1}
                                            onPress={() => commonAction(this.props.dispatch,{item,token:this.props.token})}>
                                            <XImage uri={item.imgUrl} style={{resizeMode: 'stretch',width: width, height: width * 0.26}}/>
                                        </TouchableOpacity>
                                    }
                                )
                            }
                        </Swiper>
                }
                <View style={{backgroundColor:'#fff'}}>
                    {
                        (!this.props.isHYBuy)||data.imgs.length===0  ? null :
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
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={data.contents}
                        numColumns={2}
                        // ItemSeparatorComponent={() => <View style={{height: 0.5, backgroundColor: placeholderTextColor}}/>}
                        keyExtractor={(item, index) => index}
                        renderItem={({item, index}) =>
                            <TouchableOpacity
                                style={{flex:1, width: width*0.5,height:width*0.5*0.6}}
                                activeOpacity={0.7}
                                onPress={() => commonAction(this.props.dispatch,{item:item,token:this.props.token})}>
                                <XImage uri={item?item.imgUrl:''} style={{flex:1,margin:10}}/>
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
export default connect(selector)(HYBuy);