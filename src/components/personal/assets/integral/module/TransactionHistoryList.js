import React,{Component} from 'React';
import {
    Text,
    View,
    DeviceEventEmitter
} from 'react-native';
import TransactionHistoryItem from "./TransactionHistoryItem";
import LFlatList from '../../../../../widgets/LFlatList';
import {getRequestFailTip, post, isSuccess} from "../../../../../common/CommonRequest";
import {
    BALANCE_ACCOUNT, CONSUMER_COUPON_ACCOUNT, GENERAL_INTEGRAL_ACCOUNT, JADE_INTEGRAL_ACCOUNT,
    PLATINUM_INTEGRAL_ACCOUNT,
    SPECIAL_INTEGRAL_ACCOUNT, MY_RECOMMENDATION, K_INTEGRAL_ACCOUNT, COMPANY_BALANCE_ACCOUNT,
    ENTREPRENEURSHIP_COUPON_ACCOUNT, CONSUMER_INTEGRAL_ACCOUNT, PERSONAL_WITHDRAWAL, BUSINESS_WITHDRAWAL
} from "../../../../../constraint/AssetsType";
import {IntegralStyles} from "../../../../../styles/IntegralStyles";
import {showToastShort} from "../../../../../common/CommonToast";


let isMyRecommendation;
export default class TransactionHistoryList extends Component{
    constructor(props){
        super(props);
        this.type = this.props.type;
        this.operationAction = this.props.operationAction;
        this.operationType = this.props.operationType;
    }

    _getApi(assetType){
        switch (assetType){
            case BALANCE_ACCOUNT://余额
                return 'user/getBalanceAccountDetail';
            case JADE_INTEGRAL_ACCOUNT://玉积分
                return 'user/getJadeIntegralAccountDetail';
            case CONSUMER_COUPON_ACCOUNT://消费券
                return 'user/getConsumerCouponAccountDetail';
            case SPECIAL_INTEGRAL_ACCOUNT://专用积分
                return 'user/getSpecialIntegralAccountDetail';
            case K_INTEGRAL_ACCOUNT://K积分
                return 'user/getKIntegralAccountDetail';
            case PLATINUM_INTEGRAL_ACCOUNT://白金积分
                return 'user/getPlatinumIntegralAccountDetail';
            case GENERAL_INTEGRAL_ACCOUNT://通用积分
                return 'user/getGeneralIntegralAccountDetail';
            case COMPANY_BALANCE_ACCOUNT://商家余额
                return 'user/getCompanyBalanceAccountDetail';
            case ENTREPRENEURSHIP_COUPON_ACCOUNT: // 创业券
                return 'user/getEntrepreneurshipCouponAccountDetail';
            case CONSUMER_INTEGRAL_ACCOUNT://消费积分
                return 'user/getConsumerIntegralAccountDetail';
            case PERSONAL_WITHDRAWAL: // 个人提现记录
                return 'user/prepaidWithdrawList';
            case BUSINESS_WITHDRAWAL: // 商家提现记录
                return 'user/companyWithdrawList';
            case MY_RECOMMENDATION://我的推荐
                 isMyRecommendation = true;
                return 'user/myRecommendList';
        }
    }

    componentDidMount(){
        this.listener = DeviceEventEmitter.addListener('TRANSACTION_HISTORY_LIST_UPDATE',(data)=>{
            if(this.refs.TransactionHistoryList){
                this.refs.TransactionHistoryList.reset();
            }
        })
    }

    componentWillUnmount(){
        this.listener.remove();
    }

    componentWillReceiveProps(nextProps){
        if(this.type !== nextProps.type){
            this.type = nextProps.type;
            this.refs.TransactionHistoryList.reset();
        }
    }

    _getTransactionList(callback, options,page = 1){
        let requestObj = {
            token: this.props.token,
            operationAction: this.operationAction,
            operationType: this.operationType,
            pageNo:page,
            pageSize:20
        };

        let apiUrl = this._getApi(this.type);
        post(apiUrl, requestObj)
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    callback(responseData.result.data, {isShowFirstLoadView: false,
                        haveNext: responseData.result.pageCount > responseData.result.pageNo,
                        pageNumber: responseData.result.pageNo === 1?2:responseData.result.pageNo});
                }else {
                    showToastShort(getRequestFailTip(responseData));
                    callback([],{requestError:true})
                } }).catch((e) => {
                    showToastShort(getRequestFailTip());
                    console.warn(e.message);
                    callback([],{requestError:true})
        });
    }

    _onLoadMore(page = 1,callback,options){
        this._getTransactionList(callback,options,page);
    }

    loadTransaction(operationAction,operationType){
        this.operationAction = operationAction;
        this.operationType = operationType;
        this.refs.TransactionHistoryList.reset();
    }

    render(){
         isMyRecommendation = this.props.isMyRecommendation;

        return  <LFlatList
                    ref={'TransactionHistoryList'}
                    refreshable={false}
                    loadMoreable={true}
                    onLoadMore={this._onLoadMore.bind(this)}
                    showsVerticalScrollIndicator={false}
                    // ItemSeparatorComponent={()=><View style={IntegralStyles.verticalLine}/>}

                    withSections={false}
                    isMounted={false}
                    emptyView={()=><Text style={{marginTop:10,textAlign:'center'}}>暂时没有交易数据</Text>}
                    enableEmptySections={true}
                    renderItem={({item,key}) =>
                        <View key={key}>
                            <TransactionHistoryItem data = {item} isMyRecommendation={isMyRecommendation}/>
                            <View style={IntegralStyles.verticalLine}/>
                        </View>
                    }
                />
    }
}

// selector = (state) => {
//     return {
//         token: state.loginStore.token,
//     }
// };
// export default connect(selector)(TransactionHistoryList);
