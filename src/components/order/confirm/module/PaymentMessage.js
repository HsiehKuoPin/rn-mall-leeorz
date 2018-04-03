import React, {Component} from 'react';
import {
    View,
    Text,
} from 'react-native';
import {content2TextColor, placeholderTextColor, titleTextColor} from "../../../../constraint/Colors";

class IntegralCarMessage extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        var data = this.props.data;
        var total = data.total !== undefined ? Number(data.total).toFixed(2) : 0;
        return (
            <View>
                <Text style={{
                    marginTop: 20,
                    marginLeft: 25,
                    fontSize: 15,
                    color: titleTextColor,
                }}>支付明细:</Text>
                {
                    data.payInfo === null ? <View/> : data.payInfo.map((item, index) => {
                        return <Text
                            key={index}
                            style={{
                                marginTop: 10,
                                marginLeft: 25,
                                fontSize: 13,
                                color: content2TextColor,
                            }}>{item}</Text>
                    })
                }
                {data.total !== undefined ? (
                    <View>
                        <Text style={{
                            marginTop: 10,
                            marginLeft: 25,
                            fontSize: 13,
                            color: content2TextColor,
                        }}>需支付金额</Text>
                        <View style={{flexDirection: 'row', marginTop: 10, justifyContent: 'center'}}>
                            <Text style={{fontSize: 18, paddingRight: 5}}>￥</Text>
                            <Text style={{
                                fontSize: 30,
                                color: titleTextColor,
                                textAlign: 'center',
                            }}>
                                {total}
                            </Text>
                        </View>
                        <View style={{
                            marginTop: 10,
                            marginLeft: 10,
                            marginRight: 10,
                            backgroundColor: placeholderTextColor,
                            height: 0.5
                        }}/>
                    </View>) : null}

            </View>
        );
    }
}

export default (IntegralCarMessage);

