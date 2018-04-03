import React, {Component} from 'react';
import {
    Text,
    View,
    StyleSheet,
    Dimensions
} from 'react-native';
import TitleBar from '../../../widgets/TitleBar';
import {connect} from 'react-redux';
import {BALANCE_ACCOUNT, BUSINESS_WITHDRAWAL, PERSONAL_WITHDRAWAL} from "../../../constraint/AssetsType";
import TransactionHistoryList from "./integral/module/TransactionHistoryList";
import {IntegralStyles} from "../../../styles/IntegralStyles";

class WithdrawalsRecord extends Component {

    constructor(props) {
        super(props);

        this.assetType = this.props.navigation.state.params;
    }

    render(){
        return (
            <View style={styles.container}>
                <TitleBar title={'提现记录'}/>
                <View style={{flex:1}}>
                    {/*<View style={styles.viewStyle}>*/}
                        {/*<View style={IntegralStyles.listViewTitleLayoutStyle}>*/}
                            {/*<Text style={IntegralStyles.listViewTitleStyle}>{'时间'}</Text>*/}
                            {/*<Text style={IntegralStyles.listViewTitleStyle}>{'提现金额'}</Text>*/}
                            {/*<Text style={IntegralStyles.listViewTitleStyle}>{'备注'}</Text>*/}
                        {/*</View>*/}
                        {/*<View style={IntegralStyles.verticalLine}/>*/}
                        {/*<View style={{backgroundColor:'white',marginHorizontal:10,paddingBottom:10,flex:5}}>*/}
                            <TransactionHistoryList token={this.props.token}
                                                    type={this.assetType === BALANCE_ACCOUNT?PERSONAL_WITHDRAWAL:BUSINESS_WITHDRAWAL}/>
                        {/*</View>*/}
                    {/*</View>*/}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'white',
        // backgroundColor: '#f2f2f2',
    },
    viewStyle:{
        backgroundColor:'white',
        marginTop:10,
        marginHorizontal:10,
        marginBottom:10,
        flex:1,
        borderColor: 'white',
        borderWidth: 0,
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
    }
};
export default connect(selector)(WithdrawalsRecord);
