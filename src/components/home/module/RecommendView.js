import React, {Component} from 'react';
import {FlatList, Dimensions, View, TouchableOpacity, Text} from 'react-native';
import {ic_recommend} from "../../../constraint/Image";
import {goto} from "../../../reducers/RouterReducer";
import {connect} from "react-redux";
import XImage from "../../../widgets/XImage";
import {contentTextColor, mainColor, priceColor, titleTextColor} from "../../../constraint/Colors";
import {formatMoney} from "../../../common/StringUtil";
import {gotoDetail} from "../../../common/ProductUtil";
import {getMiddle} from "../../../common/PhotoUtil";

const {width, height} = Dimensions.get('window');
class RecommendView extends Component {

    _keyExtractor = (item, index) => index;

    render() {
        var data = this.props.data;
        return (
            <View style={{backgroundColor: '#FFF'}}>
                <XImage
                    style={{
                        display: data.pageNo === 1 ? 'flex' : 'none',
                        height: width*0.046,
                        width: width,
                        marginTop: 20,
                        marginBottom: 15,
                    }}
                    uri={ic_recommend}/>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={data.data}
                    keyExtractor={this._keyExtractor}
                    numColumns={3}
                    renderItem={({item, index}) =>
                        <TouchableOpacity
                            key={index}
                            activeOpacity={0.7}//点击时的透明度
                            style={{margin: 10, alignItems:'center',width: (width - 60) / 3}}
                            onPress={() => {
                                gotoDetail(item,this.props.dispatch);
                            }}>
                            <XImage uri={getMiddle(item.imgUrl)}
                                    style={{marginBottom: 10, width: (width - 60) / 3,height:(width - 60) / 3}}/>
                            <Text numberOfLines={1} style={{fontSize:15,color:titleTextColor}}>{item.NAME}</Text>
                            <Text numberOfLines={1} style={{fontSize:13,color:priceColor,paddingTop:3}}>{formatMoney(item.salePrice)}</Text>
                        </TouchableOpacity>
                    }
                />
            </View>

        )
    }
}
export default connect()(RecommendView);