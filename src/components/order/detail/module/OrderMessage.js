import React, {Component} from 'react';
import {
    View,
    Text,
} from 'react-native';
import {
    content2TextColor, mainColor, placeholderTextColor,
    titleTextColor
} from "../../../../constraint/Colors";
import {getOrderStatusText} from "../../../../constraint/OrderType";
import {formatMoney} from "../../../../common/StringUtil";

class OrderMessage extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        let {data} = this.props;
        let systemComment = data.address.systemComment;
        return (
            <View style={{backgroundColor: 'white', borderBottomLeftRadius: 6, borderBottomRightRadius: 6}}>
                <View style={{margin: 15}}>
                    <Text style={{color: titleTextColor, fontSize: 12}}>{'订单状态:' + getOrderStatusText(data.status)}</Text>
                    {
                        systemComment !== ''?(<Text style={{
                            marginTop:10,
                            color:content2TextColor,
                            fontSize:13,
                        }}>备注说明：{systemComment}</Text>) :null
                    }
                    {
                        data.orderInfo === null ? <View/> : data.orderInfo.map((item, index) => {
                            return <Text
                                style={{
                                    marginTop: 5,
                                    fontSize: 12,
                                    color: content2TextColor,
                                    lineHeight: 20,
                                }}
                                key={index}>
                                {item}
                            </Text>
                        })
                    }
                    <View style={{marginTop: 10, backgroundColor: placeholderTextColor, height: 0.5}}/>
                    {
                        data.productInfo === null ? <View/> : data.productInfo.map((item, index) => {
                            return <Text
                                style={{
                                    marginTop: 5,
                                    fontSize: 12,
                                    color: content2TextColor,
                                    lineHeight: 20,
                                }}
                                key={index}>
                                {item}
                            </Text>
                        })
                    }
                    <View style={{marginTop: 10, backgroundColor: placeholderTextColor, height: 0.5}}/>
                    <View style={{marginTop: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                        <View style={{flex: 1}}/>
                        <Text style={{fontSize: 12, color: titleTextColor, paddingRight: 15}}>{'共'+data.quantity+'个商品'}</Text>
                        <Text style={{fontSize: 12, color: titleTextColor, paddingRight: 5}}>订单总计:</Text>
                        <Text style={{fontSize: 12, color: mainColor}}>{formatMoney(data.total)}</Text>
                    </View>
                </View>
            </View>
        );
    }
}

export default (OrderMessage);

