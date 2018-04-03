import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,Dimensions
} from 'react-native';
import {mainColor,placeholderTextColor,titleTextColor,content2TextColor} from "../../../constraint/Colors";
import connect from "react-redux/es/connect/connect";
import {goto} from "../../../reducers/RouterReducer";
import {isTrue} from "../../../common/AppUtil";

class OrderItemBottom extends Component {

    render(){

        let result = undefined;
        let  showView = (
            <View style={{ backgroundColor:placeholderTextColor, height:0.5, marginHorizontal:10}}/>
        );

        if(this.props.supportAfterSale === 'Y'){
            result = (
                <View>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => this.props.dispatch(goto('ApplyCustomerService',{orderItems:[this.props.data]}))}
                    >
                        <Text style={[styles.textStyle,{color:mainColor, borderColor:mainColor,}]}>{"申请售后"}</Text>
                    </TouchableOpacity>
                </View>
            );
        }else if(this.props.supportAfterSale === 'N'){
            result = (
                <View>
                    <Text style={[styles.textStyle,{color:content2TextColor, borderColor:content2TextColor}]}>{"申请售后"}</Text>
                </View>
            );
        }else
        {
            result = null;
            showView = null;
        }

        let bottomView = (
            <View>
                {showView}
                <View style={{backgroundColor:'#00000000',flexDirection:'row',justifyContent:'flex-end'}}>
                    {result}
                </View >
            </View>
        );

        return(
            bottomView
        )
    }
}

const styles = StyleSheet.create({

    textStyle:{
        borderWidth:1,
        paddingHorizontal:20,
        paddingVertical:7,
        fontSize:14,
        marginHorizontal:10,
        marginVertical:12,
        borderRadius:3,
    },
    orderStoreName:{
        backgroundColor:'#00000000',
        color:'#181818',
        fontSize:16,
        paddingHorizontal:10,
        paddingVertical:10,
    },
    orderStatusTip: {
        backgroundColor:'#00000000',
        fontSize: 14,
        color: titleTextColor,
        paddingHorizontal: 10,
        paddingVertical: 10,
    }
});


export default connect()(OrderItemBottom);
