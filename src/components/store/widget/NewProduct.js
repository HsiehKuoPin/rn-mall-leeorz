import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import {titleTextColor, placeholderTextColor} from "../../../constraint/Colors";
import XImage from "../../../widgets/XImage";
import {connect} from 'react-redux';
import {gotoDetail} from "../../../common/ProductUtil";
import {formatMoney} from "../../../common/StringUtil";

const {width} = Dimensions.get('window');

class NewProduct extends Component {

    render() {
        let data = this.props.data;
        return (
            <View style={styles.container}>
                <Text style={{fontSize: 13, color: titleTextColor, paddingLeft: 15}}>新品推荐</Text>
                <View style={styles.line}/>
                <FlatList
                    style={{paddingLeft: 10,}}
                    data={data}
                    horizontal={true}
                    keyExtractor={(item, index) => index}
                    showsHorizontalScrollIndicator={false}
                    renderItem={this.renderItem}
                />

            </View>
        )
    }

    renderItem = ({item, index}) => {
        return (
            <TouchableOpacity key={index} style={{marginRight: 10}} activeOpacity={0.7}
                              onPress={() => gotoDetail(item, this.props.dispatch)}>
                <XImage uri={item.path} style={styles.productImg}/>
                <Text style={styles.productText} numberOfLines={2}>{item.name}</Text>
                <Text style={[styles.productText,{fontSize:13}]}>{formatMoney(item.salePrice)}</Text>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingVertical: 10,
        shadowColor: 'gray',
        shadowOffset: {height: 2, width: 2},
        shadowRadius: 5,
        shadowOpacity: 0.2,
        elevation: 2,
    },
    line: {
        backgroundColor: placeholderTextColor,
        height: 0.5,
        marginTop: 10,
        marginBottom: 10
    },
    productImg: {
        width: (width - 20 * 4) / 3,
        height: (width - 20 * 4) / 3,
    },
    productText: {
        fontSize: 14,
        color: titleTextColor,
        marginTop: 5,
        width: (width - 20 * 4) / 3
    }
})

export default connect()(NewProduct)