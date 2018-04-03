import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    DeviceEventEmitter,
} from 'react-native';

import {
  content2TextColor,mainColor
} from "../../../constraint/Colors";
import {connect} from 'react-redux'
import {IntegralStyles} from "../../../styles/IntegralStyles";
import LFlatList from '../../../widgets/LFlatList';
import {post, isSuccess} from "../../../common/CommonRequest";
import {showToastShort} from "../../../common/CommonToast";
const {width} = Dimensions.get('window');
import RequestErrorView from '../../../widgets/RequestErrorView';
import RedPacketDialog from '../../../widgets/RedPacketDialog'
import {isIphoneX} from "react-native-iphone-x-helper";

class RedEnvelopesDetailed extends Component {

    constructor(props){
        super(props);
        this.state = {
            data:'',
            isRequestError: false,
            isLoading: true,
            amount:'',
        };
    }

    componentDidMount(){
        this.listener =  DeviceEventEmitter.addListener('REDENVELOPES',()=>{
            if(this.refs.RedEnvelopesDetailed) {
                this.refs.RedEnvelopesDetailed.reset();
            }
        })
    };

    componentWillUnmount(){
        if(this.listener){
            this.listener.remove();
        }
    }

    _getredPackageList(callback, options,page = 1){
        let requestObj = {
            token: this.props.token,
            pageNo:page,
            pageSize:20
        };
        let apiUrl = 'main/redPackageList';
        post(apiUrl, requestObj)
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

    _errorMsg(msg) {
        this.setState({
            isRequestError: true,
            isLoading: false,
        });
        showToastShort(msg);
    }

    renderReceive(item){
        if (item.state === 'REDPACK_SENT'){
            this.setState({amount:item.amount},()=>{
                this.refs.RedPacketDialog.showDialog()
            })
        }
    }

    _onRefresh(callback, options) {
        this._getredPackageList(callback,options);
    }

    _onLoadMore(page = 1,callback,options){
        this._getredPackageList(callback,options,page);
    }

    render(){
        let receiveShowView = (
            <View style={{flex:1,alignItems:'center'}}>
                <View style={{borderRadius:5,backgroundColor:mainColor}}>
                    <Text style={{textAlign:'center',color:'white',fontSize:14,marginHorizontal:20,marginVertical:10}}>{'领取'}</Text>
                </View>
            </View>
        );
        let  model = {
            "REDPACK_SENT": (receiveShowView),
            "ALREADY_EXAMINE": (receiveShowView),
            'REDPACK_CANCELLED':(<Text style={[styles.itemTextStyle,{color:content2TextColor}]}>已失效</Text>),
            'CANCELED_CANC':(<Text style={[styles.itemTextStyle,{color:content2TextColor}]}>已失效</Text>),
            'IN_THE_DISTRIBUTED':(<Text style={[styles.itemTextStyle,{color:content2TextColor}]}>发放中</Text>),
            'DISTRIBUTION_OF_FAILURE':(<Text style={[styles.itemTextStyle,{color:content2TextColor}]}>已失效</Text>),
            'REFUNDED':(<Text style={[styles.itemTextStyle,{color:content2TextColor}]}>已失效</Text>),
            'NOT_AVAILABLE':(<Text style={[styles.itemTextStyle,{color:content2TextColor}]}>未到领取时间</Text>),
            'REDPACK_RECEIVED':(<Text style={[styles.itemTextStyle,{color:mainColor}]}>已领取</Text>),
        };

        let showView = this.state.isRequestError ? (
            <RequestErrorView onPress={() => {
                this.setState({isRequestError: false, isLoading: true,});
            }}/>
        ) :(
                <View style={IntegralStyles.transactionLayoutView}>
                    <View style={IntegralStyles.listViewTitleLayoutStyle}>
                        <Text style={IntegralStyles.listViewTitleStyle}>{'时间'}</Text>
                        <Text style={IntegralStyles.listViewTitleStyle}>{'金额'}</Text>
                        <Text style={IntegralStyles.listViewTitleStyle}>{'备注'}</Text>
                    </View>
                    <View style={IntegralStyles.verticalLine}/>

                    <View style={[ {backgroundColor:'white', paddingBottom:10,flex:1}]}>
                        <LFlatList
                            ref={'RedEnvelopesDetailed'}
                            onLoadMore={this._onLoadMore.bind(this)}
                            firstLoader={false}
                            onRefreshing={this._onRefresh.bind(this)}
                            showsVerticalScrollIndicator={false}
                            ItemSeparatorComponent={()=><View style={IntegralStyles.verticalLine}/>}
                            pagination={true}
                            refreshable={true}
                            withSections={false}
                            isMounted={false}
                            emptyView={()=><Text style={{marginTop:10,textAlign:'center'}}>{}</Text>}
                            isShowFirstLoadView={true}
                            enableEmptySections={true}
                            renderItem={({item,index}) =>
                                <View key={index}>

                                    <View style={styles.listViewStyle}>
                                        <Text style={[styles.itemTextStyle,{color:content2TextColor,marginVertical:5,flex:1,}]}>{item.date}</Text>
                                        <Text style={[styles.itemTextStyle,{color:content2TextColor,marginVertical:5,flex:1,}]}>{item.state === 'REDPACK_RECEIVED'?item.amount:'**'}</Text>

                                        <TouchableOpacity activeOpacity={item.state === 'REDPACK_SENT'?0.7:1} style={{flex:1,alignItems:'center',}}
                                                          onPress={()=>{
                                                               this.renderReceive(item)
                                                          }}
                                        >
                                            {model[item.state]}
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            }
                        />
                    </View>
                </View>
        );

        return (
            <View style={[styles.ViewStyle,styles.shadowStyle]}>
                {showView}
                <RedPacketDialog
                    token={this.props.token}
                    redPacketInfo={this.state.amount}
                    dispatch={this.props.dispatch}
                    ref={'RedPacketDialog'}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({

    shadowStyle:{
        backgroundColor:'white',
        borderRadius:5,
        shadowColor: 'gray',
        shadowOffset: {height: 2, width: 2},
        shadowRadius: 3,
        shadowOpacity: 0.2,
        elevation: 2
    },
    cellStyle:{
        marginTop:10,
        width:width-20,
        marginLeft:10,
    },
    ViewStyle: {
        backgroundColor: 'white',
        marginTop: 10,
        flex: 1,
        marginBottom: isIphoneX() ? 44 : 10,
        marginLeft: 10,
        marginRight: 10
    },
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
});

selector = (state) => {
    return {
        token: state.loginStore.token,
    }
};

export default connect(selector) (RedEnvelopesDetailed);
