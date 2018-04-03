import React, {Component} from 'react';
import {Dimensions, FlatList, Text, TouchableOpacity, View} from "react-native";
import Swiper from 'react-native-swiper';
import XImage from "../../../widgets/XImage";
import {contentTextColor, mainColor, placeholderTextColor, titleTextColor} from "../../../constraint/Colors";
import {connect} from "react-redux";
import {commonAction} from "../../../common/CommonAction";
const {width, height} = Dimensions.get('window');
class Sale extends Component{
    render(){
        let data=this.props.data;
        let dataList=[];
        for (let i = 0; i < data.contents.length; i++) {
            if (i > 1) dataList.push(data.contents[i]);
        }
        if (this.props.isIntegral)dataList=data.contents;
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
                            showsPagination={false}
                        >
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
                <View style={{backgroundColor:'#fff',marginVertical:5}}>
                    {
                        this.props.isIntegral?null:
                            <View style={{flexDirection:'row',borderBottomColor: placeholderTextColor, borderBottomWidth: 0.5,height:width*0.5*0.6}}>
                                <TouchableOpacity
                                    disabled={!data.contents[0]}
                                    style={{flex:1,borderRightColor: placeholderTextColor, borderRightWidth: 0.5}}
                                    activeOpacity={0.7}
                                    onPress={() => commonAction(this.props.dispatch,{item:data.contents[0],token:this.props.token})}>
                                    <XImage uri={data.contents[0]?data.contents[0].imgUrl:''} style={{width: width*0.5-0.5, flex:1}}/>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    disabled={!data.contents[1]}
                                    style={{flex:1}}
                                    activeOpacity={0.7}
                                    onPress={() => commonAction(this.props.dispatch,{item:data.contents[1],token:this.props.token})}>
                                    <XImage uri={data.contents[1]?data.contents[1].imgUrl:''} style={{flex:1}}/>
                                </TouchableOpacity>
                            </View>
                    }
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={dataList}
                        numColumns={4}
                        ItemSeparatorComponent={() => <View style={{height: 0.5, backgroundColor: placeholderTextColor}}/>}
                        keyExtractor={(item, index) => index}
                        renderItem={({item, index}) =>
                            <TouchableOpacity
                                key={index}
                                style={{borderRightColor: placeholderTextColor, borderRightWidth: 0.5, width: width / 4,padding:10}}
                                activeOpacity={0.7}//点击时的透明度
                                onPress={() => commonAction(this.props.dispatch,{item,token:this.props.token})}>
                                <Text numberOfLines={1} style={{fontSize:13,color:titleTextColor,marginBottom:3}}>{item.text}</Text>
                                <Text numberOfLines={1} style={{fontSize:11,color:contentTextColor}}>{item.subText}</Text>
                                <XImage uri={item.imgUrl} style={{marginTop:10,width: width / 4-20,height: width / 4-20,}}/>
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
export default connect(selector)(Sale);