import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    TouchableOpacity,
    FlatList,ScrollView,DeviceEventEmitter,Platform
} from 'react-native';

import TitleBar from '../../../widgets/TitleBar'
import {connect} from 'react-redux'
import {ic_unfilled,ic_fill} from "../../../constraint/Image";
import {
    mainColor, mainBackgroundColor, contentTextColor,
    titleTextColor, content2TextColor, placeholderTextColor
} from '../../../constraint/Colors';
import {isSuccess, post} from "../../../common/CommonRequest";
import {showToastShort} from "../../../common/CommonToast";
import LogisticsInformationDialog from '../../../widgets/LogisticsInformationDialog';
import XImage from '../../../widgets/XImage';

const {screenW,screenH} = Dimensions.get('window');

let isShowButton;
class AfterSaleDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isRequestError: false,
            isLoading: true,
            data:{},
            detailData:[],
            progressListData:[],
            isShowLogistics:false,
        };
        isShowButton =false

        this.afterSaleId = this.props.navigation.state.params.afterSaleId
    }

    componentDidMount() {
        this._afterSaleDetail()

        DeviceEventEmitter.addListener('isShowLogistics', (state,) => {

            this._afterSaleDetail()
            this.setState({
                isShowLogistics:state
            })
        })
    }

    componentDidUnMount() {
        this.listener.remove();
    }

    _keyExtractor = (item, index) => index;
    _keyExtractor1 = (item, index) => index;

    _afterSaleDetail() {
        post('order/afterSaleDetail', {'token': this.props.token,'afterSaleId':this.afterSaleId})
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    this.setState({
                        isLoading: false,
                        isRequestError: false,
                        data:responseData.result.afterSale,
                        progressListData:responseData.result.afterSale.afterSaleProgressList,
                        detailData:responseData.result.afterSale.afterSaleProgressList[0].afterSaleProgressDetail
                    })
                }else {
                    this._errorMsg("请求出现异常");
                } }).catch((e) => {
            this._errorMsg(e.message);
        });
    }

    _errorMsg(msg) {
        this.setState({
            isRequestError: true,
        });
        showToastShort(msg);
    }

    render(){
        let  showView= (
            <TouchableOpacity style={{height:40, width:screenW,backgroundColor:mainColor,justifyContent:'center',alignItems:'center',}}
                              onPress={()=>{this.refs.LogisticsInformationDialog.show()}}
            >
                <Text style={{color:'white',fontSize:16}}>{'填写物流单号'}</Text>
            </TouchableOpacity>
        );

        let data=this.state.data;

        let statusData= data.refundType === 'REFUNDS'?[
                {'process':'提交申请','status':'TI_JIAO_SHEN_QING'},
                {'process':'商家处理','status':'SHANG_JIA_CHU_LI'},
                {'process':'买家退货','status':'MAI_JIA_TUI_HUO'},
                {'process':'退款处理','status':'TUI_KUAN_CHU_LI'},
            data.status === 'SHEN_QING_JIE_SHU'?{'process':'申请结束','status':'SHEN_QING_JIE_SHU'}:{'process':'申请完成','status':'SHEN_QING_WAN_CHENG'},
                ]
               :
                    [{'process':'提交申请','status':'TI_JIAO_SHEN_QING'},
                    {'process':'商家处理','status':'SHANG_JIA_CHU_LI'},
                    {'process':'退款处理','status':'TUI_KUAN_CHU_LI'},
                        data.status === 'SHEN_QING_JIE_SHU'?{'process':'申请结束','status':'SHEN_QING_JIE_SHU'}:{'process':'申请完成','status':'SHEN_QING_WAN_CHENG'},
                    ];

        statusData.map(item=>{
            this.state.progressListData.map((items)=>{
                if (item.status === items.status)
                {
                    if (items.status === 'SHANG_JIA_CHU_LI'){
                        isShowButton = true
                    }
                    if (items.status === 'MAI_JIA_TUI_HUO'){
                        isShowButton = false
                    }else if (items.status === 'SHEN_QING_JIE_SHU')
                    {
                        isShowButton = false
                    }
                    Object.assign(item, items,{'isComplete':true});
                }
            })
        });

        if (data.status === 'SHEN_QING_JIE_SHU'){
          statusData.map((item,index)=>{
              if (item.status === 'MAI_JIA_TUI_HUO'){ // 买家退货
                  if (!item.isComplete){
                      statusData.splice(index,1)
                  }
              }
          })
            statusData.map((item,index)=>{
                if (item.status === 'TUI_KUAN_CHU_LI'){ // 退款处理
                    if (!item.isComplete){
                        statusData.splice(index,1)
                    }
                }
            })
       }

        return(
            <View style={styles.container}>

                <TitleBar title={'售后单详情'}
                          hideRight={true}
                />
                <ScrollView>
                    <Head data={data}/>
                    <View style={styles.middleView}>
                        <Text style={{color:titleTextColor,fontSize:16, marginLeft:20,marginVertical:20}}>{'售后进度'}</Text>
                        <View style={{backgroundColor:placeholderTextColor,flex:1, marginHorizontal: 8, height:0.5}}/>
                        <View style={{backgroundColor:placeholderTextColor,marginLeft:28,height:30,width:2}}/>
                        <View style={{marginLeft:22.5,marginRight:10,flex:1}}>
                            <FlatList
                                data={statusData}
                                keyExtractor={this._keyExtractor}
                                renderItem={({item, index}) =>
                                    <View key={index} style={{backgroundColor:'white'}}>
                                            <View>
                                            <View style={{flexDirection:'row'}}>
                                            <Image source={item.isComplete?ic_fill:ic_unfilled} style={{width:13,height:13,resizeMode: 'contain'}}/>
                                            <Text style={{marginLeft:8,color:item.isComplete?titleTextColor:placeholderTextColor,fontSize:15}}>
                                                {item.process}
                                                </Text>
                                            <View style={{flex:1}}/>
                                            <Text style={{color:content2TextColor,fontSize:14,marginRight:10,}}>{item.createTime}</Text>
                                            </View>
                                                <View style={{marginLeft:0,flexDirection:'row'}}>
                                                    {index === statusData.length-1? null :(
                                                        <View style={{backgroundColor:placeholderTextColor,width:2,marginLeft:6, marginTop:Platform.OS==='android'?-7:-4
                                                        }}/>
                                                    )}
                                                    <FlatList
                                                        data={item.afterSaleProgressDetail?item.afterSaleProgressDetail:null}
                                                        keyExtractor={this._keyExtractor1}
                                                        renderItem={({item, index1}) =>
                                                            <View key={index1} style={{marginTop:10,marginLeft:index === statusData.length-1?30:15,}}>
                                                                <Text style={{color:content2TextColor,fontSize:14,marginRight:10}}>{item.content}</Text>
                                                            </View>
                                                        }
                                                    />
                                         </View>
                                                {index === statusData.length-1? null :(
                                                        <View style={{backgroundColor:placeholderTextColor,width:2,flexDirection:'row',marginLeft:6,height:20}}/>
                                                )}
                                            </View>
                                    </View>
                                }
                            />
                        </View>
                        <View style={styles.line}/>
                        <Text style={styles.titleText}>{'审核留言'}</Text>
                        <View style={styles.line}/>
                        <Text style={[styles.titleText,{marginRight:20,flexWrap:'wrap'}]}>{data.reviewMessage ? data.reviewMessage : '暂无'}</Text>
                        <View style={styles.line}/>
                        <Text style={styles.titleText}>{'问题描述'}</Text>
                        <View style={styles.line}/>
                        <Text style={styles.contentText}>{data.note}</Text>
                        <Text style={styles.contentText1}>{data.refundTime}</Text>
                        <View style={styles.line}/>
                        <Text style={styles.contentText}>{'申请人：        '+data.contactPerson}</Text>
                        <Text style={[styles.contentText1,{marginBottom:20}]}>{'手机号码：    '+data.phone}</Text>
                    </View>
                </ScrollView>
                <View>
                    {this.props.isShowLogistics?null:data.refundType==='ONLY_A_REFUND'?null:isShowButton === true?showView:null}
                </View>
                <LogisticsInformationDialog
                    ref={'LogisticsInformationDialog'} token={this.props.token} afterSaleId = {this.afterSaleId}/>

            </View>
        )
    }
}

/**
 * 头部
 */
class Head extends Component {

    render(){
        let data = this.props.data;
        return(
            <View>
                <View style={styles.orderInfo}>
                    <XImage uri={data.imgUrl} style={styles.orderImg}/>
                    <View style={{marginLeft: 10,justifyContent:'center'}}>
                        <View style={{flexDirection: 'row',flex:1}}>
                            <Text style={[styles.orderText,{flexWrap:'wrap',alignSelf:'center'}]}>{data.productName}</Text>
                        </View>
                        <Text style={[styles.orderTime,{alignSelf:'center',marginBottom:10}]}>{'下单时间:'+data.createTime}</Text>
                    </View>
                </View>
                <View style={{height:0.5,backgroundColor:placeholderTextColor,width:screenW-20, marginLeft:10}}/>
                <View style={{backgroundColor:'white'}}>
                    <View style={{marginTop:20, marginBottom:10,flexDirection:'row'}}>
                        <View style={{flexDirection:'row',flex:1.7, marginLeft:20}}>
                            <Text style={{fontSize:14,color:titleTextColor}}>{'申请时间:'}</Text>
                            <Text style={{marginLeft:10,fontSize:14,color:placeholderTextColor}}>{data.createTime}</Text>
                        </View>
                        <View style={{flexDirection:'row',flex:1}}>
                            <Text style={{fontSize:14,color:titleTextColor}}>{'申请数量:'+data.quantity}</Text>
                        </View>
                    </View>

                    <View style={{marginBottom:20,flexDirection:'row'}}>
                        <View style={{flexDirection:'row',flex:1.7, marginLeft:20}}>
                            <Text style={{fontSize:14,color:titleTextColor}}>{'售后单号:'}</Text>
                            <Text style={{marginLeft:10,fontSize:14,color:placeholderTextColor}}>{data.id}</Text>
                        </View>
                        <View style={{flexDirection:'row',flex:1}}>
                            <Text style={{fontSize:14,color:titleTextColor}}>{'退款金额:'+data.amount+'元'}</Text>
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
    rightBarImageStyle: {
        resizeMode: 'cover',
        width: 20,
        height: 20,
        position: 'relative',
    },
    orderInfo: {
        backgroundColor: 'white',
        paddingHorizontal: 25,
        paddingVertical: 15,
        flexDirection: 'row'
    },
    orderImg: {
        width: 80,
        height: 80,
        borderColor: placeholderTextColor,
        borderWidth: 0.5,
        borderRadius: 3
    },
    orderText: {
        color: titleTextColor,
        fontSize: 16,
        paddingRight: 5,
    },
    orderTime: {
        color: contentTextColor,
        fontSize: 14,
        marginTop: 2
    },

    middleView:{
        flex:1,
        marginHorizontal: 10,
        borderRadius:5,
        backgroundColor:'white',
        marginVertical: 10,
    },
    line:{
        backgroundColor:placeholderTextColor,
        marginLeft:20,
        width:screenW-60,
        height:0.5,
        marginTop:20,
    },
    titleText:{
        marginLeft:20,
        marginTop:15,
        color:titleTextColor
    },
    contentText:{
        marginLeft:20,
        color:content2TextColor,
        marginTop:15
    },
    contentText1:{
        marginLeft:20,
        color:content2TextColor,
        marginTop:10
    },

});

selector=(state)=>{
    return {
        token:state.loginStore.token,
    }
};

export default connect(selector)(AfterSaleDetails);
