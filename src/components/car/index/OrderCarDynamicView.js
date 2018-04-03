import React, {Component} from 'react';
import {
    StyleSheet,
    Animated,
    Easing,
    View,
    Text,
    Image,
} from 'react-native';
import {contentTextColor, mainColor} from "../../../constraint/Colors";
import {ic_order_dynamic} from "../../../constraint/Image";

var dataList = [];

class OrderCarDynamicView extends Component {
    render() {
        dataList = this.props.data;
        return (
            <View style={styles.container1}>
                <Image source={{uri: ic_order_dynamic}}
                       resizeMode={Image.resizeMode.contain}
                       style={{width: 37, height: 34, marginLeft: 15}}/>
                <View style={{width: 1, height: 36, backgroundColor: '#666666', marginLeft: 15, marginRight: 15}}/>
                <MarqueeView/>
            </View>
        );
    }
}

class MarqueeView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            translateY: new Animated.Value(0),
        };
    }

    componentDidMount() {
        if (dataList.length > 2) {
            this.showHeadBar(0, dataList.length-1);         //从第0条开始，轮播5条数据
        }
    }

    showHeadBar(index, count) {
        // console.log('start')
        index++;
        Animated.timing(this.state.translateY, {
            toValue: -20 * index,             //40为文本View的高度
            duration: 300,                        //动画时间
            Easing: Easing.linear,
            delay: 1500                            //文字停留时间
        }).start(() => {                          //每一个动画结束后的回调
            if (index >= count) {
                index = 0;
                this.state.translateY.setValue(0);
            }
            this.showHeadBar(index, count);  //循环动画
        })
    }

    render() {
        return (
            <View style={[styles.container, {justifyContent: dataList.length <= 2 ? 'center' : null}]}>
                <Animated.View
                    style={{transform: [{translateY: this.state.translateY}]}}
                >
                    {
                        dataList.map((item, index) => {
                            return (
                                <View key={index}>
                                    <View style={styles.bar}>
                                        <Text style={styles.firstText}>近日下单</Text>
                                        <Text numberOfLines={1}
                                              style={styles.barText}>{item.loginName + '，参与购车下单成功'}</Text>
                                    </View>
                                </View>
                            );
                        })
                    }
                </Animated.View>
            </View>
        );
    }
}

const styles = StyleSheet.create({

    container1: {
        flexDirection: 'row',
        height: 60,
        alignItems: 'center',
        backgroundColor: 'white',
        marginTop: 10,
    },
    container: {
        height: 40,
        overflow: 'hidden',
        backgroundColor: 'white',
        marginRight: 5,
        flex: 1,
    },
    bar: {
        flexDirection: 'row',
        height: 20,
        alignItems: 'center',
    },
    firstText: {
        marginRight: 5,
        color: mainColor,
        fontSize: 10,
        borderColor: mainColor,
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 2,
        paddingBottom: 1,
        borderRadius: 8,
        borderWidth: 1,
        textAlign: 'center',
    },
    barText: {
        marginLeft: 5,
        color: contentTextColor,
        fontSize: 12,
        textAlign: 'left',
        flex: 1,
        // paddingHorizontal:10,
    },
});

export default (OrderCarDynamicView);