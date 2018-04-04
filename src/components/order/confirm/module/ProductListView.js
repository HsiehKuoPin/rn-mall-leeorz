import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    Text, TextInput,
} from 'react-native';

import {
    content2TextColor, contentTextColor, mainBackgroundColor, mainColor, placeholderTextColor, priceColor,
    titleTextColor
} from "../../../../constraint/Colors";
import Stepper from "../../../../widgets/Stepper";
import {connect} from 'react-redux';
import {saveProduct, saveTotalAmount, saveTotalPrice} from '../../../../reducers/CacheReducer';
import XImage from "../../../../widgets/XImage";
import {formatMoney} from "../../../../common/StringUtil";

var data = null;
var products = null;

class ProductListView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            valueCustom: 1,
        };

        this.selectProducts = [];
    }

    componentWillMount() {
        data = this.props.data;
        products = this.props.products;

        if (data.productSkus) {
            this.props.dispatch(saveProduct(products.productIds));
            data.productSkus.map(item => {
                for (productItem of products.productIds) {
                    if (item.id === productItem.productSkuId) {
                        productItem = Object.assign({}, productItem, {unitPrice: item.salePrice}, {comment: ''});
                        this.selectProducts.push(productItem)
                        break;
                    }
                }
            });
        }
    }

    render() {
        return (
            <View>
                <FlatList horizontal={false}
                          data={data.productSkus}
                          showsHorizontalScrollIndicator={false}
                          contentContainerStyle={styles.flatListStyle}
                          numColumns={1}
                          extraData={this.state.valueCustom}
                          keyExtractor={(item, index) => index}
                          renderItem={({item, index}) =>
                              <View>
                                  <View
                                      key={index}
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
                                              fontSize: 13,
                                              color: priceColor,
                                              marginRight: 10,
                                              paddingBottom: 5,
                                          }}
                                                numberOfLines={1}>{'价格：' + formatMoney(item.salePrice)}</Text>
                                          <View style={{alignItems: 'flex-end'}}>
                                              <Stepper
                                                  defaultValue={parseInt(products.productIds[index].quantity)}
                                                  min={1}
                                                  max={products.purchaseQuantity !== undefined ? products.purchaseQuantity : item.stock}
                                                  onChange={v => {
                                                      this.setState({valueCustom: v})
                                                      this.selectProducts[index].quantity = v;

                                                      let arr = [];
                                                      let amount = 0;
                                                      let total = 0;
                                                      this.selectProducts.map(items => {
                                                          arr.push({
                                                              'productSkuId': items.productSkuId,
                                                              'quantity': items.quantity.toString(),
                                                              'comment': items.comment
                                                          })
                                                          amount += parseInt(items.quantity);
                                                          total += parseInt(items.quantity) * parseFloat(items.unitPrice);
                                                      });
                                                      this.props.dispatch(saveTotalPrice(total));
                                                      this.props.dispatch(saveProduct(arr));
                                                      this.props.dispatch(saveTotalAmount(amount));
                                                    }
                                                  }
                                              />
                                          </View>
                                      </View>
                                  </View>

                                  <View style={{marginTop:5,flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                      <Text style={{
                                          fontSize: 13,
                                          marginLeft: 10,
                                          color: contentTextColor
                                      }}>{'买家留言:'}</Text>
                                      <View style={{
                                          marginLeft: 5,
                                          marginRight: 10,
                                          padding: 3,
                                          borderWidth: 0.5,
                                          borderColor: placeholderTextColor,
                                          borderRadius: 3,
                                          backgroundColor: mainBackgroundColor,
                                          flex: 1,
                                      }}>
                                          <TextInput
                                              underlineColorAndroid='transparent'
                                              style={{
                                                  padding: 0,
                                                  fontSize: 13,
                                                  height: 20,
                                                  textAlignVertical: 'top'
                                              }}
                                              multiline={false}
                                              autoCapitalize="none"
                                              maxLength={50}
                                              placeholder="留下您需要针对于该商品的订单需求..."
                                              placeholderTextColor={placeholderTextColor}
                                              onChangeText={(user_message) => {

                                                  this.setState({user_message});
                                                  this.selectProducts.map((items, indexs) => {
                                                      if (indexs === index)
                                                          items.comment = user_message
                                                  });
                                                  this.props.product.map((productItem, productIndex) => {
                                                      if (productIndex === index)
                                                          productItem.comment = user_message
                                                  });

                                              }}
                                          />

                                      </View>
                                  </View>

                                  <View style={{
                                      marginTop: 15,
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
    },
    viewStyle: {
        flexDirection: 'row',
        backgroundColor: 'white',
        marginBottom: 5,
    },
    ImageViewStyle: {
        margin: 15,
        borderWidth: 0.5,
        width: 91,
        height: 91,
        borderColor: placeholderTextColor,
        borderRadius: 5,
        backgroundColor: 'white',
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

selector = (state) => {
    return {
        product: state.cacheStore.defaultProduct,
    }
};

export default connect(selector)(ProductListView);
