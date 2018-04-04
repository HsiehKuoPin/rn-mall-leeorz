'use strict';
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
    TouchableOpacity,
    Animated,
    Easing,
    Dimensions,
    Platform, FlatList,ScrollView
} from 'react-native';
import {isIphoneX} from "react-native-iphone-x-helper";
import {
    contentTextColor, mainColor, placeholderTextColor, priceColor,
    titleTextColor
} from "../../../constraint/Colors";
import Stepper from "../../../widgets/Stepper";
import {showToastShort} from "../../../common/CommonToast";
import {emptyImgUrl} from "../../../constraint/Image";

const titleBarHeight = 45;
const defaultTop = Platform.OS === 'android' ? ((Platform.Version >= 21) ? 20 : 25) : 20;
const topValue = 44;

const {width, height} = Dimensions.get('window');
const navigatorH = 64; // navigator height
const [aWidth, aHeight] = [width, height/2];
const [left, top] = [0, 0];
const [middleLeft, middleTop] = [(width - aWidth) / 2, (height - aHeight) / 2 - navigatorH];

const styles = StyleSheet.create({
    container: {
        position:"absolute",
        width:width,
        height:height,
        left:left,
        top:top,
        elevation: 5,
    },
    mask: {
        justifyContent:"center",
        backgroundColor:"#383838",
        opacity:0.3,
        position:"absolute",
        width:width,
        height:height,
        left:left,
        top:top,
    },
    tip: {
        width:aWidth,
        height:aHeight,
        left:middleLeft,
        // backgroundColor:"#fff",
        // alignItems:"center",
        // justifyContent:"space-between",
    },
    topView: {
        height:130,
        width:aWidth,
        flexDirection:'row',
    },
    topView1: {
        flex:1,
        marginTop:35,
        height:95,
        backgroundColor:'#FFFFFF',
        justifyContent:'center',
        paddingLeft:160
    },
    img: {
        height:118,
        width:118,
        borderRadius:6 ,
        resizeMode:'contain'
    },
    imgView: {
        height:120,
        width:120,
        marginLeft:20,
        position:'absolute',
        borderRadius:6,
        borderWidth:0.5,
        borderColor:placeholderTextColor,
        justifyContent:'center',
        alignItems:'center',
        shadowColor: 'gray',
        shadowOffset: {height: 2, width: 2},
        shadowRadius: 6,
        shadowOpacity: 0.4,
        backgroundColor:'#FFFFFF',
        elevation: 2
    },
    txt: {
        fontSize:16,
        color:titleTextColor,
        marginBottom:5,
    },
    txtColor: {
        backgroundColor:'#f3f3f3',
        borderColor:'#c7c7c7',
        marginRight:10,
        padding:5,
        borderRadius:3,
        borderWidth:0.5,
        minWidth:60,
        textAlign:'center'
    },
    end:{
        backgroundColor: '#FFFFFF',
        padding: 10,
        flex: 1,
        paddingHorizontal: 20,
        marginBottom: -1
    },

});

export default class SelectProductCarDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            offset: new Animated.Value(0),
            opacity: new Animated.Value(0),
            hide: true,
            title:'',
            valueCustom: 1,
            selectSkus: {},
        };
        this.productFeatueList=[];
    }
    componentDidMount(){
        for (let skus of this.props.data.skus) {
            if (skus.id === this.props.data.showSkuId) this.setState({selectSkus : Object.assign({},skus,{specs:skus.specs})});
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
                            item.feature.push({...specs,'isSelect':false});
                        }
                    }
                    if (isSpecTextRepeat) break;
                }

                if (!isSpecTextRepeat) {
                    let sku = {'id': specs.specId, 'description': specs.specText, 'feature': []};
                    sku.feature.push({...specs,'isSelect':false});
                    this.productFeatueList.push(sku)
                }
            }
        }
    }

    _keyExtractor = (item, index) => index;
    render() {
        let data = this.props.data;
        let content = this.state.hide? null:( <View style={[styles.container, ]}>
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
                        <Text style={{color:priceColor,marginBottom:5}}>￥{parseFloat(this.state.selectSkus.salePrice).toFixed(2)}</Text>
                    </View>
                    <View style={styles.imgView}>
                        <Image source={{uri: this.state.selectSkus.imgUrl===''?emptyImgUrl:this.state.selectSkus.imgUrl}} style={styles.img}/>
                    </View>
                </View>
                <ScrollView style={styles.end}>
                    <View style={{marginTop: 10, marginBottom: 10, backgroundColor: placeholderTextColor, height: 0.5}}/>
                    {
                        this.productFeatueList.map((itemData, key) =>{
                            return <View key={key} style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
                                <Text>{itemData.description}：</Text>
                                {itemData.feature.map((item, index) => {
                                    this.productFeatueList[key].feature[index].isSelect =false;
                                    this.productFeatueList[key].feature[index].isSelect =(this.state.selectSkus.specs[key].specValueId=== item.specValueId);
                                    let color = item.isSelect?mainColor:placeholderTextColor;
                                    return <TouchableOpacity activeOpacity={0.7} key={index} onPress={()=> this.selectSpec(item)}>
                                        <Text
                                            style={[styles.txtColor, {color: color, borderColor: color,}]}>
                                            {item.specValueText}
                                        </Text>
                                    </TouchableOpacity>
                                })}
                            </View>
                        })
                    }
                </ScrollView>
                <TouchableOpacity
                    style={{
                        width: width,
                        height: 45,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: mainColor
                    }}
                    onPress={()=> this.props.onPress(this.state.valueCustom, this.state.selectSkus.id,this.state.selectSkus.salePrice)}
                    activeOpacity={0.7}>
                    <Text style={{color: '#FFFFFF', fontSize: 18}}>立即购买</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>);
        return content;
    }

    selectSpec(spec){
        let selectedIdArr = [];
        this.productFeatueList.map(productFeatue=>{
            productFeatue.feature.map(item=>{
                if(spec.specId === item.specId){
                    item.isSelect = (spec.specValueId === item.specValueId);
                }
                if(item.isSelect){
                    selectedIdArr.push(item.specValueId);
                }
            })
        });


        for (let skus of this.props.data.skus) {
            let find = false;
            for(let id of selectedIdArr){
                for(let spec of skus.specs){
                    find = spec.specValueId === id;
                    if(find)break;
                }
                if(!find)break;
            }

            if(find){
                // console.log('find',skus.id);
                this.setState({
                    selectSkus:skus
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
    out(){
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
        if(!this.state.hide){
            this.out();
        }
    }

    //选择
    choose(msg) {
        if(!this.state.hide){
            this.out();
        }
    }

    show(title) {
        if(this.state.hide){
            this.setState({hide: false, title: title}, this.in);
        }
    }
}
