import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import {titleTextColor, content2TextColor, mainColor} from "../../../constraint/Colors";
import XImage from "../../../widgets/XImage";

export default class StoreSale extends Component {

    render() {
        return (
            <View style={{flexDirection: 'row',marginTop:10}}>
                <XImage uri={this.props.data.logo} style={styles.storeImg}/>
                <View style={{justifyContent: 'center'}}>
                    <Text style={{color: titleTextColor, fontSize: 16,marginBottom:5}}>{this.props.data.name}</Text>
                    <Text style={{color: content2TextColor, fontSize: 12}}>在售商品<Text style={{color: mainColor}}>{this.props.data.saleCount}</Text>个</Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    storeImg: {
        width: 70,
        height: 70,
        backgroundColor:'white',
        marginHorizontal: 15,
        marginBottom: 15,
    },
});