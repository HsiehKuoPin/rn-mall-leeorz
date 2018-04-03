'use strict';
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Animated,
    Dimensions,
    Platform,
} from 'react-native';
import {isIphoneX} from "react-native-iphone-x-helper";
import Wheel from './region/Wheel';
import PropsType from 'prop-types'
import {mainBackgroundColor, titleTextColor} from "../constraint/Colors";
import CITY_DATAS from './region/area.json';
const defaultTop = Platform.OS === 'android' ? ((Platform.Version >= 21) ? 0 : 25) : 0;
const topValue = 44;

const {width, height} = Dimensions.get('window');
const navigatorH = 64; // navigator height
const [aWidth, aHeight] = [width, height/3];
const [left, top] = [0, 0];
const [middleLeft, middleTop] = [(width - aWidth) / 2, (height - aHeight) / 2 - navigatorH];
export default class Region extends Component {
    static propTypes = {
        province: PropsType.string,
        city: PropsType.string,
        street: PropsType.string,
        onValueChange: PropsType.func,
        onCancelPress: PropsType.func,
        onSurePress: PropsType.func,
        ...View.propTypes
    };

    constructor(props) {
        super(props);

        this.provinces = [];
        this.provinceIndex = 0;
        this.citys = [];
        this.cityIndex = 0;
        this.streets = [];
        this.streetIndex = 0;

        this.state = {
            offset: new Animated.Value(0),
            opacity: new Animated.Value(0),
            hide: true,

            provinceIndex: this.provinceIndex,
            cityIndex: this.cityIndex,
            streetIndex: this.streetIndex,
        };
    }
    componentDidMount() {
        for (let i = 0; i < CITY_DATAS.length; i++) {
            this.provinces.push(CITY_DATAS[i].name);
            if (this.props.province && CITY_DATAS[i].name === this.props.province) {
                this.provinceIndex = i;
            }
        }

        for (let i = 0; i < CITY_DATAS[this.provinceIndex].addresses.length; i++) {
            let city = CITY_DATAS[this.provinceIndex].addresses[i].name;
            this.citys.push(city);
            if (this.props.city && city === this.props.city) {
                this.cityIndex = i;
            }
        }

        for (let i = 0; i < CITY_DATAS[this.provinceIndex].addresses[this.cityIndex].addresses.length; i++) {
            let street = CITY_DATAS[this.provinceIndex].addresses[this.cityIndex].addresses[i].name;
            this.streets.push(street);
            if (this.props.street && street === this.props.street) {
                this.streetIndex = i;
            }
        }
        this.onValueChange()
    }
    getCitys(index) {
        if (index < 0 || index >= CITY_DATAS.length) return [];
        let citys = [];
        for (let i = 0; i < CITY_DATAS[index].addresses.length; i++) {
            let city = CITY_DATAS[index].addresses[i].name;
            citys.push(city);
        }
        return citys
    }

    getStreets(index, cityIndex) {
        if (index < 0 || index >= CITY_DATAS.length) return [];
        if (cityIndex < 0 || cityIndex >= CITY_DATAS[index].addresses.length) return [];
        let streets = [];
        for (let i = 0; i < CITY_DATAS[index].addresses[cityIndex].addresses.length; i++) {
            let street = CITY_DATAS[index].addresses[cityIndex].addresses[i].name;
            streets.push(street);
        }
        return streets
    }

    onValueChange() {
        this.props.onValueChange && this.props.onValueChange(this.getChooseValue())
    }
    //选择
    onSurePress() {
        if(!this.state.hide) this.out();
        this.props.onSurePress && this.props.onSurePress(this.getChooseValue())
    }

    getChooseValue() {
        let provinceData = CITY_DATAS[this.state.provinceIndex];
        let cityData = provinceData.addresses[this.state.cityIndex];
        let areaData = cityData.addresses[this.state.streetIndex];
        return ({
            province: {id: provinceData.id, name: provinceData.name},
            city: {id: cityData.id, name: cityData.name},
            area: {id: areaData ? areaData.id : '', name: areaData ? areaData.name : ''}
        })
    }

    //显示动画
    in() {
        Animated.parallel([
            Animated.timing(this.state.opacity, {duration: 450, toValue: 0.8}),
            Animated.timing(this.state.offset, {duration: 450, toValue: 1}),
        ]).start();
    }

    //隐藏动画
    out(){
        Animated.parallel([
            Animated.timing(this.state.opacity, {duration: 300, toValue: 0}),
            Animated.timing(this.state.offset, {duration: 300, toValue: 0}),
        ]).start();
        setTimeout(() => this.setState({hide: true}), 300);
    }

    //取消
    dismiss() {
        if(!this.state.hide) this.out();
    }

    show() {
        if(this.state.hide) this.setState({hide: false, provinceIndex:0,cityIndex:0,streetIndex:0}, this.in);
    }
    render() {
        let content = this.state.hide ? null :
            ( <View style={styles.container}>
                <Animated.View style={styles.mask}>
                    <Text style={styles.mask} onPress={this.dismiss.bind(this)}/>
                </Animated.View>

                <Animated.View style={[styles.tip, {
                    transform: [{
                        translateY: this.state.offset.interpolate({
                            inputRange: [0, 1],
                            outputRange: [height, (height - aHeight - (isIphoneX() ? topValue : defaultTop))]
                        }),
                    }]
                }]}>
                    <View style={styles.topView}>
                        <TouchableOpacity
                            onPress={() => this.dismiss()}>
                            <Text style={{color: '#337ab7', paddingHorizontal: 10}}>取消</Text>
                        </TouchableOpacity>
                        <Text style={{color: 'black', fontSize: 16}}>城市选择</Text>
                        <TouchableOpacity
                            onPress={() => this.onSurePress()}>
                            <Text style={{color: '#337ab7', paddingHorizontal: 10}}>确定</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        {this.renderWheel()}
                    </View>
                </Animated.View>
            </View>);
        return content;
    }

    renderWheel() {
        let views = [];
        views.push(
            <Wheel
                key="1"
                style={styles.wheelStyle}
                itemStyle={styles.wheelText}
                onChange={(index) => {
                    this.setState({provinceIndex: index, cityIndex: 0, streetIndex: 0});
                    this.onValueChange()
                }}
                holeLine={1}
                items={this.provinces}
                defaultIndex={this.provinceIndex}/>);
        views.push(
            <Wheel
                key="2"
                style={styles.wheelStyle}
                itemStyle={styles.wheelText}
                onChange={(index) => {
                    this.setState({cityIndex: index, streetIndex: 0});
                    this.onValueChange()
                }}
                holeLine={1}
                index={this.state.cityIndex}
                items={this.getCitys(this.state.provinceIndex)}
            />);
        views.push(
            <Wheel
                key="3"
                style={styles.wheelStyle}
                itemStyle={styles.wheelText}
                onChange={(index) => {
                    this.setState({streetIndex: index});
                    this.onValueChange()
                }}
                holeLine={1}
                index={this.state.streetIndex}
                items={this.getStreets(this.state.provinceIndex, this.state.cityIndex)}
            />);
        return views
    }

}

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
    },
    topView: {
        height: 40,
        width:aWidth,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        backgroundColor:"#fff",
    },
    wheelStyle: {
        flex: 1,
        backgroundColor: mainBackgroundColor
    },
    wheelText:{
        textAlign: 'center',
        fontSize: 14,
        color: titleTextColor
    }
});