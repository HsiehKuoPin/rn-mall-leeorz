import React, {Component} from 'react';
import {
    View,
    Text,
} from 'react-native';


import {content2TextColor, placeholderTextColor, titleTextColor} from "../../../../constraint/Colors";
import {ic_order_address} from "../../../../constraint/Image";
import XImage from "../../../../widgets/XImage";

class AddressMessage extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        var data = this.props.data;
        var border = this.props.border;
        return (
            <View>
                <View
                    style={{
                        backgroundColor: 'white',
                        justifyContent: 'center',
                        borderTopLeftRadius: border,
                        borderTopRightRadius: border
                    }}
                    onPress={() => this.props.dispatch(goto('AddressList'))}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <XImage
                            style={{marginLeft: 15, width: 30, height: 30}}
                            source={ic_order_address}/>
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
                                {data.contactPerson === '' ? '收货人:' : '收货人:' + data.contactPerson} {data.phone === '' ? '' : '\u3000' + data.phone}</Text>
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
                    </View>

                    <View style={{
                        margin: 15,
                        marginBottom: 10,
                        marginTop: 10,
                        marginBottom: 0,
                        backgroundColor: placeholderTextColor,
                        height: 0.5
                    }}/>
                </View>
            </View>
        );
    }
}

export default (AddressMessage);