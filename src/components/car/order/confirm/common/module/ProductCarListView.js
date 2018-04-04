import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    Text,
} from 'react-native';
import {
    content2TextColor, mainColor, placeholderTextColor, priceColor,
    titleTextColor
} from "../../../../../../constraint/Colors";
import XImage from "../../../../../../widgets/XImage";
import {formatMoney} from "../../../../../../common/StringUtil";

class ProductCarListView extends Component {

    _keyExtractor = (item, index) => item.productId;

    render() {
        var data = this.props.data;
        return (
            <View>
                <FlatList horizontal={false}
                          data={data.productSkus}
                          showsHorizontalScrollIndicator={false}
                          contentContainerStyle={styles.flatListStyle}
                          numColumns={1}
                          keyExtractor={this._keyExtractor}
                          renderItem={({item, index}) =>
                              <View>
                                  <View
                                      key={index}
                                      style={styles.viewStyle}>
                                      <View style={styles.ImageViewStyle}>
                                          <XImage uri={item.imgUrl}
                                                 style={styles.imageStyle}/>
                                      </View>

                                      <View>
                                          <Text style={{
                                              marginRight: 30,
                                              fontSize: 15,
                                              paddingBottom: 10,
                                              color: titleTextColor
                                          }}
                                                numberOfLines={2}>{item.productName}</Text>
                                          {
                                              item.specPropertys === null ?
                                                  <View/> : item.specPropertys.map((item, index) => {
                                                      return <Text
                                                          key={index}
                                                          style={{
                                                              marginRight: 30,
                                                              marginBottom: 5,
                                                              fontSize: 13,
                                                              color: content2TextColor,
                                                          }}
                                                          numberOfLines={1}>{item}</Text>
                                                  })
                                          }
                                          <Text style={{
                                              marginRight: 30,
                                              paddingBottom: 10,
                                              fontSize: 14,
                                              color: priceColor
                                          }}
                                                numberOfLines={1}>{'价格:' + formatMoney(item.salePrice)}</Text>
                                      </View>
                                  </View>
                                  <View style={{
                                      marginLeft: 10,
                                      marginRight: 10,
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
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
    },
    viewStyle: {
        flexDirection: 'row',
        height: 130,
        backgroundColor: '#00000000',
        alignItems: 'center',
        borderTopLeftRadius: 6
    },
    ImageViewStyle: {
        margin: 10,
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
        width: 100,
        height: 100,
    }
});

export default (ProductCarListView);
