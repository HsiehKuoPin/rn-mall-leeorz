import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    Text,
    Dimensions
} from 'react-native';

import {mainColor, placeholderTextColor} from "../../../../constraint/Colors";
import XImage from "../../../../widgets/XImage";

const screenW = Dimensions.get('window').width;

class ProductListView extends Component {

    _keyExtractor = (item, index) => index;

    render() {
        var data = this.props.data;
        return (
            <View>
                <FlatList
                    horizontal={true}
                    data={data}
                    showsHorizontalScrollIndicator={false}
                    style={{margin: 10}}
                    keyExtractor={this._keyExtractor}
                    renderItem={({item, index}) =>
                        <View key={index}>
                            <View style={[styles.productImageLayout, {margin: 5,marginLeft:5}]}>
                                <XImage
                                    style={styles.productImage}
                                    uri={item.productSku ? item.productSku.imgUrl : ''}/>
                            </View>
                            <View style={styles.productCount}>
                                <Text style={{
                                    color: 'white',
                                    fontSize: 12,
                                    alignItems: 'center',
                                    backgroundColor: '#00000000',
                                }}>{item.quantity}</Text>
                            </View>
                        </View>
                    }
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    productImageLayout: {
        borderRadius: 3,
        borderWidth: 0.5,
        borderColor: placeholderTextColor,
        marginLeft: 10,
        width: (screenW - 26) / 4.5,
        height: (screenW - 26) / 4.5,
    },
    productImage: {
        borderRadius: 3,
        width: (screenW - 30) / 4.5,
        height: (screenW - 30) / 4.5,
    },
    productCount: {
        borderRadius: 10,
        minWidth: 20,
        minHeight: 20,
        backgroundColor: mainColor,
        paddingLeft: 3,
        paddingRight: 3,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        right: 0,
    },
});

export default (ProductListView);
