import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    Text,
    TouchableOpacity
} from 'react-native';

import {connect} from 'react-redux';
import {placeholderTextColor, titleTextColor} from "../../../../constraint/Colors";
import {
    ic_pay_alipay, ic_pay_bankCard, ic_pay_blance, ic_pay_wechat, ic_selected,
    ic_un_selected
} from "../../../../constraint/Image";
import XImage from "../../../../widgets/XImage";


class SelectPaymentMode extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectIndex:null,
        };
    }
    _keyExtractor = (item, index) => item.payType;

    render() {

       var data = [
            {"image": ic_pay_blance, "payType": "余额支付"},
            // {"image": ic_pay_wechat, "payType": "微信支付"},
            // {"image": ic_pay_alipay, "payType": "支付宝支付"},
            {"image": ic_pay_bankCard, "payType": "银行卡支付"},
        ];
        return (
            <View>
                <View style={{justifyContent: 'center'}}>
                    <Text style={{
                        padding: 15,
                        fontSize: 16,
                        color: titleTextColor
                    }}>选择支付方式:
                    </Text>
                    <View style={{
                        marginLeft: 10,
                        marginRight: 10,
                        backgroundColor: placeholderTextColor,
                        height: 0.5
                    }}/>
                </View>
                <FlatList horizontal={false}
                          data={data}
                          showsHorizontalScrollIndicator={false}
                          numColumns={1}
                          extraData={this.state.selectIndex}
                          keyExtractor={this._keyExtractor}
                          renderItem={({item, index}) =>
                              <View>
                                  <TouchableOpacity
                                      activeOpacity={0.7}
                                      onPress={()=>{
                                          if (this.state.selectIndex !== index) {
                                              this.setState({selectIndex: index});

                                          }
                                      }}>
                                      <View
                                          key={index}
                                          style={styles.viewStyle}>

                                          <XImage source={item.image}
                                                 style={styles.imageStyle}/>
                                          <Text style={{
                                              fontSize: 14,
                                              color: titleTextColor
                                          }}>{item.payType}</Text>
                                          <View style={{flex: 1}}/>
                                          <XImage source={this.state.selectIndex === index?ic_selected:ic_un_selected}
                                                 style={{width: 15, height: 15, marginRight: 30}}/>
                                      </View>
                                  </TouchableOpacity>
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
    viewStyle: {
        flexDirection: 'row',
        backgroundColor: 'white',
        alignItems: 'center'
    },
    imageStyle: {
        margin: 20,
        width:26,
        height:26,
    }
});

export default connect()(SelectPaymentMode);
