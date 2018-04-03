import React, {Component} from 'react';
import {View, TouchableOpacity, StyleSheet,TouchableHighlight, Dimensions, Modal, Text, Image, FlatList} from 'react-native';
import {
    mainBackgroundColor, placeholderTextColor,
    titleTextColor
} from "../constraint/Colors";
import {ic_cancelPay_cross, ic_payDelete_cross} from "../constraint/Image";
import XImage from "./XImage";
import {encryption} from "../common/StringUtil";

const {width} = Dimensions.get('window');

var passwordData = [];

export default class PayPasswordView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
            passwordData: [],
        };
    }

    dismiss() {
        this.setState({
            isVisible: false
        });
    }

    show() {
        this.setState({
            isVisible: true
        });
    }

    _keyExtractor = (item, index) => index;

    render() {

        var data = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "清空", "0", " "]
        return (
            <View style={{flex: 1}}>
                <Modal
                    transparent={true}
                    visible={this.state.isVisible}
                    animationType={'fade'}
                    onRequestClose={() => {
                    }}>
                    <TouchableOpacity style={styles.container} activeOpacity={1} onPress={() => this.dismiss()}>
                    </TouchableOpacity>
                    <View style={{backgroundColor: 'white'}}>
                        <View style={{flexDirection: 'row', padding: 20}}>
                            <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center'}}
                                              onPress={() => this.dismiss()}>
                                <XImage source={ic_cancelPay_cross}
                                        style={{width: 15, height: 15}}/>
                            </TouchableOpacity>
                            <Text
                                style={{flex: 1, fontSize: 18, color: titleTextColor, textAlign: 'center'}}>支付密码</Text>
                        </View>
                        <View style={{
                            marginLeft: 20,
                            marginRight: 20,
                            backgroundColor: placeholderTextColor,
                            height: 0.5
                        }}/>
                        <View style={{margin: 25, justifyContent: 'center', alignItems: 'center'}}>
                            <View style={styles.itemView}>
                                {[1, 2, 3, 4, 5, 6].map((item, index) => {
                                    let value = this.state.passwordData.length > index ? titleTextColor : '#00000000';

                                    return <View
                                        key={index}
                                        style={[styles.txtView, {
                                            marginRight: (index === 5 ? 0 : 0.5),
                                            borderTopLeftRadius: (index === 0) ? 5 : 0,
                                            borderBottomLeftRadius: (index === 0) ? 5 : 0,
                                            borderTopRightRadius: (index === 5) ? 5 : 0,
                                            borderBottomRightRadius: (index === 5) ? 5 : 0,
                                        }]}>
                                        <View style={{
                                            width: 12,
                                            height: 12,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: 6,
                                            backgroundColor: value
                                        }}/>
                                    </View>
                                })}
                            </View>
                        </View>

                        <FlatList data={data}
                                  scrollEnabled={false}
                                  showsHorizontalScrollIndicator={false}
                                  numColumns={3}
                                  extraData={this.state.valueCustom}
                                  keyExtractor={this._keyExtractor}
                                  renderItem={({item, index}) => index !== 11 ? (<View>
                                          <View style={{
                                              backgroundColor: placeholderTextColor,
                                              height: 0.5,
                                              width: width / 3
                                          }}/>
                                          <TouchableHighlight
                                              underlayColor={mainBackgroundColor}
                                              style={{
                                                  justifyContent: 'center',
                                                  alignItems: 'center',
                                                  width: width / 3,
                                                  height: 50,
                                                  borderRightWidth: 0.5,
                                                  borderColor: placeholderTextColor,
                                                  backgroundColor: (index === 9 || index === 11) ? mainBackgroundColor : 'white'
                                              }}
                                              onPress={() => {
                                                  if (index !== 9) {
                                                      passwordData.push(item);
                                                      this.setState({
                                                          passwordData: passwordData
                                                      }, () => {
                                                          if (passwordData.length === 6) {
                                                              let password = '';
                                                              for (let item of this.state.passwordData) {
                                                                  password += item;
                                                              }
                                                              this.dismiss();
                                                              setTimeout(() => this.props.pay(encryption(password)), 300);
                                                              passwordData = [];
                                                              this.setState({
                                                                  passwordData: passwordData,
                                                              })
                                                          }
                                                      });

                                                  }
                                                  else {
                                                      passwordData = [],
                                                          this.setState({
                                                              passwordData: passwordData,
                                                          })
                                                  }
                                              }}
                                              // activeOpacity={0.5}
                                              key={index}>
                                              <Text style={{
                                                  fontSize: index === 9 ? 15 : 25,
                                                  color: titleTextColor,
                                              }}>{item}</Text>
                                          </TouchableHighlight>
                                      </View>)
                                      :
                                      (<View>
                                          <View style={{
                                              backgroundColor: placeholderTextColor,
                                              height: 0.5,
                                              width: width / 3
                                          }}/>
                                          <TouchableOpacity
                                              style={{
                                                  justifyContent: 'center',
                                                  alignItems: 'center',
                                                  width: width / 3,
                                                  height: 50,
                                                  borderColor: placeholderTextColor,
                                                  backgroundColor: (index === 9 || index === 11) ? mainBackgroundColor : 'white'
                                              }}
                                              key={index}
                                              activeOpacity={0.7}
                                              onPress={() => {
                                                  passwordData.pop(item)
                                                  this.setState({
                                                      passwordData: passwordData,
                                                  })
                                              }}>
                                              <XImage source={ic_payDelete_cross}
                                                      resizeMode={Image.resizeMode.contain}
                                                      style={{
                                                          width: 20,
                                                          height: 20,
                                                      }}/>
                                          </TouchableOpacity>
                                      </View>)
                                  }
                        />
                    </View>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    item: {
        margin: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: placeholderTextColor,
    },
    itemView: {
        borderRadius: 5,
        flexDirection: 'row',
        height: 50,
        backgroundColor: 'white',
        borderColor: placeholderTextColor,
        borderWidth: 0.5
    },
    txtView: {
        marginTop: 0.5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: mainBackgroundColor,
        height: 48,
        width: 48,
    },
});