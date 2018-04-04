'use strict';
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
    TouchableOpacity,
    Animated,
    Easing,
    Dimensions,
    Platform, FlatList, ScrollView
} from 'react-native';
import {isIphoneX} from "react-native-iphone-x-helper";
import {
    contentTextColor, mainColor, placeholderTextColor, priceColor,
    titleTextColor
} from "../../../constraint/Colors";
import {emptyImgUrl} from "../../../constraint/Image";
import {formatMoney} from "../../../common/StringUtil";
import {showToastShort} from "../../../common/CommonToast";
import StepperView from "../../shoppingcart/StepperView";
import Stepper from "../../../widgets/Stepper";

const titleBarHeight = 45;
const defaultTop = Platform.OS === 'android' ? ((Platform.Version >= 21) ? 20 : 25) : 20;
const topValue = 44;

const {width, height} = Dimensions.get('window');
const navigatorH = 64; // navigator height
const [aWidth, aHeight] = [width, height * 0.7];
const [left, top] = [0, 0];
const [middleLeft, middleTop] = [(width - aWidth) / 2, (height - aHeight) / 2 - navigatorH];

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        width: width,
        height: height,
        left: left,
        top: top,
    },
    mask: {
        justifyContent: "center",
        backgroundColor: "#383838",
        opacity: 0.3,
        position: "absolute",
        width: width,
        height: height,
        left: left,
        top: top,
    },
    tip: {
        // width:aWidth,
        // height:aHeight,
        flex: 1,
        left: middleLeft,
    },
    topView: {
        height: 130,
        width: aWidth,
        flexDirection: 'row',
    },
    topView1: {
        flex: 1,
        marginTop: 25,
        backgroundColor: '#FFFFFF',
        paddingTop: 15,
        paddingLeft: 138,
    },
    img: {
        height: 100,
        width: 100,
        borderRadius: 5,
        resizeMode: 'cover'
    },
    imgView: {
        height: 101,
        width: 101,
        marginLeft: 20,
        position: 'absolute',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'gray',
        shadowOffset: {height: 2, width: 2},
        shadowRadius: 5,
        shadowOpacity: 0.4,
        backgroundColor: 'white',
        elevation: 2
    },
    txt: {
        fontSize: 14,
        color: titleTextColor,
        marginBottom: 5,
    },
    skuItem: {
        backgroundColor: '#f3f3f3',
        borderColor: '#c7c7c7',
        padding: 5,
        // borderRadius: 3,
        borderWidth: 0.5,
        minWidth: 60,
        textAlign: 'center'
    },
    ScrollView: {
        flex: 1,
        borderTopColor: placeholderTextColor,
        borderTopWidth: 0.5,
        // paddingHorizontal:10,
        backgroundColor: 'white'
    },

});

export default class SelectProductDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            offset: new Animated.Value(0),
            opacity: new Animated.Value(0),
            hide: true,
            title: '',
            valueCustom: 1,
            selectSkus: {},
        };
        this.productFeatueList = [];
    }

    componentDidMount() {
        for (let skus of this.props.data.skus) {
            if (skus.id === this.props.data.showSkuId) this.setState({selectSkus: Object.assign({}, skus, {specs: skus.specs})});
        }
        this.jointData();
    }

    jointData() {
        for (let skus of this.props.data.skus) {
            for (let specs of skus.specs) {
                let isSpecTextRepeat = false;
                for (let item of this.productFeatueList) {
                    isSpecTextRepeat = (item.id === specs.specId);
                    if (isSpecTextRepeat) {
                        let isSpecValueRepeat = false;
                        for (let specsItem of item.feature) {
                            isSpecValueRepeat = (specsItem.specValueId === specs.specValueId);
                            if (isSpecValueRepeat) break;
                        }
                        if (!isSpecValueRepeat) {
                            item.feature.push({...specs, 'isSelect': false});
                        }
                    }
                    if (isSpecTextRepeat) break;
                }

                if (!isSpecTextRepeat) {
                    let sku = {'id': specs.specId, 'description': specs.specText, 'feature': []};
                    sku.feature.push({...specs, 'isSelect': false});

                    this.productFeatueList.push(sku)
                }
            }
        }
    }

    _keyExtractor = (item, index) => index;

    render() {
        let data = this.props.data;
        let purchaseQuantity = 0;
        if (data.type !== 'OIL_CARD' || this.props.purchaseQuantity === -1 || this.props.purchaseQuantity > this.state.selectSkus.stock) {
            purchaseQuantity = this.state.selectSkus.stock;
        } else {
            purchaseQuantity = this.props.purchaseQuantity
        }
        let content = this.state.hide ? null : ( <View style={[styles.container,]}>
            <Animated.View style={styles.mask}>
                <Text style={styles.mask} onPress={this.dismiss.bind(this)}/>
            </Animated.View>

            <Animated.View style={[styles.tip, {
                transform: [{
                    translateY: this.state.offset.interpolate({
                        inputRange: [0, 1],
                        outputRange: [height, (height - aHeight - (isIphoneX() ? (topValue + titleBarHeight) : (titleBarHeight + defaultTop)))]
                    }),
                }]
            }]}>
                <View style={styles.topView}>
                    <View style={styles.topView1}>
                        <Text style={styles.txt}>{data.name}</Text>
                        <Text style={{
                            color: priceColor,
                            marginBottom: 5
                        }}>{formatMoney(this.state.selectSkus.salePrice)}</Text>
                    </View>
                    <View style={styles.imgView}>
                        <Image
                            source={{uri: this.state.selectSkus.imgUrl === '' ? emptyImgUrl : this.state.selectSkus.imgUrl}}
                            style={styles.img}/>
                    </View>
                </View>
                <View showsVerticalScrollIndicator={false} style={styles.ScrollView}>
                    <View style={{backgroundColor: '#fff', paddingHorizontal: 10}}>
                        {
                            this.productFeatueList.map((itemData, key) => {
                                return <View key={key} style={{flexDirection: 'row', marginTop: 15}}>
                                    <Text style={{marginTop: 5,}}>{itemData.description}：</Text>
                                    <View style={{flexWrap: 'wrap', flexDirection: 'row', width: width * 0.8}}>
                                        {itemData.feature.map((item, index) => {
                                            this.productFeatueList[key].feature[index].isSelect = false;
                                            this.productFeatueList[key].feature[index].isSelect = (this.state.selectSkus.specs[key].specValueId === item.specValueId);
                                            let color = item.isSelect ? mainColor : placeholderTextColor;
                                            return <TouchableOpacity
                                                style={{marginBottom: 5, marginRight: 5}}
                                                activeOpacity={0.8} key={index} onPress={() => this.selectSpec(item)}>
                                                <Text
                                                    style={[styles.skuItem, {color: color, borderColor: color,}]}>
                                                    {item.showText}
                                                </Text>
                                            </TouchableOpacity>
                                        })}
                                    </View>
                                </View>
                            })
                        }
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingVertical: 15,
                        paddingHorizontal: 10,
                        backgroundColor: '#fff'
                    }}>
                        <Text>购买数量：</Text>

                        <StepperView max={this.props.isBuyCar?1:purchaseQuantity}
                                     count={this.state.valueCustom}
                                     updateCount={({action,count}) => {
                                         this.setState({valueCustom: count})
                                     }}/>
                        <View style={{flex: 1}}/>
                        <Text style={{fontSize: 12, alignSelf: 'flex-end'}}> 库存：{this.state.selectSkus.stock} 件</Text>
                    </View>
                    <View style={{flex: 1, backgroundColor: 'white'}}/>
                </View>
                <TouchableOpacity
                    style={{
                        marginBottom: isIphoneX() ? height * 0.3 + 34 : height * 0.3,
                        width: width,
                        height: 45,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: mainColor
                    }}
                    onPress={() => {
                        if (data.type === 'OIL_CARD' && !this.props.canBuy) showToastShort('未开放购买');
                        else if (purchaseQuantity === 0) showToastShort('库存不足');
                        else this.props.onPress(this.state.valueCustom, this.state.selectSkus.id, this.state.selectSkus.salePrice, purchaseQuantity)
                    }}
                    activeOpacity={1}>
                    <Text style={{color: '#FFFFFF', fontSize: 18}}>{this.state.title}</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>);
        return content;
    }

    selectSpec(spec) {
        let selectedIdArr = [];
        this.productFeatueList.map(productFeatue => {
            productFeatue.feature.map(item => {
                if (spec.specId === item.specId) {
                    item.isSelect = (spec.specValueId === item.specValueId);
                }
                if (item.isSelect) {
                    selectedIdArr.push(item.specValueId);
                }
            })
        });


        for (let skus of this.props.data.skus) {
            let find = false;
            for (let id of selectedIdArr) {
                for (let spec of skus.specs) {
                    find = spec.specValueId === id;
                    if (find) break;
                }
                if (!find) break;
            }

            if (find) {
                // console.log('find',skus.id);
                this.setState({
                    selectSkus: skus,
                    valueCustom: 1
                }, () => {
                    if (this.props.data.type === 'OIL_CARD') this.props.loadPurchaseQuantity(skus.id)
                });
                break;
            }
        }


    }


//显示动画
    in() {
        Animated.parallel([
            Animated.timing(this.state.opacity,
                {
                    // easing: Easing.spring,
                    duration: 450,
                    toValue: 0.8,
                }
            ),
            Animated.timing(this.state.offset,
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
            Animated.timing(this.state.opacity,
                {
                    // easing: Easing.linear,
                    duration: 300,
                    toValue: 0,
                }
            ),
            Animated.timing(this.state.offset,
                {
                    // easing: Easing.linear,
                    duration: 300,
                    toValue: 0,
                }
            )
        ]).start();

        setTimeout(() => this.setState({hide: true}), 300);
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

    show(title) {
        if (this.state.hide) {
            this.setState({hide: false, valueCustom: 1, title: title}, this.in);
        }
    }
}
