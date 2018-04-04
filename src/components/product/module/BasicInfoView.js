import React, {Component} from 'react';
import {View, Text, StyleSheet, FlatList} from "react-native";
import {
    mainColor, placeholderTextColor, contentTextColor, titleTextColor,
    priceColor
} from "../../../constraint/Colors";
import {formatMoney} from "../../../common/StringUtil";
import {PAYMENTS_CONFIG} from "../../../constraint/AssetsType";

/**
 * 商品基本信息
 */
export default class BasicInfoView extends Component {

    _keyExtractor = (item, index) => index;

    _getUseIntegralText(payWays){
        if(payWays.length > 0){
            let payType = (payWays.length===1?'使用':'') + PAYMENTS_CONFIG[payWays[0].accountType].name + '：';
            return <Text style={styles.txtParent}>{payType} {formatMoney(payWays[0].maxPay,false)}</Text>
        }
    }

    render() {
        let data = this.props.data;

        return (
            <View style={styles.container}>
                <Text style={styles.txt}>{data.name}</Text>
                {data.brand?<Text style={[styles.txt, {fontSize: 15, color: titleTextColor, marginTop: 5}]}>品牌：{data.brand}</Text>:null}
                <Text style={styles.txtPrice}>{"价格：" + formatMoney(data.salePrice)}</Text>
                <View style={{marginBottom: 10, flexDirection: 'row',alignItems:'flex-end'}}>
                    <View style={{flex: 1}}>
                        {this._getUseIntegralText(data.payWays)}
                    </View>
                    <Text style={{marginBottom: 5,color: contentTextColor}}>已售：{data.sales===null?0:data.sales} 件</Text>
                </View>
                {/*<View style={{backgroundColor: placeholderTextColor, height: 0.5,marginBottom:10}}/>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={data.descs}
                    keyExtractor={this._keyExtractor}
                    numColumns={2}
                    renderItem={({item, index}) =>
                        <Text key={index} style={styles.txtChild}>{item.descText}: {item.descValueText}</Text>
                    }
                />*/}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        padding: 20,
    },
    txt: {
        fontSize: 18,
        color: titleTextColor,
    },
    txtPrice: {
        fontSize: 16,
        marginTop: 10,
        color: priceColor,
        marginBottom:5,
    },
    txtParent: {
        marginBottom: 5,
        color: contentTextColor,
    },
    txtChild: {
        flex:1,
        marginBottom: 5,
        color: contentTextColor,
    },
});