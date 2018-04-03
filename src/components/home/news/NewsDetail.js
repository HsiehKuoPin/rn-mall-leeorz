import React, {Component} from 'react';
import {
    Text,
    View,
    StyleSheet,
    Platform
} from 'react-native';

import TitleBar from '../../../widgets/TitleBar';
import {mainBackgroundColor, titleTextColor, content2TextColor} from '../../../constraint/Colors';
import {post, getRequestFailTip, isSuccess} from '../../../common/CommonRequest';
import {showToastShort} from '../../../common/CommonToast';
import RequestErrorView from '../../../widgets/RequestErrorView';
import LoadingView from "../../../widgets/LoadingView";
import AutoHeightWebView from '../../../widgets/AutoHeightWebView';
import IphoneModel from "../../../widgets/IphoneModel";
import {connect} from 'react-redux';

class NewsDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: {},
            isRequestError: false,
            isLoading: true,
        }
        this.id = this.props.navigation.state.params.id;
        this.type = this.props.navigation.state.params.type;
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        if (this.type === 'message') {
            post('main/push/getPushMessageDetail', {id: this.id, token: this.props.token})
                .then((responseData) => {
                    if (isSuccess(responseData)) {
                        this.setState({isRequestError: false, isLoading: false, data: responseData.result})
                    } else {
                        this._errorMsg(responseData)
                    }
                }).catch((e) => {
                this._errorMsg()
            });
        } else {
            post('main/getAnnouncement', {announcementId: this.id})
                .then((responseData) => {
                    if (isSuccess(responseData)) {
                        this.setState({isRequestError: false, isLoading: false, data: responseData.result.announcement})
                    } else {
                        this._errorMsg(responseData)
                    }
                }).catch((e) => {
                this._errorMsg()
            });
        }
    }

    _errorMsg(responseData) {
        this.setState({isRequestError: true, isLoading: false,});
        if (responseData) {
            showToastShort(getRequestFailTip(responseData));
        }
        else {
            showToastShort(getRequestFailTip());
        }
    }

    render() {
        let data;
        if (this.type === 'message') {
            data = this.state.data.content;
        } else {
            data = this.state.data.detail;
        }
        let webView = Platform.OS === 'android' ? (<AutoHeightWebView
                source={{html: data}}
                mediaPlaybackRequiresUserAction={true}
                javaScriptEnabled={true}
            />)
            :
            ( <AutoHeightWebView
                automaticallyAdjustContentInsets={false}
                source={{html: data}}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                decelerationRate="normal"
                startInLoadingState={true}
                scalesPageToFit={false}
            />);
        let showView = this.state.isRequestError ? (
            <RequestErrorView onPress={() => {
                this.setState({isRequestError: false, isLoading: true});
                this.getData();
            }}/>) : (
            this.type === 'message' ? (webView) : (
                <View style={{flex: 1, flexDirection: 'column',}}>
                    <View style={{
                        backgroundColor: 'white',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <Text style={styles.title}>{this.state.data.title}</Text>
                        <Text style={styles.time}>{'时间：' + this.state.data.createTime}</Text>
                    </View>
                    {webView}
                </View>)
        );
        return (
            <View style={{backgroundColor: 'white', flex: 1}}>
                <TitleBar title={'动态详情'}/>
                {this.state.isLoading ? <LoadingView/> : showView}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    title: {
        fontSize: 17,
        color: titleTextColor,
        marginTop: 15,
        paddingHorizontal: 10,
    },
    time: {
        fontSize: 14,
        color: content2TextColor,
        marginTop: 10,
        marginBottom: 15,
    },
});

selector = (state) => {
    return {
        token: state.loginStore.token,
    }
}
export default connect(selector)(NewsDetail)
