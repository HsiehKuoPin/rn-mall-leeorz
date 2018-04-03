import React, {Component} from 'react';
import {Image, View, StyleSheet, Dimensions, TouchableOpacity, FlatList, Text} from "react-native";

import {connect} from 'react-redux';
import {goto} from '../../../reducers/RouterReducer';
import {mainBackgroundColor, mainColor, titleTextColor} from "../../../constraint/Colors";
import XImage from "../../../widgets/XImage";
import {formatMoney} from "../../../common/StringUtil";

let deviceWidth = Dimensions.get('window').width;
let height = (deviceWidth - 20) * 0.6;

/**
 * 您的推荐
 */
class ProductListView extends Component {

    constructor(props) {
        super(props);
    }

    _keyExtractor = (item, index) => item.id;

    render() {
        let data = this.props.data;
        return (
            <View style={{backgroundColor: mainBackgroundColor}}>
                <FlatList
                    showsHorizontalScrollIndicator={false}
                    data={data.data}
                    numColumns={1}
                    keyExtractor={this._keyExtractor}
                    renderItem={({item, index}) =>
                        <TouchableOpacity
                            key={index}
                            style={styles.container}
                            activeOpacity={0.7}//点击时的透明度
                            onPress={() => this.props.dispatch(goto('ProductCarDetail', item.id))}>
                            <XImage uri={item.imgUrl}
                                    style={{
                                        width: deviceWidth - 20,
                                        height: height,
                                        backgroundColor: '#F1F2F3',
                                        borderRadius: 3,
                                        resizeMode:'contain',
                                    }}/>
                            <Text style={styles.itemText}
                                  numberOfLines={2}>{item.NAME}</Text>
                            <View style={{flex: 1}}/>
                            <Text style={styles.priceText}
                                  numberOfLines={1}>{formatMoney(item.salePrice)}</Text>
                        </TouchableOpacity>
                    }
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        paddingTop:10,
        width: deviceWidth,
        alignItems: 'center',
        backgroundColor: 'white',
    },
    itemText: {
        color: titleTextColor,
        width: deviceWidth - 20,
        textAlign: 'left',
        marginTop: 10,
        paddingHorizontal:5,
        fontSize: 18,
        // fontWeight: 'bold',
    },
    priceText: {
        color: mainColor,
        marginTop: 5,
        paddingHorizontal:5,
        marginBottom: 8,
        width: deviceWidth - 20,
        textAlign: 'left',
        fontSize: 16,
        // fontWeight: 'bold',
    },

});

export default connect()(ProductListView);
