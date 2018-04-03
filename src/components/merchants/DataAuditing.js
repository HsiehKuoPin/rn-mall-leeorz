import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity
} from 'react-native';

import TitleBar from '../../widgets/TitleBar';
import {connect} from 'react-redux';
import {
    ic_merchants_failure, ic_merchants_notto, ic_merchants_ongoing,
    ic_merchants_success
} from "../../constraint/Image";
import XImage from "../../widgets/XImage";
import {contentTextColor, mainColor, placeholderTextColor, titleTextColor} from "../../constraint/Colors";
import MerchantsDialog from "./MerchantsMessageDialog"
import {isSuccess, post} from "../../common/CommonRequest";
import {showToastShort} from "../../common/CommonToast";
import RequestErrorView from '../../widgets/RequestErrorView';
import LoadingView from "../../widgets/LoadingView";
import {PROCESS_COMPLETED, PROCESS_CREATED, PROCESS_FAILED} from "../../constraint/MerchantsType";
import {goto} from "../../reducers/RouterReducer";
import BaseComponent from "../../widgets/BaseComponent";

const width = Dimensions.get('window').width;
const lineWidth = (width - 20 - 30) / 4

class DataAuditing extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isRequestError: false,
            data: null,
            status: ''
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.isResume(nextProps) && this.isUserTokenChange(nextProps)) {
            this._loadDataAuditing();

        }
    }

    componentDidMount() {
        this._loadDataAuditing();
    }

    _loadDataAuditing() {
        post('order/company/getProcess', {token: this.props.token})
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    this.setState({
                        isLoading: false,
                        isRequestError: false,
                        data: responseData.result,
                        status: responseData.result.status
                    })
                } else {
                    this._errorMsg(responseData.message);
                }
            }).catch((e) => {
            this._errorMsg(e.message);
        });
    }

    _errorMsg(msg) {
        this.setState({
            isLoading: false,
            isRequestError: true,
        });
        showToastShort(msg);
    }

    _auditingFailureView() {
        return <View style={{marginLeft: 50, marginRight: 50, marginTop: 20}}>
            <Text style={styles.textStyle}>
                {this.state.data.comment}
            </Text>
            <TouchableOpacity style={[styles.buttonStyle, {marginTop: this.state.data.comment !== '' ? 20 : 0}]}
                              activeOpacity={0.7}
                              onPress={() => {
                                  this.props.dispatch(goto('MerchantInformation'));
                              }}>
                <Text style={{fontSize: 15, color: 'white'}}>再次申请</Text>
            </TouchableOpacity>
        </View>
    }

    _auditingSuccessView() {
        return <View style={{marginLeft: 50, marginRight: 50, marginTop: 20}}>
            <Text style={styles.textStyle}>
                {this.state.data.comment}
            </Text>
            <TouchableOpacity style={[styles.buttonStyle, {marginTop: this.state.data.comment !== '' ? 20 : 0}]}
                              activeOpacity={0.7} onPress={() => {
                this.refs.MerchantsDialog.show()
            }}>
                <Text style={{fontSize: 15, color: 'white'}}>查看商家信息</Text>
            </TouchableOpacity>
        </View>
    }

    render() {
        var showView = this.state.isRequestError ? (
            <RequestErrorView onPress={() => {
                this.setState({isRequestError: false, isLoading: true,});
                this._loadDataAuditing();
            }}/>
        ) : (
            <View style={styles.container}>
                <View
                    style={styles.viewStyle}>
                    <View style={{
                        marginHorizontal: (width - 20 - 30) / 4,
                        marginTop: 35,
                        marginBottom: 0,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                        <XImage source={ic_merchants_success} style={styles.imageStyle}/>
                        <View style={styles.lineStyle}/>
                        {/*<XImage*/}
                        {/*source={(this.state.status === PROCESS_CREATED || this.state.status === '') ? ic_merchants_ongoing : (this.state.status === PROCESS_FAILED ? ic_merchants_failure : ic_merchants_success)}*/}
                        {/*style={styles.imageStyle}/>*/}
                        <View
                            style={[styles.lineStyle, {backgroundColor: this.state.status === PROCESS_COMPLETED ? mainColor : placeholderTextColor}]}/>
                        <XImage
                            source={this.state.status === PROCESS_COMPLETED ? ic_merchants_success : ic_merchants_notto}
                            style={styles.imageStyle}/>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: 5}}>
                        <Text style={styles.titleStyle}>
                            {'提交申请' + '\n'}
                            <Text style={styles.contentStyle}>
                                {this.state.data !== null ? (this.state.data.applyTime !== null ? '(' + this.state.data.applyTime + ')' : '') : ''}
                            </Text>
                        </Text>
                        {/*<Text style={styles.titleStyle}>*/}
                        {/*{(this.state.status === PROCESS_CREATED || this.status === '' ? '审核资料' : (this.state.status === PROCESS_FAILED ? '审核失败' : '审核成功')) + '\n'}*/}
                        {/*<Text style={styles.contentStyle}>*/}
                        {/*{this.state.data !== null ? (this.state.data.auditTime !== null ? '(' + this.state.data.auditTime + ')' : '') : ''}*/}
                        {/*</Text>*/}
                        {/*</Text>*/}
                        <Text style={styles.titleStyle}>
                            {'完成' + '\n'}
                            <Text style={styles.contentStyle}>
                                {this.state.data !== null ? (this.state.data.finishTime !== null ? '(' + this.state.data.finishTime + ')' : '') : ''}
                            </Text>
                        </Text>
                    </View>
                    {(this.state.status === PROCESS_CREATED || this.state.status === '') ? null : (this.state.status === PROCESS_FAILED ? this._auditingFailureView() : this._auditingSuccessView())}
                </View>
                <MerchantsDialog
                    token={this.props.token}
                    phone={this.props.userInfo.phone}
                    dispatch={this.props.dispatch}
                    ref={'MerchantsDialog'}
                />
            </View>
        );
        return (
            <View style={styles.container}>
                <TitleBar title={'开店赚钱'}/>
                {this.state.isLoading ? <LoadingView/> : showView}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2'
    },
    viewStyle: {
        shadowColor: 'gray',
        shadowOffset: {height: 2, width: 2},
        shadowRadius: 5,
        shadowOpacity: 0.2,
        elevation: 2,
        backgroundColor: 'white',
        borderRadius: 5,
        margin: 10,
        paddingBottom: 30
    },
    lineStyle: {
        backgroundColor: mainColor,
        height: 2,
        width: lineWidth,
    },
    imageStyle: {
        width: 15,
        height: 15
    },
    buttonStyle: {
        marginTop: 20,
        backgroundColor: mainColor,
        alignItems: 'center',
        justifyContent: 'center',
        height: 35,
        borderRadius: 5
    },
    titleStyle: {
        fontSize: 13,
        color: titleTextColor,
        textAlign: 'center',
        width: (width - 20) / 2,
        lineHeight: 20,
    },
    textStyle: {
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: 14,
        textAlign: 'center',
        color: contentTextColor,
    },
    contentStyle: {
        fontSize: 13,
        color: contentTextColor,
        textAlign: 'center',
        width: (width - 20) / 3,
        lineHeight: 20,
    }
});
selector = (state) => {
    return {
        nav: state.nav,
        token: state.loginStore.token,
        userInfo: state.userInfoStore.userInfo,
    }
};

export default connect(selector)(DataAuditing);