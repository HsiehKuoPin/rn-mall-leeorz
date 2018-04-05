import React, {Component} from 'react';
import {
    View,
    Image,
    Text,
    TouchableOpacity,
} from 'react-native';

import {connect} from 'react-redux';
import {goto} from '../../../../../reducers/RouterReducer';
import {content2TextColor, placeholderTextColor, titleTextColor} from "../../../../../constraint/Colors";
import {ic_order_address, ic_right_arrows} from "../../../../../constraint/Image";

class SelectAddress extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        let {data} = this.props;
        return (
            <View>
                <TouchableOpacity
                    style={{
                        backgroundColor: 'white',
                        justifyContent: 'center',
                        borderTopLeftRadius: 6,
                        borderTopRightRadius: 6
                    }}
                    activeOpacity={0.5}
                    onPress={() => this.props.dispatch(goto('AddressList'))}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Image
                            style={{marginLeft: 15, width: 30, height: 30}}
                            source={ic_order_address}
                            resizeMode="contain"/>
                        <View style={{
                            flex: 1,
                            flexDirection: 'column',
                            marginLeft: 10,
                            marginRight: 5,
                        }}>
                            <Text style={{
                                fontSize: 14,
                                paddingTop: 18,
                                color: titleTextColor
                            }}
                                  numberOfLines={2}>
                                {data.contactPerson === undefined ? '收货人:' : '收货人:' + data.contactPerson} {data.phone === undefined ? '' : '\u3000' + data.phone}</Text>
                            <Text style={{
                                paddingTop: 10,
                                paddingBottom: 5,
                                fontSize: 14,
                                color: content2TextColor
                            }}
                                  numberOfLines={2}>
                                {data.area === undefined ? '请选择收货地址' : data.area + data.addressDetail}
                            </Text>
                        </View>
                        <Image
                            style={{
                                marginRight: 30,
                                width: 15,
                                height: 15,
                                resizeMode: 'cover'
                            }}
                            source={ic_right_arrows}
                            resizeMode="contain"/>
                    </View>

                    <View style={{
                        margin: 15,
                        marginTop: 10,
                        marginBottom: 0,
                        backgroundColor: placeholderTextColor,
                        height: 0.5
                    }}/>
                </TouchableOpacity>
            </View>
        );
    }
}

export default connect()(SelectAddress);