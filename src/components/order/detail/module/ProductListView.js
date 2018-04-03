import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    Text,
} from 'react-native';

import {content2TextColor, mainColor, placeholderTextColor, titleTextColor} from "../../../../constraint/Colors";
import XImage from "../../../../widgets/XImage";
import {formatMoney} from "../../../../common/StringUtil";

class ProductListView extends Component {

    _keyExtractor = (item, index) => index;

    render() {
        var data = this.props.data;
        var contentArr;
        for (let item of data.orderItems) {
            contentArr = item.productSkuSpecProperty.split(',');
        }
        return (
            <View>
                <FlatList horizontal={false}
                          data={data.orderItems}
                          showsHorizontalScrollIndicator={false}
                          contentContainerStyle={styles.flatListStyle}
                          numColumns={1}
                          keyExtractor={this._keyExtractor}
                          renderItem={({item, index}) =>
                              <View key={index}>
                                  <View
                                      style={styles.viewStyle}>
                                      <View style={styles.ImageViewStyle}>
                                          <XImage uri={item.imgUrl}
                                                 style={styles.imageStyle}/>
                                      </View>

                                      <View style={{flex: 1, marginTop: 15, marginRight: 10}}>
                                          <Text style={{
                                              fontSize: 15,
                                              paddingBottom: 5,
                                              color: titleTextColor,
                                              lineHeight: 20,
                                          }}
                                                numberOfLines={2}>{item.productName}</Text>
                                          {
                                              contentArr.map((item, index) => <Text
                                                  style={{
                                                      marginRight: 30,
                                                      marginBottom: 5,
                                                      fontSize: 13,
                                                      color: content2TextColor,
                                                  }}
                                                  key={index}
                                                  numberOfLines={1}>{item}</Text>)
                                          }
                                          <View style={{
                                              flexDirection: 'row',
                                              marginRight: 10,
                                              paddingBottom: 5,
                                              alignItems: 'center'
                                          }}>
                                              <Text style={{
                                                  fontSize: 13,
                                                  color: mainColor,
                                              }}
                                                    numberOfLines={1}>{'价格：' + formatMoney(item.amount)}</Text>
                                              <View style={{flex: 1}}/>
                                              <Text style={{
                                                  paddingRight: 0,
                                                  fontSize: 16,
                                                  color: titleTextColor,
                                              }}
                                                    numberOfLines={1}>{'x' + item.quantity}</Text>
                                          </View>
                                      </View>
                                  </View>
                                  <Text style={{
                                      marginLeft: 15,
                                      marginRight: 15,
                                      marginBottom:15,
                                      color:content2TextColor,
                                      fontSize:13,
                                  }}>买家留言：{item.comment}</Text>
                                  <View style={{
                                      marginLeft: 15,
                                      marginRight: 15,
                                      backgroundColor: placeholderTextColor,
                                      height: 0.5
                                  }}/>
                              </View>

                          }
                />
                <View style={{flex: 1}}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    flatListStyle: {
        backgroundColor: 'white',
    },
    viewStyle: {
        flexDirection: 'row',
        backgroundColor: 'white',
    },
    ImageViewStyle: {
        margin: 15,
        borderWidth: 0.5,
        borderColor: placeholderTextColor,
        borderRadius: 6,
        backgroundColor:'white',
        shadowColor: placeholderTextColor,
        shadowOffset: {height: 4, width: 4},
        shadowRadius: 3,
        shadowOpacity: 0.2,
        elevation: 2
    },
    imageStyle: {
        borderRadius: 5,
        width: 90,
        height: 90,
    },
});

export default (ProductListView);
