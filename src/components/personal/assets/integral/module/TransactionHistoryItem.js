import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';

import {content2TextColor, mainColor, titleTextColor} from "../../../../../constraint/Colors";
import {getDateTime} from "../../../../../common/StringUtil";

export default class TransactionHistoryItem extends Component {

    setAmountTextColor(str){
        if(str){
            if(str.startsWith('+')){
                return mainColor;
            }else if(str.startsWith('-')){
                return 'green';
            }else{
                return titleTextColor;
            }
        }
    }

    render() {

        let {status,comment,createTime,amount,name,phone} = this.props.data;

        let isMyRecommendation = this.props.isMyRecommendation;
        if (!isMyRecommendation && !isNaN(createTime)) {
            createTime = getDateTime(createTime);
        }
        let remark = status?status:comment?comment:'暂无';
        return (
            <View>
                {isMyRecommendation?this._renderMyRecommendationItem({name,phone}):this._renderDefaultItem({amount,createTime,remark})}
            </View>
        )
    }

    _renderDefaultItem({amount,createTime,remark}){
        return <View style={styles.listViewStyle2}>
                    <View style={styles.listViewTopStyle}>
                        <Text style={[styles.itemAmountStyle,{color:this.setAmountTextColor(amount)}]}>{amount}</Text>
                        <Text style={styles.itemTimeStyle}>时间: {createTime}</Text>
                    </View>
                    <Text style={styles.itemRemarkStyle}>备注: {remark}</Text>
                </View>
    }

    _renderMyRecommendationItem({name,phone}){
        return <View>
            <View style={styles.listViewStyle}>
                <Text style={styles.itemTextStyle}>{name}</Text>
                <Text style={styles.itemTextStyle}>{phone}</Text>
            </View>
        </View>
    }
}

const styles = StyleSheet.create({

    listViewStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 10,
        paddingBottom: 10
    },
    itemTextStyle: {
        textAlign: 'center',
        fontSize: 14,
        flex: 1,
        color: content2TextColor,
        marginVertical: 5,
    },


    listViewStyle2: {
        paddingHorizontal:15,
        paddingTop: 5,
        paddingBottom: 5
    },
    listViewTopStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    itemAmountStyle: {
        fontSize: 18,
        flex:1,
        color: titleTextColor,
        marginVertical: 5,
    },
    itemTimeStyle: {
        textAlign: 'center',
        fontSize: 12,
        color: titleTextColor,
        marginVertical: 5,
    },

    itemRemarkStyle: {
        fontSize: 12,
        color: titleTextColor,
        marginVertical: 5,
    },
})
