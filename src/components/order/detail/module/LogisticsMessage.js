import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import {ic_order_express, ic_right_arrows} from "../../../../constraint/Image";
import {content2TextColor, mainColor, placeholderTextColor} from "../../../../constraint/Colors";
import XImage from "../../../../widgets/XImage";


class LogisticsMessage extends Component {

    constructor(props) {
        super(props);

    }

    render() {
        var data = this.props.data.transport;
        return (
            <View>
                <TouchableOpacity
                    activeOpacity={0.7}
                    style={{
                        backgroundColor: 'white',
                        justifyContent: 'center',
                        borderTopLeftRadius: 6,
                        borderTopRightRadius: 6
                    }}
                    disabled={data !== undefined ? false : true}
                    onPress={() => this.props.onPress()}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <XImage
                            style={{marginLeft: 15, width: 26, height: 24}}
                            source={ic_order_express}/>
                        <View style={{
                            flex: 1,
                            flexDirection: 'column',
                            marginLeft: 10,
                            marginRight: 5,
                            paddingTop: 15,
                            paddingBottom: 15,
                        }}>
                            <Text style={{
                                fontSize: 14,
                                paddingTop: 5,
                                color: mainColor,
                                lineHeight: 20
                            }}
                                  numberOfLines={2}>
                                {data !== undefined ? (data.context !== '' ? data.context : '暂无物流信息') : '暂无物流信息'}
                            </Text>
                            <Text style={{
                                fontSize: 12,
                                paddingTop: 5,
                                color: content2TextColor
                            }}
                                  numberOfLines={1}>
                                {data !== undefined ? (data.logTime !== '' ? data.logTime : '暂无发货时间') : '暂无发货时间'}
                            </Text>
                        </View>
                        {data !== undefined ? (<XImage
                            style={{
                                marginRight: 30,
                                width: 15,
                                height: 15,
                            }}
                            source={ic_right_arrows}/>) : <View/>}

                    </View>

                    <View style={{
                        margin: 15,
                        marginTop: 0,
                        marginBottom: 0,
                        backgroundColor: placeholderTextColor,
                        height: 0.5
                    }}/>
                </TouchableOpacity>
            </View>
        );
    }
}

export default (LogisticsMessage);