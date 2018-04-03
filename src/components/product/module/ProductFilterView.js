'use strict';
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Animated,
    Easing,
    Dimensions,
    Platform,
    TextInput,
    ScrollView,
    DeviceEventEmitter,
    FlatList
} from 'react-native';
import {
    placeholderTextColor,
    content2TextColor,
    mainColor,
    mainBackgroundColor,
    contentTextColor, titleTextColor
} from "../../../constraint/Colors";
import {isIphoneX} from "react-native-iphone-x-helper";

import {showToastShort} from "../../../common/CommonToast";
import {isSuccess, post} from "../../../common/CommonRequest";

const {width, height} = Dimensions.get('window');
const statusBarHeight = 20;
const navigationBarHeight = 44;
const androidNavigationBar = 65;

export default class good extends Component {
    constructor(props) {
        super(props);
        this.state = {
            offset: new Animated.Value(0),
            opacity: new Animated.Value(0),
            hide: true,
            beginPrice: null,
            endPrice: null,
            newData: [],
        };

        this.id = this.props.id;
        this.action = this.props.action;
    }

    componentDidMount() {
        this._getData();
    }

    _getData() {

        let specApiUrl = 'product/specList';
        let brandApiUrl = 'product/brandList';

        let specRequest = post(specApiUrl, this.id);
        let brandRequest = post(brandApiUrl, this.id);
        Promise.all([brandRequest, specRequest])
            .then(([brandResultData, specResultData]) => {
                let data = [];
                if (isSuccess(brandResultData) && isSuccess(specResultData)) {

                    let brandItem;
                    let parentId;

                    if (brandResultData.result.length !== 0) {
                        brandItem = {tip: '品牌', list: [], isBrand: true};
                        brandResultData.result.map(item => {
                            parentId = item.descPropertyId;
                            brandItem.list.push({
                                id: item.id,
                                parentId: item.descPropertyId,
                                valueText: item.valueText,
                                isSelect: brandResultData.result.length === 1,//只有一个的时候默认选中
                                isBrand: true,
                            })
                        });
                        data.push({...brandItem, id: parentId});
                    }
                    specResultData.result.map(item => {
                        let specArr = [];
                        item.values.map(specItem => {
                            specArr.push({
                                parentId: item.specId,
                                id: specItem.specValueId,
                                valueText: specItem.specValueText,
                                isCustom: specItem.isCustom,
                                isSelect: false,
                                isBrand: false,
                            });
                        });
                        data.push({tip: item.specText, id: item.specId, list: specArr, isBrand: false});
                    });
                }
                this.setState({
                    newData: data,
                });
            });
    }

    _errorMsg(msg) {
        showToastShort(msg);
    }

    renderReset() {
        this.setState({
            beginPrice: null,
            endPrice: null,
        });

        let newList = [];
        this.state.newData.map(parentItem => {
            let newChildList = [];

            if (parentItem.isBrand === true) {
                parentItem.list.map(childItem => {
                    newChildList.push({...childItem, isSelect: parentItem.length === 1})
                })
            } else {
                parentItem.list.map(childItem => {
                    newChildList.push({...childItem, isSelect: false})
                })
            }
            newList.push({...parentItem, list: newChildList});
        });
        this.setState({
            newData: newList,
        })
    }

    renderScreeningGoods() {
        let isSelectBrandArray = [];
        let isSelectSpecArray = [];
        this.state.newData.map(parentItem => {
            parentItem.list.map(childItem => {
                if (childItem.isBrand === true) {
                    if (childItem.isSelect === true) isSelectBrandArray.push(childItem.id);
                } else {
                    if (childItem.isSelect === true) {
                        isSelectSpecArray.push({
                            specId: childItem.parentId,
                            specValueId: childItem.id,
                            specValueText: childItem.valueText,
                            isCustom: childItem.isCustom
                        });
                    }
                }
            });
        });
        DeviceEventEmitter.emit('Good', this.state.beginPrice, this.state.endPrice,
            isSelectBrandArray, isSelectSpecArray)
        this.dismiss()
    }

    /**
     * 选择某个选项
     * @param item
     * @private
     */
    _chooseItem(item) {

        let newList = [];
        this.state.newData.map(parentItem => {
            let newChildList = [];
            if (item.isBrand === parentItem.isBrand) {
                parentItem.list.map(childItem => {
                    let isSelect = (childItem.id === item.id && item.valueText === childItem.valueText) ? !item.isSelect : childItem.isSelect;
                    if (parentItem.length === 1) {
                        isSelect = true;
                    }
                    newChildList.push({...childItem, isSelect: isSelect});
                });
            } else {
                newChildList = parentItem.list;
            }
            newList.push({...parentItem, list: newChildList});
        });
        this.setState({newData: newList,})
    }

    /**
     * 获取下面的规格布局
     * @returns {XML}
     * @private
     */
    _getItemView(item, index) {
        return <View key={index}>
            <View style={{marginVertical: 10}}>
                <View style={styles.line}/>
                <Text style={styles.priceTextStyle}>{item.tip}</Text>
                <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                    {

                        item.list.map((item, index) => {
                            return (
                                <TouchableOpacity activeOpacity={0.7}
                                                  key={index}
                                                  style={{marginLeft: 10,}}
                                                  onPress={() => {
                                                      this._chooseItem(item);
                                                  }}>
                                    <View style={{
                                        backgroundColor: mainBackgroundColor,
                                        borderColor: item.isSelect ? mainColor : placeholderTextColor,
                                        borderRadius: 3,
                                        borderWidth: 0.5,
                                        marginTop: 10,
                                    }}>
                                        <Text style={[styles.txtColor, {
                                            color: item.isSelect ? mainColor : placeholderTextColor,
                                        }]}>
                                            {item.valueText}
                                        </Text>
                                    </View>
                                </TouchableOpacity>)
                        })
                    }
                </View>
            </View>
        </View>
    }


    _getInputPriceRangeView() {
        return <View>
            <Text style={styles.priceTextStyle}>{'价格区间'}</Text>
            <View style={styles.inputPriceLayout}>
                <View style={styles.textInputLayout}>
                    <TextInput
                        underlineColorAndroid='transparent'
                        style={styles.inputText}
                        autoCapitalize="none"
                        maxLength={12}
                        placeholder="最小值"
                        defaultValue={this.state.beginPrice}
                        keyboardType='numeric'
                        onChangeText={(text) => {
                            this.setState({beginPrice: text})
                        }}
                    />
                </View>
                <View style={styles.verticalLine}/>
                <View style={styles.textInputLayout}>
                    <TextInput
                        underlineColorAndroid='transparent'
                        style={styles.inputText}
                        autoCapitalize="none"
                        maxLength={12}
                        placeholder="最大值"
                        defaultValue={this.state.endPrice}
                        keyboardType='numeric'
                        onChangeText={(text) => {
                            this.setState({endPrice: text})
                        }}
                    />
                </View>
            </View>
        </View>
    }

    render() {
        let {setHeight} = this.props;
        return this.state.hide ? null : (
            <View style={styles.container}>
                <Animated.View style={styles.mask}>
                    <Text style={styles.mask} onPress={this.dismiss.bind(this)}/>
                </Animated.View>
                <Animated.View style={{
                    transform: [{
                        translateX: this.state.offset.interpolate({
                            inputRange: [0, 1],
                            outputRange: [height, width * 0.2]
                        })
                    }]
                }}>
                    <View style={{backgroundColor: 'white',}}>

                        <View
                            style={[styles.scrollViewStyle,
                                {height: setHeight ? height - (isIphoneX() ? 80 :
                                 Platform.OS === 'android'? androidNavigationBar: navigationBarHeight) :
                                    height - (isIphoneX() ? 180 : navigationBarHeight+statusBarHeight+50)}]}>
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={this.state.newData}
                                keyExtractor={(item, index) => index}
                                renderItem={({item, index}) =>
                                    <View key={index}>
                                        {index === 0 ? this._getInputPriceRangeView() : null}
                                        {this._getItemView(item, index)}
                                    </View>
                                }
                            />
                        </View>

                        <View style={{flexDirection: 'row', marginBottom: (isIphoneX() ? 50 : 0),}}>
                            <TouchableOpacity activeOpacity={0.70}
                                              style={{width: width * 0.4, height: 50, backgroundColor: '#F0F0F0'}}
                                              onPress={() => {
                                                  this.renderReset()
                                              }}>
                                <Text style={styles.resetStyle}>{'重置'}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity activeOpacity={0.70}
                                              style={{width: width * 0.4, height: 50, backgroundColor: mainColor}}
                                              onPress={() => {
                                                  this.renderScreeningGoods()
                                              }}>
                                <Text style={styles.determineStyle}>{'确定'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
            </View>
        );

    }

    //显示动画
    in() {
        Animated.parallel([
            Animated.timing(
                this.state.opacity,
                {
                    // easing: Easing.spring,
                    duration: 450,
                    toValue: 0.8,
                }
            ),
            Animated.timing(
                this.state.offset,
                {
                    // easing: Easing.spring,
                    duration: 450,
                    toValue: 1,
                }
            )
        ]).start();
    }

    //隐藏动画
    out() {
        Animated.parallel([
            Animated.timing(
                this.state.opacity,
                {
                    // easing: Easing.linear,
                    duration: 300,
                    toValue: 0,
                }
            ),
            Animated.timing(
                this.state.offset,
                {
                    // easing: Easing.linear,
                    duration: 300,
                    toValue: 0,
                }
            )
        ]).start();

        setTimeout(
            () => this.setState({hide: true}),
            300
        );
    }

    //取消
    dismiss(event) {
        if (!this.state.hide) {
            this.out();
        }
    }

    //选择
    choose(msg) {
        if (!this.state.hide) {
            this.out();
        }
    }

    show() {
        if (this.state.hide) {
            this.setState({hide: false}, this.in);
        }
    }
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        height: height,
    },
    mask: {
        justifyContent: "center",
        backgroundColor: "#383838",
        opacity: 0.3,
        position: "absolute",
        width: width,
        height: height,
    },
    txtColor: {
        margin: 1,
        borderRadius: 5,
        textAlign: 'center',
        fontSize: 14,
        paddingVertical: 7,
        paddingHorizontal: 10,
    },

    priceTextStyle: {
        fontSize: 14,
        marginLeft: 10,
        marginTop: 10,
        color: titleTextColor
    },
    resetStyle: {
        color: mainColor,
        fontSize: 20,
        textAlign: 'center',
        paddingVertical: 15
    },
    determineStyle: {
        color: 'white',
        fontSize: 20,
        textAlign: 'center',
        paddingVertical: 15
    },
    textInputLayout: {
        borderWidth: 0.5,
        borderColor: placeholderTextColor,
        borderRadius: 3,
        height: 35,
        padding: 4,
        flex: 1,
        backgroundColor: mainBackgroundColor
    },
    line: {
        backgroundColor: placeholderTextColor,
        height: 0.5,
        marginHorizontal: 10
    },
    verticalLine: {
        marginHorizontal: 5,
        height: 1,
        width: 20,
        backgroundColor: titleTextColor,
    },
    inputPriceLayout: {
        alignItems: 'center',
        marginHorizontal: 10,
        marginTop: 10,
        flexDirection: 'row',
        backgroundColor: 'white'
    },
    inputText: {
        padding: 0,
        flex: 1,
        fontSize: 14,
    },
    scrollViewStyle: {
        width: width * 0.8,

    },
});