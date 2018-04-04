import React, {Component} from 'react';
import {FlatList, Text, TouchableOpacity, View, Dimensions, ImageBackground} from 'react-native';
import {connect} from "react-redux";
import XImage from "../../../widgets/XImage";
import {commonAction} from "../../../common/CommonAction";
import {mainColor} from "../../../constraint/Colors";
import {ic_street_bg} from "../../../../resources/index";
import {SCREEN_WIDTH} from "../../../common/AppUtil";

const {width, height} = Dimensions.get('window');
class GuideStreet extends Component {
    render() {
        return (
            <View>
                <View style={{width:'100%',height:'100%',backgroundColor:mainColor,flex:1,position: 'absolute',opacity:0.4}} />
                <FlatList
                    style={{marginVertical : 15}}
                    showsVerticalScrollIndicator={false}
                    data={this.props.data}
                    numColumns={4}
                    ItemSeparatorComponent={() => <View style={{height: 10}}/>}
                    keyExtractor={(item, index) => index}
                    renderItem={({item, index}) =>
                        <TouchableOpacity
                            key={index}
                            style={{
                                width: width/4,
                                flex: 1,
                                paddingHorizontal : 15,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            activeOpacity={0.7}
                            onPress={() => {
                                commonAction(this.props.dispatch,{item,token:this.props.token})
                            }}>
                            <View style={{width:width/4-30, height: width/4-30,borderRadius:(width/4-30)/2,borderColor:mainColor,borderWidth:2}}>
                                <XImage uri={item.imgUrl} style={{flex:1, borderRadius:(width/4-30)/2,resizeMode:'cover'}}/>
                            </View>
                            <Text numberOfLines={1} style={{backgroundColor:'#00000000',fontSize: 12, textAlign: 'center', color: 'white', marginTop: 5}}>{item.text}</Text>
                        </TouchableOpacity>
                    }/>
            </View>
        )
    }
}

selector = (state) => {
    return {
        token: state.loginStore.token,
    }
};

export default connect(selector)(GuideStreet);