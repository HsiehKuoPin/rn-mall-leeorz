import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    TouchableOpacity,
    DeviceEventEmitter
} from 'react-native';

import {
    mainBackgroundColor
} from "../../../constraint/Colors";

import {ic_filter} from "../../../constraint/Image";

import TitleBar from '../../../widgets/TitleBar';
import {connect} from 'react-redux';
import TranscationTypeSelector from './integral/module/TranscationTypeSelector'
import TransactionHistoryList from "./integral/module/TransactionHistoryList";
import {BALANCE_ACCOUNT} from "../../../constraint/AssetsType";
import {IntegralStyles} from "../../../styles/IntegralStyles";
import XImage from '../../../widgets/XImage';
import {isIphoneX} from "react-native-iphone-x-helper";


class PaymentsBalance extends Component {

    constructor(props) {
        super(props);
        this.assetType =  this.props.navigation.state.params.assetType;


        this.operationAction = '';
        this.operationType = '';
    }

    componentDidMount() {
        this.listener = DeviceEventEmitter.addListener('operation', (operation) => {
            this.operationAction = operation.action === 'operationAction' ? operation.operation : '';
            this.operationType = operation.action === 'operationType' ? operation.operation : '';

            if (this.refs.TransactionHistoryList) {
                this.refs.TransactionHistoryList.loadTransaction(this.operationAction, this.operationType);
            }
        })
    }

    componentWillUnmount() {
        // DeviceEventEmitter.removeListener('operation');
        this.listener.remove();
    }

    _keyExtractor = (item, index) => index;

    render() {
        return (
            <View style={styles.container}>
                <TitleBar title={'收支明细'}
                          hideRight={false}
                          customRightView={() => (
                              <TouchableOpacity activeOpacity={0.7} onPress={() => {
                                  this.refs.TranscationTypeSelector.show();
                              }}>
                                  <XImage source={ic_filter} style={styles.rightBarImageStyle}/>
                              </TouchableOpacity>
                          )}
                />
                <View style={styles.viewStyle}>
                    {/*<View style={IntegralStyles.listViewTitleLayoutStyle}>*/}
                        {/*<Text style={IntegralStyles.listViewTitleStyle}>{'时间'}</Text>*/}
                        {/*<Text style={IntegralStyles.listViewTitleStyle}>{'金额'}</Text>*/}
                        {/*<Text style={IntegralStyles.listViewTitleStyle}>{'备注'}</Text>*/}
                    {/*</View>*/}
                    {/*<View style={IntegralStyles.verticalLine}/>*/}

                    {/*paddingBottom: 10, marginHorizontal: 10*/}
                    <View style={{backgroundColor: 'white', flex: 1}}>
                        <TransactionHistoryList ref={'TransactionHistoryList'} token={this.props.token}
                                                type={this.assetType}/>
                    </View>
                </View>
                <TranscationTypeSelector ref={'TranscationTypeSelector'}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: mainBackgroundColor
    },

    viewStyle: {
        backgroundColor: 'white',
        // marginTop: 10,
        flex: 1,
        marginBottom: isIphoneX() ? 44 : 0,
        // marginBottom: isIphoneX() ? 44 : 10,
        // marginLeft: 10,
        // marginRight: 10,
        // borderWidth: 0,
        // borderRadius: 5,
        // shadowColor: 'gray',
        // shadowOffset: {height: 2, width: 2},
        // shadowRadius: 5,
        // shadowOpacity: 0.2,
        // elevation: 4
    },

    rightBarImageStyle: {
        resizeMode: 'cover',
        width: 20,
        height: 20,
        position: 'relative',
    },
});

selector = (state) => {
    return {
        token: state.loginStore.token
    }
};

export default connect(selector)(PaymentsBalance);
