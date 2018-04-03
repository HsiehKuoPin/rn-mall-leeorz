import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Animated,
    Dimensions,
    DeviceEventEmitter,
    FlatList
} from 'react-native';
import {mainColor, contentTextColor,} from "../../../constraint/Colors";
import {isIphoneX} from "react-native-iphone-x-helper";
import {CommonStyles} from "../../../styles/CommonStyles";

const {width, height} = Dimensions.get('window');
export default class StoreCategory extends Component {

    constructor(props) {
        super(props);
        this.state = {
            offset: new Animated.Value(0),
            opacity: new Animated.Value(0),
            hide: true,
            selectIndex: 0
        };
    }

    render() {
        let result = [];
        result.push({name: '全部', id: ''})
        result.push(...this.props.data)
        return (
            this.state.hide ? null : (<View style={styles.container}>
                    <Animated.View style={styles.mask}>
                        <TouchableOpacity style={styles.mask} onPress={this.dismiss.bind(this)}/>
                    </Animated.View>
                    <Animated.View style={{
                        transform: [{
                            translateX: this.state.offset.interpolate({
                                inputRange: [0, 1],
                                outputRange: [-height, width * 0.2]
                            })
                        }]
                    }}>
                        <View style={[styles.scrollViewStyle, {height: height * 0.7}]}>
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={result}
                                keyExtractor={(item, index) => index}
                                renderItem={({item, index}) =>
                                    <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                        <TouchableOpacity
                                            style={[styles.categoryLayout, {backgroundColor: this.state.selectIndex === index ? mainColor : 'white'}]}
                                            onPress={() => {
                                                this.chooseItem(item, index)
                                            }}>
                                            <Text numberOfLines={2} style={{
                                                color: this.state.selectIndex === index ? 'white' : contentTextColor,
                                                textAlign: 'center', marginHorizontal: 2
                                            }}>{item.name}</Text>
                                        </TouchableOpacity>
                                        <View style={CommonStyles.vline}/>
                                    </View>
                                }/>
                        </View>
                    </Animated.View>
                </View>
            )
        )
    }

    chooseItem(item, index) {
        if (this.state.selectIndex !== index) {
            this.setState({selectIndex: index})
            DeviceEventEmitter.emit('Category', item.id);
        }
        this.dismiss()
    }

    in() {
        Animated.parallel([
            Animated.timing(
                this.state.opacity,
                {
                    duration: 450,
                    toValue: 0.5,
                }
            ),
            Animated.timing(
                this.state.offset,
                {
                    duration: 450,
                    toValue: 0.9,
                }
            )
        ]).start();
    }

    out() {
        Animated.parallel([
            Animated.timing(
                this.state.opacity,
                {
                    duration: 300,
                    toValue: 0,
                }
            ),
            Animated.timing(
                this.state.offset,
                {
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

    dismiss() {
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
    scrollViewStyle: {
        width: width * 0.22,
        backgroundColor: 'white',
        marginTop: height / 6
    },
    categoryLayout: {
        height: 60,
        width: width * 0.22,
        alignItems: 'center',
        justifyContent: 'center'
    },
});