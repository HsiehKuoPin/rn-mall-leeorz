import React, {Component} from 'react';
import {
    Image,
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';

import {
    titleTextColor, mainColor, placeholderTextColor,
    contentTextColor
} from '../../../../../constraint/Colors';
import {ic_myAsset} from "../../../../../constraint/Image";
import {goto} from "../../../../../reducers/RouterReducer";
import {connect} from 'react-redux';
import {checkInputMoney, formatMoney} from "../../../../../common/StringUtil";
import {isIPhone5} from "../../../../../common/AppUtil";
import {
    CONSUMER_COUPON_ACCOUNT,ENTREPRENEURSHIP_COUPON_ACCOUNT,BALANCE_ACCOUNT,COMPANY_BALANCE_ACCOUNT
} from "../../../../../constraint/AssetsType";

class MyAssetView extends Component {

    goto(scoreName) {
        const {dispatch} = this.props;
        if (scoreName === '消费券') {
            dispatch(goto('Integral',{assetType:CONSUMER_COUPON_ACCOUNT}))
        } else if (scoreName === '消费余额') {
            dispatch(goto('Balance',BALANCE_ACCOUNT))
        } else if (scoreName === '创业券'){
            dispatch(goto('Integral',{assetType:ENTREPRENEURSHIP_COUPON_ACCOUNT}))
        } else if (scoreName === '商家余额'){
            dispatch(goto('Balance',COMPANY_BALANCE_ACCOUNT))
        }
    }

    render() {
        return (<View>
                <View style={{marginTop: 10, backgroundColor: "white",}}>
                    <View style={styles.allAsset}>
                        {/*<Image source={ic_myAsset} style={{width: 30, height: 30, marginLeft: 10,}}/>*/}
                        <Text style={styles.allAssetLeft}>我的资产</Text>
                        <TouchableOpacity activeOpacity={0.7} style={{height:30,alignItems:'center',justifyContent:'center'}} onPress={() => this.props.dispatch(goto('MyAsset'))}>
                            <Text style={styles.moreAssetRight}>更多资产</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.line}/>
                    <View style={styles.scoreLayout}>
                        {this.assetItem(this.props.userInfo.accountConsumerCoupon, "消费券")}
                        <View style={styles.itemLine}/>
                        {this.assetItem(this.props.userInfo.accountBalance, "消费余额")}
                    </View>
                </View>

                {/*{*/}
                    {/*!this.props.userInfo.isCompanyMember?null:<View style={{marginTop: 10, backgroundColor: "white",}}>*/}
                        {/*<View style={styles.allAsset}>*/}
                            {/*/!*<Image source={ic_myAsset} style={{width: 30, height: 30, marginLeft: 10,}}/>*!/*/}
                            {/*<Text style={styles.allAssetLeft}>商家资产</Text>*/}
                        {/*</View>*/}
                        {/*<View style={styles.line}/>*/}
                        {/*<View style={[styles.scoreLayout,{justifyContent: 'flex-start',}]}>*/}
                            {/*{this.assetItem(this.props.userInfo.companyBalance, '商家余额')}*/}
                            {/*<View style={styles.itemLine}/>*/}
                            {/*{this.assetItem(this.props.userInfo.entrepreneurshipCoupon, "创业券",false)}*/}

                            {/*/!*{this.assetItem(undefined,undefined,false)}*!/*/}
                        {/*</View>*/}
                    {/*</View>*/}
                {/*}*/}
            </View>
        )
    }

    assetItem(score, scoreName,isShow = true) {
        return !isShow?<View style={{flex:1}}/>: <TouchableOpacity activeOpacity={0.7} style={styles.scoreLayoutItem}
                                 onPress={() => this.goto(scoreName)}>
            <Text style={styles.scoreValue}>{formatMoney(!isNaN(score) ? score : score, false)}</Text>
            <Text style={styles.scoreText}>{scoreName}</Text>
        </TouchableOpacity>;
    }
}

const styles = StyleSheet.create({
    allAsset: {
        flex: 1,
        height: 40,
        alignItems: 'center',
        flexDirection: 'row',
    },
    allAssetLeft: {
        paddingLeft: 10,
        flex: 1,
        color: titleTextColor,
        fontSize: 15
    },
    moreAssetRight: {
        marginRight: 10,
        color: '#65BCFE',
        fontSize: 13
    },
    scoreLayout: {

        height: 80,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scoreLayoutItem: {
        flex: 1,
        alignItems: 'center'
    },
    scoreValue: {
        fontSize: isIPhone5() ? 18 : 20,
        color: mainColor
    },
    scoreText: {
        fontSize: 13,
        color: contentTextColor,
        marginTop: 5,
    },
    line: {
        backgroundColor: placeholderTextColor,
        height: 0.5,
        marginLeft: 10,
        marginRight: 10,
        flex: 1
    },
    itemLine: {
        backgroundColor: placeholderTextColor,
        width: 0.5,
        height: 50,
    },
});

export default connect()(MyAssetView);