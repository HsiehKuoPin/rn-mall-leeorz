import React, {Component} from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import {
    mainColor, titleTextColor,
    content2TextColor, placeholderTextColor, priceColor
} from '../../constraint/Colors';
import {connect} from 'react-redux';
import {formatMoney} from "../../common/StringUtil";
import TipDialog from "../../widgets/dialog/TipDialog";


class BottomView extends Component {
    constructor(props){
        super(props);
        this.state = {
            isDeleteMode:false,
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({isDeleteMode:nextProps.isDeleteMode})
    }

    render() {
        let totalCount = 0;
        let totalPrice = 0;
        let checkCount = 0;
        this.props.shoppingCart.map((item) => {
                if (item.check) {
                    totalCount += Number(item.quantity);
                    totalPrice += Number(item.quantity * item.productSkuVo.salePrice);
                    ++checkCount;
                }
            });
        let backgroundColor = (checkCount === 0) ? 'gray' : mainColor;
        return (
            <View style={styles.container}>
                <View style={{justifyContent: 'center', backgroundColor: 'white', flex: 1, paddingLeft: 10}}>
                    <Text style={{color: titleTextColor, fontSize: 17}}>合计:
                        <Text style={{color: priceColor, fontSize: 17}}>{formatMoney(totalPrice)}</Text>
                    </Text>
                    <Text style={{color: content2TextColor, fontSize: 14, marginTop: 2}}>共{totalCount}个商品</Text>
                </View>
                <TouchableOpacity style={[styles.settlement, {backgroundColor: backgroundColor}]}
                                  activeOpacity={0.7}//点击时的透明度
                                  onPress={()=>{
                                      if(this.state.isDeleteMode){
                                          this.refs.TipDialog.showDialog()

                                      }else{
                                          if(this.props.onClickSettlementBtn){
                                              this.props.onClickSettlementBtn()
                                          }
                                      }

                                  }} disabled={(checkCount === 0)}>
                    <Text style={{color: 'white', fontSize: 18}}>{this.state.isDeleteMode?'确定删除':'立即结算'}</Text>
                </TouchableOpacity>
                <View>
                    <TipDialog ref={'TipDialog'}
                               dialogMessage={'确定删除所选中的商品吗?'}
                               onClickConfirm={()=>{
                                   if(this.props.onClickDeleteBtn){
                                       this.props.onClickDeleteBtn()
                                   }
                               }}/>
                </View>

            </View>
        )
    }
}

selector = (state) => {
    return {
        shoppingCart: state.shoppingCartStore.shoppingCart,
    }
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        height: 55,
        flexDirection: 'row',
        // paddingLeft: 15,
        borderTopWidth: 0.5,
        borderTopColor: placeholderTextColor,
    },
    settlement: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    }

});

export default connect(selector)(BottomView);