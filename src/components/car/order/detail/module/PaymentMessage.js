import React, {Component} from 'react';
import {
    View,
    Text,
} from 'react-native';
import {content2TextColor, placeholderTextColor, titleTextColor} from "../../../../../constraint/Colors";
import {PAYMENTS_CONFIG} from "../../../../../constraint/AssetsType";
import {formatMoney} from "../../../../../common/StringUtil";

class PaymentMessage extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        var data = this.props.data;
        var totals = Number(data.amount).toFixed(2);
        return (
            <View>
                <Text style={{
                    marginTop: 20,
                    marginLeft: 25,
                    fontSize: 15,
                    color: titleTextColor,
                }}>支付明细:</Text>
                <View style={{flexDirection: 'row'}}>
                    <Text style={{
                        marginTop: 10,
                        marginLeft: 25,
                        fontSize: 13,
                        color: content2TextColor
                    }}>
                        {PAYMENTS_CONFIG[data.accountType].name + '支付'}
                    </Text>
                    <Text style={{
                        marginTop: 10,
                        marginLeft: 50,
                        fontSize: 13,
                        color: content2TextColor
                    }}>
                        {formatMoney(data.amount,false)}
                    </Text>
                </View>
                <Text style={{
                    marginTop: 10,
                    marginLeft: 25,
                    fontSize: 13,
                    color: content2TextColor,
                }}>尾款需支付金额</Text>
                <View style={{flexDirection: 'row', marginTop: 10, justifyContent: 'center'}}>
                    <Text style={{fontSize: 18, paddingRight: 5}}>￥</Text>
                    <Text style={{
                        fontSize: 30,
                        color: titleTextColor,
                        textAlign: 'center',
                    }}>
                        {formatMoney(totals,false)}
                    </Text>
                </View>

                <View style={{
                    marginTop: 10,
                    marginLeft: 10,
                    marginRight: 10,
                    backgroundColor: placeholderTextColor,
                    height: 0.5
                }}/>
            </View>
        );
    }
}

export default (PaymentMessage);

