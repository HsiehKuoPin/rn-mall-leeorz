/**
 * Created by lan on 2017/11/15.
 */
import React, {Component} from 'react';
import {
    Image,
    View,
    Dimensions,
    TouchableOpacity,
    FlatList,
    Text,
    StyleSheet,
} from "react-native";

import {
    titleTextColor,
    placeholderTextColor,
    content2TextColor,
} from "../../../constraint/Colors";
import {
    ic_right_arrows
} from "../../../constraint/Image";
import {connect} from "react-redux";
import OrderItemBottom from '../service/OrderItemBottom'
import {goto} from "../../../reducers/RouterReducer";
import XImage from '../../../widgets/XImage';
import {isTrue} from "../../../common/AppUtil";

const screenW = Dimensions.get('window').width;
/**
 *  售后列表
 */
class OrderItem extends Component {
    constructor(props){
        super(props);
    }

    render() {
        let data = this.props.data;
        let isApplyDetailList = this.props.isApplyDetailList;

        let contentView;
        if (isApplyDetailList === true){
            if(data.orderItems.length > 1){
                contentView = <MultiProductView data={data.orderItems} isApplyDetailList = {true} dispatch={this.props.dispatch}/>
            }else if(data.orderItems.length === 1){
                contentView = <SingleProductView data={data.orderItems[0]} isApplyDetailList = {true} dispatch={this.props.dispatch}/>
            }
        }else
        {
             contentView = <SingleProductView data={data} isApplyDetailList={false} dispatch={this.props.dispatch}/>
        }

        return (
            <View >
                {contentView}
            </View>
        )
    }
}

/**
 * 多个商品
 */
class MultiProductView extends Component{
    constructor(props){
        super(props);
    }

    _keyExtractor = (item, index) => item.orderId;
    _renderItem(item,isApplyDetailList){

        return (<View style={{width:screenW}}>
            <Item data={item} isApplyDetailList={isApplyDetailList} dispatch={this.props.dispatch}/>
        </View>);
    }

    render(){
        let data = this.props.data;
        let isApplyDetailList = this.props.isApplyDetailList;

        let showView=(
                <View style={{justifyContent:'space-between',flexDirection: "row",alignItems:'center'}}>
                    <Text style={styles.orderStoreName} numberOfLines={1}>{'售后单号：'+data[0].orderId}</Text>
                    <Text style={styles.orderStatusTip}>{isApplyDetailList?null:refundState[data[0].refundType]}</Text>
                </View>
            );

        return (
            <View style={styles.cellStyle}>
                {showView}
                {
                    data.map((item, index)  =>{
                      if(isTrue(item.supportAfterSale)){
                          return (
                              <View key={index}>
                                  <TouchableOpacity activeOpacity={1}
                                                    onPress={()=>isApplyDetailList?null:this.props.dispatch(goto('AfterSaleDetails',{afterSaleId:data.id}))}>

                                      <View style={styles.line}/>
                                      <View style={{flexDirection:'row',paddingVertical:10,paddingLeft:10,marginBottom:10, paddingRight: 5}} >

                                          <View style={styles.productImageLayout}>
                                              <XImage uri={data.imgUrl} style={styles.productImage}/>
                                          </View>
                                          <View style={{flexDirection:'row',flex:1,alignItems:'center',justifyContent:'center'}}>
                                              <View style={{marginLeft:10,flex:1}}>
                                                  <Text style={styles.singleProductName} numberOfLines={1}>{item.productName}</Text>
                                                  <View style={{flex:1}}>
                                                      <Text numberOfLines={1} style={styles.singleProductSku}>{'下单时间 : '+ item.createTime}</Text>
                                                  </View>
                                                  <View style={{flexDirection:'row',justifyContent:'center',}}>
                                                      <Text style={{fontSize:15,color:content2TextColor,flex:1}} numberOfLines={1}>{'数量 : '+item.quantity}</Text>
                                                  </View>
                                              </View>
                                          </View>
                                      </View>
                                      <OrderItemBottom supportAfterSale={item.supportAfterSale} data={item}/>
                                  </TouchableOpacity>
                              </View>
                          )
                      }
                    })
                }
            </View>
        )
    }
}

/**
 * 单个商品
 */
class SingleProductView extends Component{
    constructor(props){
        super(props);
    }

    render(){
        let {data} = this.props;
        let isApplyDetailList = this.props.isApplyDetailList;

        return (
            <View>
                <Item data={data} isApplyDetailList={isApplyDetailList} dispatch={this.props.dispatch}/>
            </View>
        );
    }
}

/**
 * 中间的Item
 */
class Item extends Component{
    render(){
        let {data} = this.props;
        let isApplyDetailList = this.props.isApplyDetailList;

        let refundState ={'REFUNDS':'退货退款','ONLY_A_REFUND':'仅退款',};
        let rightImage=( <Image source={ic_right_arrows} style={styles.rightArrowsStyle}/> );

        let  showView=(
                <View style={{justifyContent:'space-between',flexDirection: "row",alignItems:'center'}}>
                    <Text style={styles.orderStoreName} numberOfLines={1}>{isApplyDetailList?'订单号：'+data.orderId:'售后单号: '+data.id}</Text>
                    <Text style={styles.orderStatusTip}>{isApplyDetailList?null:refundState[data.refundType]}</Text>
                </View>
            );

        return (
            <View style={styles.cellStyle}>
                <TouchableOpacity activeOpacity={isApplyDetailList?1:0.7}
                                  onPress={()=>isApplyDetailList?null:this.props.dispatch(goto('AfterSaleDetails',{afterSaleId:data.id}))}>
                    {showView}
                    <View style={styles.line}/>
                    <View style={{flexDirection:'row',paddingVertical:10,paddingLeft:10,marginBottom:10, paddingRight: 5}} >

                        <View style={styles.productImageLayout}>
                            <XImage uri={data.imgUrl} style={styles.productImage}/>
                        </View>
                        <View style={{flexDirection:'row',flex:1,alignItems:'center',justifyContent:'center'}}>
                            <View style={{marginLeft:10,flex:1}}>
                                <Text style={styles.singleProductName} numberOfLines={1}>{data.productName}</Text>
                                <View style={{flex:1}}>
                                    <Text numberOfLines={1} style={styles.singleProductSku}>{'下单时间 : '+ data.createTime}</Text>
                                </View>
                                <View style={{flexDirection:'row',justifyContent:'center',}}>
                                    <Text style={{fontSize:15,color:content2TextColor,flex:1}} numberOfLines={1}>{'数量 : '+data.quantity}</Text>
                                </View>
                            </View>
                            {isApplyDetailList?null:rightImage}
                        </View>
                    </View>
                    <OrderItemBottom supportAfterSale={data.supportAfterSale} data={data}/>
                </TouchableOpacity>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    line:{
        backgroundColor:placeholderTextColor,
        height:0.5,
        marginHorizontal:10,
        marginBottom: 10,
    },
    cellStyle:{
        marginTop:5,
        marginBottom:5,
        flex: 1,
        marginHorizontal: 10,
        backgroundColor:'white',
        borderRadius:5,
        shadowColor: 'gray',
        shadowOffset: {height: 2, width: 2},
        shadowRadius: 3,
        shadowOpacity: 0.2,
        elevation: 2
    },
    rightArrowsStyle:{
        width:15,
        height:15,
        resizeMode: 'contain',
        marginRight:10,
        padding:5,
    },

    singleProductSku:{
        fontSize:15,
        color:content2TextColor,
    },
    singleProductName:{
        fontSize:16,
        color:titleTextColor,
        flex:1
    },
    productImageLayout: {
        borderRadius: 3,
        borderWidth: 0.5,
        borderColor: placeholderTextColor,
        marginLeft: 10,
        width: (screenW - 26) / 4.5,
        height: (screenW - 26) / 4.5,
    },
    productImage:{
        borderRadius: 3,
        width: (screenW - 30) / 4.5,
        height: (screenW - 30) / 4.5,
        resizeMode: 'cover'
    },
    orderStoreName:{
        backgroundColor:'#00000000',
        color:'#181818',
        fontSize:14,
        paddingHorizontal:10,
        paddingVertical:12,
        flex: 1,
},
    orderStatusTip: {
        backgroundColor:'#00000000',
        fontSize: 14,
        color: titleTextColor,
        paddingHorizontal: 10,
        paddingVertical: 10
    }
});

export default connect()(OrderItem);