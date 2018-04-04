import React from 'react'
import {View, StyleSheet, Image, TouchableOpacity, Text} from 'react-native';
import {connect} from "react-redux";
import TitleBar from "../../widgets/TitleBar";
import {goto} from "../../reducers/RouterReducer";
import LoadingView from "../../widgets/LoadingView";
import RequestErrorView from "../../widgets/RequestErrorView";
import { content2TextColor, mainBackgroundColor, mainColor, placeholderTextColor, titleTextColor} from "../../constraint/Colors";
import {ic_empty_car} from "../../constraint/Image";
import {isIphoneX} from "react-native-iphone-x-helper";
import ContentTipDialog from "./module/ContentTipDialog";
import {RefreshState} from "../../widgets/XFlatList";
import {getRequestFailTip, isSuccess, post} from "../../common/CommonRequest";
import {showToastShort} from "../../common/CommonToast";
import XFlatList from "../../widgets/XFlatList";
import BaseComponent from "../../widgets/BaseComponent";
import IphoneModel from "../../widgets/IphoneModel";
import {formatMoney} from "../../common/StringUtil";
import {APP_NAME} from "../../constraint/Strings";

class RichMore extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            refreshState: RefreshState.Idle,
            isRequestError: false,
            isLoading: true,
            memberList: [],
            rebateData:{},
        };
        this.pageNo=1;
        this.memberList=[];
    }

    componentWillReceiveProps(nextProps){
        if(this.props.updateRichMoreFlag !== nextProps.updateRichMoreFlag){
            this._loadData();
        }
    }

    componentDidMount() {
        this._loadData();
    }

    _loadData = () => {
        this.pageNo=1;
        this.memberList=[];

        let requestObj = {token: this.props.token,'pageNo': this.pageNo, 'pageSize': 20};//我的N+总返利与未注册订单数
        let memberListParam = {...requestObj,'pageNo': this.pageNo, 'pageSize': 20};//N+会员列表
        let memberListUrl = 'user/nMemberList';
        let rebateUrl = 'user/nTotalRebateAndReg';

        Promise.all([post(memberListUrl, memberListParam),post(rebateUrl, requestObj)])
            .then(([memberListData, rebateData]) => {
                if (isSuccess(memberListData) && isSuccess(rebateData)) {
                    this.pageNo += 1;
                    let refreshState =(memberListData.result.pageNo * memberListData.result.pageSize < memberListData.result.dataCount)?RefreshState.FooterRefreshing:RefreshState.NoMoreData;
                    this.memberList.push(...memberListData.result.data);

                    this.setState({refreshState:refreshState, memberList: this.memberList, rebateData:rebateData.result,isRequestError: false, isLoading: false});
                } else if (this.checkUserTokenValid({response: memberListData, title: '您的登录已失效'})) {
                    if (this.checkUserTokenValid({response: rebateData, title: '您的登录已失效'})) this.errMsg(memberListData);
                }
            }).catch((e) => {
            this.errMsg(e)
        });
    };

    errMsg(msg){
        this.setState({
            isRequestError: true,
            isLoading: false,
        });
        showToastShort(getRequestFailTip(msg));
    }

    _loadMore = () => {
        if(this.state.refreshState===RefreshState.Failure)this.setState({refreshState:RefreshState.FooterRefreshing});
        let requestObj = {token: this.props.token,'pageNo': this.pageNo, 'pageSize': 20};//N+会员列表
        post('user/nMemberList', requestObj)
            .then((memberListData) => {
                if (isSuccess(memberListData)) {
                    let refreshState =(memberListData.result.pageNo * memberListData.result.pageSize < memberListData.result.dataCount)?RefreshState.FooterRefreshing:RefreshState.NoMoreData;
                    this.pageNo += 1;
                    this.memberList.push(...memberListData.result.data);
                    this.setState({refreshState:refreshState, memberList: this.memberList});
                } else if (this.checkUserTokenValid({response: memberListData, title: '您的登录已失效'})) {
                    this.setState({refreshState: RefreshState.Failure});
                }
            }).catch((e) => {
            this.setState({refreshState:RefreshState.Failure});
        });
    };

    render() {
        return (
            <View style={{flex: 1}}>
                <TitleBar title={'N+会员'}
                          hideRight={false}
                          customRightView={()=><Text style={{color: 'white'}}>购买N+商品</Text>}
                          onRightViewClick={()=>this.props.dispatch(goto('RichMoreBuy'))}
                />
                {this.state.isLoading ? <LoadingView/> : this.showView()}
                <ContentTipDialog
                    ref={'ContentTipDialog'}
                    onConfirm={() => {
                        this.props.dispatch(goto('RichMoreBuy'));
                        this.refs.ContentTipDialog.dismiss();
                    }}/>
                <IphoneModel/>
            </View>
        )
    }

    showView() {
        return(
            this.state.isRequestError ? (
                <RequestErrorView onPress={() => {
                    this.setState({isRequestError: false,isLoading:true});
                    this._loadData();
                }}/>
            ) : (
                <View style={{flex: 1,backgroundColor:'#fff'}}>
                    <View style={styles.container}>
                        <XFlatList
                            showsVerticalScrollIndicator={false}
                            data={this.state.memberList}
                            keyExtractor={(item, index) => index}
                            ListHeaderComponent={() => <View style={{height: 5}}/>}
                            renderItem={({item, index}) => this.itemView(item, index)}
                            refreshState={this.state.refreshState}
                            onHeaderRefresh={this._loadData}
                            onFooterRefresh={this._loadMore}
                            ListEmptyComponent={this.emptyView()}
                            footerNoMoreDataText={this.state.memberList.length===0?'':''}
                        />
                    </View>
                    <View style={styles.bottom}>
                        <View style={{flex:1, backgroundColor:'#fff',justifyContent:'center',paddingLeft:15,paddingVertical:5}}>
                            <Text style={{color:titleTextColor,fontSize:14,padding:2}}>
                                奖励合计：
                                <Text style={{color:mainColor}}>{formatMoney(this.state.rebateData.totalRebate)}</Text>
                            </Text>
                            <Text style={{color:content2TextColor,fontSize:14,padding:2}}>还有{this.state.rebateData.reg}个订单号未注册</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.touch}
                            activeOpacity={0.5}
                            onPress={() => {
                                if (this.state.memberList.length === 0 && this.state.rebateData.reg === 0) this.refs.ContentTipDialog.show();
                                else if (this.state.rebateData.reg === 0) showToastShort('已没有订单号可注册！');
                                else this.props.dispatch(goto('RichMoreRegister'));
                            }}>
                            <Text style={{marginHorizontal:25,marginVertical:15,color:'#fff',fontSize:16}}>注册N+会员</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        )
    }

    itemView(item, index) {
        return <View key={index} style={styles.itemContainer}>
            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
                <Text style={styles.textTitle}>姓名：{item.name}</Text>
                <View style={{flex: 1}}/>
                <Text style={styles.textTitle}>ID：{item.fuDiPartyId}</Text>
            </View>
            <Text style={styles.text}>会员类型：{item.level}</Text>
            <Text style={styles.text}>注册订单号：{item.regOrderId}</Text>
            <View style={{height: 0.5, backgroundColor: placeholderTextColor, marginBottom: 15,marginTop: 20}}/>
            <View style={{flexDirection: 'row'}}>
                {this.item(`${APP_NAME}奖励`,parseFloat(item.erebate).toFixed(2),0.5)}
                {this.item('N+奖励',parseFloat(item.nrebate).toFixed(2),0.5)}
                {this.item('服务人数',item.refereesNum,0)}
            </View>
        </View>;
    }

    item(title,content,borderWith) {
        return <View style={{
            flex: 1,
            paddingVertical:5,
            justifyContent: 'center',
            alignItems: 'center',
            borderRightColor: placeholderTextColor,
            borderRightWidth: borderWith,
        }}>
            <Text style={styles.textTitle}>{title}</Text>
            <Text numberOfLines={1} style={{color: mainColor, fontSize: 18,marginTop:5}}>{content}</Text>
        </View>;
    }

    emptyView() {
        return <View style={styles.emptyViewStyle}>
            <Image source={ic_empty_car} style={{width: 120, height: 120, resizeMode: 'contain',marginBottom:15}}/>
            <Text style={styles.text}>您还没有注册N+会员</Text>
        </View>;
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: mainBackgroundColor,
    },
    bottom: {
        flexDirection: 'row',
        borderTopColor: placeholderTextColor,
        borderTopWidth: 0.5,
    },
    itemContainer: {
        backgroundColor: '#fff',
        padding: 20,
        marginTop:5,
        marginBottom: 5,
        marginHorizontal:10,
        borderRadius: 4,
        shadowColor: 'gray',
        shadowOffset: {height: 2, width: 2},
        shadowRadius: 3,
        shadowOpacity: 0.2,
        elevation: 2,
    },
    emptyViewStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 300,
        borderRadius: 4,
        shadowColor: 'gray',
        shadowOffset: {height: 2, width: 2},
        shadowRadius: 3,
        shadowOpacity: 0.2,
        elevation: 4,
        backgroundColor: '#fff',
        margin:10,
        marginTop:5,
    },
    touch: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: mainColor,
    },
    text:{
        color:content2TextColor,
        fontSize:14,
        paddingVertical:2,
    },
    textTitle:{
        color: titleTextColor,
        fontSize: 15
    }
});

selector = (state) =>{
    return {
        token:state.loginStore.token,
        nav:state.nav,
        updateRichMoreFlag:state.cacheStore.updateRichMoreFlag,
    }
};
export default connect(selector)(RichMore);