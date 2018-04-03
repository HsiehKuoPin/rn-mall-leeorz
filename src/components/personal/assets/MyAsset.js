import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    ScrollView
} from 'react-native';

import {
    mainBackgroundColor, titleTextColor, contentTextColor, placeholderTextColor
} from '../../../constraint/Colors';
import {ic_right_arrows} from "../../../constraint/Image";
import {connect} from 'react-redux';
import TitleBar from '../../../widgets/TitleBar';
import {goto} from "../../../reducers/RouterReducer";
import {post, isSuccess} from "../../../common/CommonRequest"
import {showToastShort} from "../../../common/CommonToast";
import {saveAsset} from '../../../reducers/UserInfoReducer'
import {formatMoney} from "../../../common/StringUtil";
import {CommonStyles} from "../../../styles/CommonStyles";
import {
    BALANCE_ACCOUNT,
    CONSUMER_COUPON_ACCOUNT,
    GENERAL_INTEGRAL_ACCOUNT, getAssetTypeName, JADE_INTEGRAL_ACCOUNT, K_INTEGRAL_ACCOUNT, PLATINUM_INTEGRAL_ACCOUNT,
    SPECIAL_INTEGRAL_ACCOUNT, ENTREPRENEURSHIP_COUPON_ACCOUNT, CONSUMER_INTEGRAL_ACCOUNT
} from "../../../constraint/AssetsType";
import BaseComponent from "../../../widgets/BaseComponent";

class MyAsset extends BaseComponent {
    constructor(props) {
        super(props);
        this.assetItemList = [
            [
                {key: BALANCE_ACCOUNT, func: (() => props.dispatch(goto('Balance',BALANCE_ACCOUNT)))},
                {key: PLATINUM_INTEGRAL_ACCOUNT, func: ((type) => props.dispatch(goto('Integral', {assetType: type})))},
                {key: JADE_INTEGRAL_ACCOUNT, func: ((type) => props.dispatch(goto('Integral', {assetType: type})))},
            ],
            [
                {key: CONSUMER_COUPON_ACCOUNT, func: (() => props.dispatch(goto('Integral',{assetType:CONSUMER_COUPON_ACCOUNT})))},
                {key: ENTREPRENEURSHIP_COUPON_ACCOUNT, func: (() => props.dispatch(goto('Integral',{assetType:ENTREPRENEURSHIP_COUPON_ACCOUNT})))},
                {key: GENERAL_INTEGRAL_ACCOUNT, func: ((type) => props.dispatch(goto('Integral', {assetType: type})))},
                {key: SPECIAL_INTEGRAL_ACCOUNT, func: ((type) => props.dispatch(goto('Integral', {assetType: type})))},
                {key: K_INTEGRAL_ACCOUNT, func: ((type) => props.dispatch(goto('Integral', {assetType: type})))},
                {key: CONSUMER_INTEGRAL_ACCOUNT, func: ((type) => props.dispatch(goto('Integral', {assetType: type})))},
            ]
        ]
    }

    componentWillReceiveProps(nextProps){
        if(this.isResume(nextProps)){
            this.loadMyAssets();
        }
    }

    componentDidMount(){
        this.loadMyAssets();
    }

    loadMyAssets() {
        post('user/getMyAssets', {token: this.props.token})
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    this.props.dispatch(saveAsset(responseData.result.myAssets));
                } else {
                    showToastShort(responseData.message)
                }
            })
    }

    _renderLayout() {
        let parentArr = [];
        this.assetItemList.map((item, index) => {
            let childArr = [];
            item.map((childItem, index) => {
                childArr.push(this._renderAssetItem(childItem, index, item.length));
            });

            parentArr.push(<View key={index} style={[styles.container,{marginBottom:index ===this.assetItemList.length - 1?10:0}]}>
                    <View style={{marginHorizontal: 15}}>
                        {childArr}
                    </View>
                </View>
            )
        });
        return parentArr;
    }

    render() {
        return (
            <View style={{backgroundColor: mainBackgroundColor, flex: 1}}>
                <TitleBar title={'我的资产'}/>
                <ScrollView>
                    {this._renderLayout()}
                </ScrollView>
            </View>
        )
    }

    _renderAssetItem(item, index, length) {
        let assetInfo = this.props.assetInfo[item.key]?this.props.assetInfo[item.key]:{};
        // console.warn(assetInfo.available);
        if(assetInfo.available === null)return;
        let available = formatMoney(assetInfo.available, false);
        return <View key={index}>
            {index === 0 ?null: <View style={styles.line}/>}
            {/*{(index + 1) < length ? <View style={styles.line}/> : null}*/}
            <TouchableOpacity
                activeOpacity={0.7}
                style={{flexDirection: 'row', height: 60, alignItems: 'center', justifyContent: 'center'}}
                onPress={() => item.func(item.key)}>
                <Text style={{color: titleTextColor, fontSize: 15}}>{getAssetTypeName(item.key)}</Text>
                <View style={{flex: 1}}/>
                <Text style={styles.value}>{formatMoney(available, false)}</Text>
                <Image source={ic_right_arrows} style={CommonStyles.rightArrowsStyle}/>
            </TouchableOpacity>
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        marginHorizontal: 10,
        backgroundColor: 'white',
        shadowOpacity: 0.2,
        shadowOffset: {height: 2, width: 2},
        shadowRadius: 3,
        elevation: 2,
        borderRadius: 3
    },
    value: {
        color: contentTextColor,
        fontSize: 15,
        marginRight: 10
    },
    line: {
        // flex: 1,
        backgroundColor: placeholderTextColor,
        height: 0.5
    }
});

selector = (state) => {
    return {
        nav:state.nav,
        assetInfo: state.userInfoStore.assetInfo,
        token: state.loginStore.token,
    }
};

export default connect(selector)(MyAsset)