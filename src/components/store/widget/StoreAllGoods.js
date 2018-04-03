import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import {titleTextColor, mainBackgroundColor, placeholderTextColor} from "../../../constraint/Colors";
import XImage from "../../../widgets/XImage";
import {connect} from 'react-redux';
import {gotoDetail} from "../../../common/ProductUtil";
import {formatMoney} from "../../../common/StringUtil";

const {width} = Dimensions.get('window');

class StoreAllGoods extends Component {

    render() {
        let data = this.props.data;
        let showText = (data.pageNo === 1 && data.data.length > 0) ? (
            <View style={{alignItems: 'center', marginTop: 15, marginBottom: 5}}>
                <Text style={{fontSize: 15, color: titleTextColor}}>ALL GOODS</Text>
                <Text style={{fontSize: 12, color: titleTextColor}}>全部商品</Text>
                <View style={styles.line}/>
            </View>) : null;
        return (
            <View style={styles.container}>
                {showText}
                <FlatList
                    data={data.data}
                    numColumns={2}
                    keyExtractor={(item, index) => index}
                    renderItem={this.renderItem}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        )
    }

    renderItem = ({item, index}) => {
        return (
            <TouchableOpacity key={index} activeOpacity={0.7}
                              style={styles.buttonItem}
                              onPress={() => gotoDetail(item, this.props.dispatch)}>
                <XImage uri={item.path} style={styles.productImg}/>
                <Text style={styles.productText} numberOfLines={2}>{item.name}</Text>
                <Text style={[styles.productText, {
                    alignSelf: 'flex-end',
                    marginHorizontal: 10,
                    fontSize: 16,
                    paddingBottom: 5
                }]}>{formatMoney(item.salePrice)}</Text>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: mainBackgroundColor,
        marginTop: 2
    },
    line: {
        backgroundColor: placeholderTextColor,
        height: 0.5,
        marginTop: 5,
        width: width - 40,
        marginBottom: 10,
    },
    buttonItem: {
        width: (width - 30 ) / 2,
        backgroundColor: 'white',
        marginLeft: 10,
        marginBottom: 10,
    },
    productImg: {
        width: (width - 30 ) / 2,
        height: (width - 30 ) / 2
    },
    productText: {
        fontSize: 13,
        color: titleTextColor,
        marginTop: 5,
        marginHorizontal: 5
    }
});

export default connect()(StoreAllGoods)