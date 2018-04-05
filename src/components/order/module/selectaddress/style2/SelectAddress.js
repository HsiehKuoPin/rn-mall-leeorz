import React, {Component} from 'react';
import {
    View,
    Image,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';

import {connect} from 'react-redux';
import {goto} from '../../../../../reducers/RouterReducer';
import {content2TextColor, placeholderTextColor, titleTextColor} from "../../../../../constraint/Colors";
import {ic_right_arrows} from "../../../../../constraint/Image";
import {ic_order_address} from "../../../../../../resources/index";
import {CommonStyles} from "../../../../../styles/CommonStyles";

class SelectAddress extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        let {data} = this.props;
        return (

                <TouchableOpacity
                    style={styles.container}
                    activeOpacity={0.7}
                    onPress={() => this.props.dispatch(goto('AddressList'))}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Image
                            style={{width: 30, height: 30}}
                            source={ic_order_address}
                            resizeMode="contain"/>
                        <View style={{
                            flex: 1,
                            backgroundColor:'red',
                            flexDirection: 'column',
                            marginLeft: 10,
                            marginRight: 5,
                        }}>
                            <Text style={{
                                fontSize: 14,
                                color: titleTextColor
                            }}
                                  numberOfLines={2}>
                                {data.contactPerson === undefined ? '收货人:' : '收货人:' + data.contactPerson} {data.phone === undefined ? '' : '\u3000' + data.phone}</Text>
                            <Text style={{
                                marginTop: 10,
                                fontSize: 14,
                                color: content2TextColor
                            }}
                                  numberOfLines={2}>
                                {data.area === undefined ? '请选择收货地址' : data.area + data.addressDetail}
                            </Text>
                        </View>
                        <Image
                            style={CommonStyles.rightArrowsStyle}
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
        );
    }
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:'white',
        justifyContent: 'center',
        alignItems:'center',
        paddingHorizontal:10,
        marginBottom:5,
        height:80,
    }
}) ;

export default connect()(SelectAddress);