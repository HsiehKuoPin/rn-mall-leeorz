import React, {Component} from 'react';
import {
    ImageBackground,
    View,
    StyleSheet,
    Text,
    Dimensions, Image
} from 'react-native';

import TitleBar from '../../widgets/TitleBar';
import {connect} from 'react-redux';
import {ic_merchants_index_button, ic_merchants_index_iphoneX, ic_merchants_index_other} from "../../constraint/Image";
import {isIphoneX} from "react-native-iphone-x-helper";
import {isIPhone5} from "../../common/AppUtil";
import LoadingView from "../../widgets/LoadingView";
import {goto} from "../../reducers/RouterReducer";
import {isSuccess, post} from "../../common/CommonRequest";
import {showToastShort} from "../../common/CommonToast";
import {showLoadingDialog} from "../../reducers/CacheReducer";
import BaseComponent from "../../widgets/BaseComponent";

const {width, height} = Dimensions.get('window');

class MerchantsIndex extends BaseComponent {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            data:{},
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.isResume(nextProps) && this.isUserTokenChange(nextProps)) {
            this._loadMerchantsIndex();

        }
    }

    componentDidMount() {
        this._loadMerchantsIndex();
    }

    _loadMerchantsIndex() {
        post('order/company/companyInPage', {token: this.props.token})
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    this.setState({
                        data: responseData,
                    })
                } else if (this.checkUserTokenValid({response: responseData, title: '您的登录已失效'})) {
                    this._errorMsg(responseData.message);
                }
            })
            .catch((e) => {
                this._errorMsg(e.message);
            });
    }

    _errorMsg(msg) {
        this.setState({
            isLoading: false,
        });
        showToastShort(msg);
        this.props.dispatch(showLoadingDialog(false))
    }

    render() {
        let showView = this.state.isLoading ? <LoadingView/> : <View style={{flex: 1, backgroundColor: '#00000000'}}>
            <Image source={ic_merchants_index_button}
                   style={[styles.imageStyle, {
                       marginTop: height * 0.38,
                   }]}>
                <Text style={styles.textStyle} suppressHighlighting={true} onPress={() => {
                    this.props.dispatch(goto('MerchantsSettled'))
                }}>立刻开店</Text>
            </Image>

            <View style={{flex: 1}}/>
            <Image source={ic_merchants_index_button}
                   style={[styles.imageStyle, {marginLeft: width * 0.3, marginBottom: isIphoneX() ? 80 : 40}]}>
                <Text style={styles.textStyle} suppressHighlighting={true} onPress={() => {
                    switch (this.state.data.result) {
                        case'FILL_IN_THE_INFORMATION':
                            this.props.dispatch(goto('MerchantInformation'));
                            break;
                        case'TO_APPLY_FOR_THE_LIST':
                            this.props.dispatch(goto('DataAuditing'));
                            break;
                        case'TIPS':
                            showToastShort(this.state.data.message);
                            break;
                    }
                }}>上传资料</Text>
            </Image>
        </View>;
        return (
            <ImageBackground style={styles.container} resizeMode='stretch'
                             onLoad={() => this.setState({isLoading: false})}
                             source={{uri: isIphoneX() ? ic_merchants_index_iphoneX : ic_merchants_index_other}}>
                <TitleBar title={'开店赚钱'} customBarStyle={{backgroundColor: 'transparent'}}/>
                {this.state.isLoading ? <LoadingView/> : showView}
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2'
    },
    imageStyle: {
        width: isIPhone5() ? 80 : 100,
        height: 40,
        marginLeft: 20,
        resizeMode: 'contain',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textStyle: {
        width: isIPhone5() ? 80 : 100,
        fontSize: 14,
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'white',
        backgroundColor: '#00000000'
    }
});

selector = (state) => {
    return {
        nav: state.nav,
        token: state.loginStore.token,
    }
};

export default connect(selector)(MerchantsIndex);