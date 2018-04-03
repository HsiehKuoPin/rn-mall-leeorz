import React, {Component} from 'react';
import {
    Modal,
    View,
    StyleSheet,
    TouchableWithoutFeedback,
    Dimensions, Text, FlatList, TouchableOpacity, Image
} from 'react-native';
import {
    content2TextColor, contentTextColor, mainBackgroundColor, mainColor, placeholderTextColor,
    titleTextColor
} from "../../constraint/Colors";
import {ic_selected, ic_un_selected} from "../../constraint/Image";

const {width, height} = Dimensions.get('window');


export default class SettlementDialog extends Component {
    constructor(props){
        super(props);
        this.state = {
            data:[],
            visible:false,
        };

        this.selectMerchantId = '';
    }

    show(data){
        let result = [];
        data.map((item,index)=>{
            // console.warn(JSON.stringify(item));
            let count = 0;
            let isCheck = false;
            item.data.map(productItem=>{

                // console.log('productItem.quantity',productItem);

                if(productItem.check){
                    count += productItem.quantity;
                    console.log(count);
                    isCheck = true;
                }
            });
            if(isCheck){
                result.push(item);
            }
            Object.assign(item,{checkCount:count,check:index===0})
            if(item.check){
                this.selectMerchantId =  item.merchant.merchantId;
            }

        });
        this.setState({data:result,visible:true,});
    }

    dismiss(){
        this.setState({visible:false,});
    }

    selectOne(merchantId){
        let data = [];
        this.state.data.map(item=>{
            item.check = item.merchant.merchantId === merchantId;
            data.push(item);
            if(item.check){
                this.selectMerchantId =  item.merchant.merchantId;
            }
        });

        this.setState({data:data});
    }

    _getMerchantItem(item){
        let check = item.check;
        return <TouchableOpacity activeOpacity={0.7}
                                 onPress={() => {
                                     this.selectOne(item.merchant.merchantId)
                                 }}>
            <View style={{marginBottom: 10}}>
                <View style={{flexDirection: 'row', flex: 1, width: width * 0.7, paddingHorizontal: 10,}}>

                    <Image source={check ? ic_selected : ic_un_selected} style={[styles.check, {marginLeft: 5,}]}/>
                    <Text style={{flex: 1, color: titleTextColor}} numberOfLines={1}>{item.merchant.merchantName}</Text>
                </View>
                <Text style={{flex: 1, marginLeft: 50, color: content2TextColor}}
                      numberOfLines={1}>{item.checkCount}件</Text>
            </View>
        </TouchableOpacity>
    }

    render() {
        return (
            <Modal
                animationType={"fade"}
                transparent={true}
                onRequestClose={() => {}}
                visible={this.state.visible}
            >
                <TouchableWithoutFeedback
                    onPress={()=>this.dismiss()}>
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: 'rgba(0,0,0,.5)',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <TouchableWithoutFeedback>
                            <View style={{
                                justifyContent: 'center',
                                alignItems: 'center',

                                // padding: 10,
                                // width: '50%',
                                width: width * 0.7,
                                backgroundColor: 'white',
                                borderRadius: 5,
                            }}>
                                <Text style={{marginVertical:15,fontSize:15,color: titleTextColor}}>请分开结算以下商品</Text>
                                <FlatList
                                    data={this.state.data}
                                    keyExtractor={(item,index)=>index}
                                    renderItem={({item,index}) => this._getMerchantItem(item)}>

                                </FlatList>
                                <View style={styles.line}/>
                                <View style={{flexDirection: 'row'}}>
                                    <TouchableOpacity style={styles.bottomBtn} activeOpacity={0.7}
                                            onPress={()=>{this.dismiss()}}>
                                        <Text style={styles.textStyle}>取消</Text>
                                    </TouchableOpacity>
                                    <View style={styles.hline}/>
                                    <TouchableOpacity style={styles.bottomBtn} activeOpacity={0.7}
                                              onPress={()=>{
                                                  if(this.props.onClickSettlementBtn){
                                                      this.props.onClickSettlementBtn(this.selectMerchantId)
                                                  }
                                                  this.dismiss()
                                              }}>
                                        <Text style={{color: mainColor}}>去结算</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({

    line: {
        backgroundColor: placeholderTextColor,
        width:width*0.7,
        height: 0.5,
        // flex: 1,
        // marginTop: 10,
        // marginBottom: 10
    },
    hline: {
        backgroundColor: placeholderTextColor,
        width:0.5,
        height: 35,
        // flex: 1,
        // marginTop: 10,
        // marginBottom: 10
    },
    bottomBtn:{
        flex:1,
        height:40,
        alignItems:'center',
        justifyContent:'center',
    },
    check: {
        width: 15,
        height: 15,
        marginRight: 5,
        marginTop: 2,
        resizeMode: 'contain',
    },
    textStyle: {
        color: contentTextColor,
        fontSize: 14,
    },
});