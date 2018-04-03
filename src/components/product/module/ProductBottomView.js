import React, {Component} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native'
import {contentTextColor, mainColor} from "../../../constraint/Colors";
import {ic_tabhost_shoppingcart, product_collected, product_not_collect,ic_enter_TheShop} from "../../../constraint/Image";
import {connect} from "react-redux";
import {isIphoneX} from "react-native-iphone-x-helper";
import {isIPhone5} from "../../../common/AppUtil";

class ProductBottomView extends Component {
    render() {
        return (
            <View style={styles.container}>
                {this.props.isOilCard?null:(
                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={[styles.touch, {flex: 1,paddingLeft:20,paddingRight:20}]}
                        onPress={this.props.onCollectPress}>
                        <Image style={[styles.img,{marginLeft:10,marginRight:5}]} source={this.props.isCollected ? product_collected : product_not_collect}/>
                        <Text style={[styles.txt]}>收藏</Text>
                    </TouchableOpacity>
                )}
                {this.props.isOilCard?null:(
                    <TouchableOpacity
                          style={[styles.touch]}
                        activeOpacity={0.7}
                        onPress={this.props.onCartPress}>
                        <View style={{minWidth: 30,height:45,justifyContent: 'center', alignItems: 'center',}}>
                            <Image style={styles.img} source={ic_tabhost_shoppingcart}/>
                            <View style={[styles.countView,{display: this.props.shoppingCartCount > 0 ? 'flex' : 'none'}]}>
                                <Text style={styles.count}>{this.props.shoppingCartCount}</Text>
                            </View>
                        </View>
                        <Text style={styles.txt}>加入购物车</Text>
                    </TouchableOpacity>
                )}

                {/*{this.props.isOilCard?null:(*/}
                    {/*<TouchableOpacity*/}
                        {/*style={styles.touch}*/}
                        {/*activeOpacity={0.7}*/}
                        {/*onPress={*/}
                            {/*this.props.onEnterTheShop*/}
                        {/*}>*/}
                        {/*<View style={{minWidth: 30,height:45,justifyContent: 'center', alignItems: 'center',}}>*/}
                            {/*<Image style={styles.img} source={ic_enter_TheShop}/>*/}
                        {/*</View>*/}
                        {/*<Text style={[styles.txt,{marginLeft:isIPhone5()?-2:0}]}>进入店铺</Text>*/}
                    {/*</TouchableOpacity>*/}
                {/*)}*/}

                <TouchableOpacity
                    style={[styles.touch, {backgroundColor: mainColor}]}
                    activeOpacity={0.6}
                    onPress={this.props.onBuyPress}>
                    <Text style={{fontSize: isIPhone5()?14:16, color: '#ffffff'}}>立即购买</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: 'white',
    },
    img: {
        height: isIPhone5()?20:30,
        width: isIPhone5()?15:20,
        resizeMode: 'contain',
    },
    countView: {
        minHeight: 16,
        minWidth: 16,
        right: -5,
        top: 5,
        backgroundColor: mainColor,
        borderRadius: 8,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    count: {
        fontSize: 9,
        color: '#ffffff',
        paddingHorizontal: 3,
        backgroundColor:"#00000000"
    },
    touch: {
        flex: 3,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection:'row',
        height: 45,
    },
    txt: {
        fontSize: isIPhone5()?12:14,
        marginLeft:2,
        color: '#2c2c2c',
        backgroundColor:'#00000000'
    },
});

selector = (state) =>{
    return {
        shoppingCartCount:state.shoppingCartStore.shoppingCartProductTotalCount,
    }
};
export default connect(selector)(ProductBottomView);
