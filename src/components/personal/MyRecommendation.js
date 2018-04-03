import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    FlatList
} from 'react-native';

import TitleBar from '../../widgets/TitleBar';
import {showToastShort} from "../../common/CommonToast";
import {post, getRequestFailTip, isSuccess} from '../../common/CommonRequest';

import {connect} from 'react-redux';
import {
    ic_personal_background,
} from "../../constraint/Image";
import {mainBackgroundColor} from "../../constraint/Colors";
import {TotalNumber} from "../personal/assets/integral/module/TotalNumber";

const screenW = Dimensions.get('window').width;
import {isIphoneX} from "react-native-iphone-x-helper";
import {IntegralStyles} from "../../styles/IntegralStyles";
import TransactionHistoryList from "../personal/assets/integral/module/TransactionHistoryList";
import {MY_RECOMMENDATION} from "../../constraint/AssetsType";

class MyRecommendation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
        }
    }

    componentDidMount() {
        this.loadMyRecommendation()
    }

    loadMyRecommendation() {
        post('user/myRecommend', {token: this.props.token})
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    this.setState({
                        data: responseData.result
                    })
                    // this.props.dispatch(updateAsset(MY_RECOMMENDATION,responseData.result))
                } else {
                    showToastShort(getRequestFailTip(responseData));
                }
            }).catch((e) => {
            showToastShort(getRequestFailTip());
            console.warn(e.message);
        });
    }

    render() {
        let {asset} = this.props;
        return (
            <View style={styles.container}>
                <View style={{height: isIphoneX() ? screenW * 0.5 + 25 : screenW * 0.5}}>
                    <Image source={ic_personal_background}
                           style={styles.backgroundImageStyle}/>
                    <TitleBar
                              title={'创友圈'}
                              customBarStyle={{backgroundColor: 'transparent',}}
                    />
                    {/*<TotalNumber total={this.state.data.commission} totalTip={'推荐返佣总额'}/>*/}
                    <Text style={[IntegralStyles.totalTextStyle, {
                        textAlign: 'center',
                        // marginTop: 20
                        // marginTop: 10
                    }]}>{'推荐会员：' + this.state.data.recommendCount + '人'}</Text>
                </View>

                <View style={styles.viewStyle}>
                    <View style={IntegralStyles.transactionLayoutView}>
                        <View style={IntegralStyles.listViewTitleLayoutStyle}>
                            <Text style={IntegralStyles.listViewTitleStyle}>{'用户名'}</Text>
                            <Text style={IntegralStyles.listViewTitleStyle}>{'手机号码'}</Text>
                            {/*<Text style={IntegralStyles.listViewTitleStyle}>{'返佣（消费券）'}</Text>*/}
                        </View>
                        <View style={IntegralStyles.verticalLine}/>

                        <View style={{backgroundColor: 'white', paddingBottom: 10, flex: 1}}>
                            <TransactionHistoryList token={this.props.token} type={MY_RECOMMENDATION}
                                                    isMyRecommendation={true}/>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: mainBackgroundColor
    },
    backgroundImageStyle: {
        resizeMode: 'cover',
        position: 'absolute',
        width: screenW,
        height: isIphoneX() ? screenW * 0.5 + 25 : screenW * 0.5,
        marginTop:-50,
    },
    viewStyle: {
        backgroundColor: 'white',
        marginTop: -85,
        // marginTop: -15,
        flex: 1,
        marginBottom: isIphoneX() ? 44 : 10,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 5,
        shadowColor: 'gray',
        shadowOffset: {height: 2, width: 2},
        shadowRadius: 5,
        shadowOpacity: 0.2,
        elevation: 2
    },
});

selector = (state) => {
    return {
        token: state.loginStore.token,
        asset: state.userInfoStore.assetInfo.MY_RECOMMENDATION,
    }
};

export default connect(selector)(MyRecommendation);
