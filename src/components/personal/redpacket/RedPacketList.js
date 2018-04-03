import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
} from 'react-native';

import {connect} from 'react-redux'
import {
    content2TextColor,mainColor
} from "../../../constraint/Colors"
import LFlatList from '../../../widgets/LFlatList';
import {post, isSuccess} from "../../../common/CommonRequest";
import RequestErrorView from '../../../widgets/RequestErrorView';
import {IntegralStyles} from "../../../styles/IntegralStyles";
import {getDateTime} from "../../../common/StringUtil";
const {width} = Dimensions.get('window');
import {showToastShort} from "../../../common/CommonToast";
import {updateAsset} from '../../../reducers/UserInfoReducer'
import {CONSUMER_COUPON_ACCOUNT,ENTREPRENEURSHIP_COUPON_ACCOUNT} from "../../../constraint/AssetsType";
import {isIphoneX} from "react-native-iphone-x-helper";

const PROCESS_CREATED = 'PROCESS_CREATED';//待领取
const PROCESS_COMPLETED = 'PROCESS_COMPLETED';//已领取
const APPROVE_PENDING = 'APPROVE_PENDING'; // 待审核
class RedPacketList extends Component {

    constructor(props){
        super(props);
        this.state = {
            isRequestError: false,
            isLoading: true,
        };
        this.type = this.props.type
    }

    _getConsumptiveRedEnvelopes(callback, options,page = 1){
        let requestObj = {
            token: this.props.token,
            pageNo:page,
            pageSize:20
        };
        let consumptiveApiUrl = 'user/getConsumptiveRedEnvelopes';
        let entrepreneurshipApiUrl = 'user/getEntrepreneurshipRedEnvelopes';
        post(this.type ===CONSUMER_COUPON_ACCOUNT?consumptiveApiUrl:entrepreneurshipApiUrl, requestObj)
            .then((responseData) => {
                if (isSuccess(responseData)) {

                    this.setState({
                        isLoading: false,
                        isRequestError: false,
                    })
                    callback(responseData.result.data, {isShowFirstLoadView: false,
                        haveNext: responseData.result.pageCount > responseData.result.pageNo,
                        pageNumber: responseData.result.pageNo === 1?2:responseData.result.pageNo});
                }else {
                    callback([],{requestError:true})
                    this._errorMsg("请求出现异常");
                } }).catch((e) => {
            callback([],{requestError:true})
            this._errorMsg(e.message);
        });
    }

    _onRefresh(callback, options) {
        this._getConsumptiveRedEnvelopes(callback,options);
    }

    _onLoadMore(page = 1,callback,options){
        this._getConsumptiveRedEnvelopes(callback,options,page);
    }

    _errorMsg(msg) {
        this.setState({
            isRequestError: true,
            isLoading: false,
        });
        showToastShort(msg);
    }
    render(){

        let showView = this.state.isRequestError ? (
            <RequestErrorView onPress={() => {
                this.setState({isRequestError: false, isLoading: true,});
            }}/>
        ) :(
            <View style={[ {backgroundColor:'white', paddingBottom:10,flex:1}]}>
                <LFlatList
                    ref={'ConsumptiveRedEnvelopes'}
                    onLoadMore={this._onLoadMore.bind(this)}
                    firstLoader={false}
                    onRefreshing={this._onRefresh.bind(this)}
                    emptyView={()=><Text style={{marginTop:10,textAlign:'center'}}>暂时没有数据</Text>}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={()=><View style={IntegralStyles.verticalLine}/>}
                    pagination={true}
                    refreshable={true}
                    withSections={false}
                    isMounted={false}
                    isShowFirstLoadView={true}
                    enableEmptySections={true}
                    renderItem={({item,index}) => <RowItem key={index}
                                                           item={item}
                                                           token={this.props.token}
                                                           dispatch={this.props.dispatch}
                                                           type = {this.type}
                    />}
                />
            </View>
        )

        return(
            <View style={styles.ViewStyle}>
                {/*{showView}*/}

                <View style={IntegralStyles.transactionLayoutView}>
                    <View style={IntegralStyles.listViewTitleLayoutStyle}>
                        <Text style={IntegralStyles.listViewTitleStyle}>{'时间'}</Text>
                        <Text style={IntegralStyles.listViewTitleStyle}>
                            {this.type===ENTREPRENEURSHIP_COUPON_ACCOUNT?'创业红包':'消费红包'}
                        </Text>
                        <Text style={IntegralStyles.listViewTitleStyle}>{'备注'}</Text>
                    </View>
                    <View style={IntegralStyles.verticalLine}/>
                    <View style={{backgroundColor: 'white', paddingBottom:10,flex:1}}>
                        {showView}
                    </View>
                </View>
            </View>
        )
    }
}



class RowItem extends Component{

    constructor(props){
        super(props);
        this.state = {
            status:this.props.item.status
        };
    }

    _receivRedEnvelopes(redEnvelopesId){
        let requestObj = {
            token: this.props.token,
            redEnvelopesId:redEnvelopesId,
        };

        let apiUrl;
        if (this.props.type === CONSUMER_COUPON_ACCOUNT){
            apiUrl = 'user/receivRedEnvelopes'
        }else
        {
            apiUrl   = 'user/receivEntrepreneurshipRedEnvelopes';
        }

        post(apiUrl, requestObj)
            .then((responseData) => {
                if (isSuccess(responseData)) {

                    this.setState({status:PROCESS_COMPLETED});
                    showToastShort('领取成功');
                    this.props.dispatch(updateAsset(this.props.type === CONSUMER_COUPON_ACCOUNT?
                        CONSUMER_COUPON_ACCOUNT:ENTREPRENEURSHIP_COUPON_ACCOUNT,{totalAmount:responseData.result.totalAmount}));
                }else {
                    showToastShort('领取失败');
                } }).catch((e) => {
            console.warn(e.message)
            // showToastShort(e);
            showToastShort('领取失败');
        });
    }

    renderReceive(item){
        if (item.status === PROCESS_CREATED){
            this._receivRedEnvelopes(item.redEnvelopesId)
        }
    }

    render(){
        let {item} = this.props;

        let receiveShowView = (
            <View style={{borderRadius:5,backgroundColor:mainColor}}>
                <Text style={{textAlign:'center',color:'white',fontSize:14,marginHorizontal:20,marginVertical:7}}>{'领取'}</Text>
            </View>   );
        let  model = {
            PROCESS_CREATED: (receiveShowView),
            PROCESS_COMPLETED:(<Text style={[styles.itemTextStyle,{color:mainColor}]}>已领取</Text>),
            APPROVE_PENDING:(<Text style={[styles.itemTextStyle,{color:content2TextColor}]}>待审核</Text>),
        };

        return <View style={styles.listViewStyle}>

            <Text style={[styles.itemTextStyle,{color:content2TextColor,marginVertical:5,flex:1,}]}>{getDateTime(item.createTime)}</Text>
            <Text style={[styles.itemTextStyle,{color:content2TextColor,marginVertical:5,flex:1,}]}>
                {this.state.status === PROCESS_COMPLETED?parseFloat(item.amount).toFixed(2):'**'}</Text>

            <TouchableOpacity activeOpacity={this.state.status === PROCESS_CREATED?0.7:1} style={{flex:1,alignItems:'center'}}
                              onPress={()=>{
                                  this.renderReceive(item)
                              }}
            >
                {model[this.state.status]}
            </TouchableOpacity>
        </View>;
    }
}

const styles = StyleSheet.create({

    listViewStyle:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        marginVertical:10
    },
    itemTextStyle:{
        textAlign:'center',
        fontSize:14,
    },
    ViewStyle:{
        backgroundColor:'white',
        marginTop:10,
        flex:1,
        marginBottom: isIphoneX() ? 44 : 10,
        borderRadius:3,
        marginHorizontal:10,
    },
});

selector = (state) => {
    return {
        token: state.loginStore.token,
    }
};

export default connect(selector) (RedPacketList);
