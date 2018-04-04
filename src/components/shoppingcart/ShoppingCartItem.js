import React, {Component} from 'react';
import {
    Image,
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import {
    mainColor,
    placeholderTextColor,
    mainBackgroundColor,
    titleTextColor,
    contentTextColor,
} from '../../constraint/Colors';
import {ic_un_selected, ic_selected,} from '../../constraint/Image'
import StepperView from './StepperView';
import {
    selectShoppingCartProduct, addShoppingCartProduct, minusShoppingCartProduct, removeShoppingCartProduct
} from "../../reducers/ShoppingCartReducer";
import {connect} from "react-redux";
import {post, isSuccess} from '../../common/CommonRequest';
import {showToastShort} from "../../common/CommonToast";
import XImage from '../../widgets/XImage';
import {formatMoney} from "../../common/StringUtil";
import CheckBox from "../../widgets/checkbox/CheckBox";

class ShoppingCartItem extends Component {

    constructor(props) {
        super(props);
        this.state = {check:this.props.data.check}
    }

    _updateCount(type, item) {
        let requestObj = {
            token: this.props.token,
            skuId: item.id,
            quantity: (type === 'plus') ? item.quantity + 1 : item.quantity - 1
        };
        let url = 'product/shoppingCart/updateShoppingCart';
        if (type === 'plus') {
            if (item.quantity <= item.stock) {
                post(url, requestObj)
                    .then((responseData) => {
                        if (isSuccess(responseData)) {
                            this.props.dispatch(addShoppingCartProduct(item.id));
                        } else {
                            showToastShort(responseData.message)
                        }
                    })
            }
        } else {
            if (item.quantity > 1) {
                post(url, requestObj)
                    .then((responseData) => {
                        if (isSuccess(responseData)) {
                            this.props.dispatch(minusShoppingCartProduct(item.id));
                        } else {
                            showToastShort(responseData.message)
                        }
                    })
            }
        }
    }  //数量加减

    _delete() {
        let requestObj = {
            token: this.props.token,
            skuId: this.props.data.skuId,
        };
        post('product/shoppingCart/removeShoppingCart', requestObj)
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    this.props.dispatch(removeShoppingCartProduct(this.props.data.skuId));
                } else {
                    showToastShort(responseData.message)
                }
            })
    }

    _selectProduct(item) {
        this.props.dispatch(selectShoppingCartProduct(item.id))
    };

    _getSpecStr(specPropertyValues){
        let spec = '';
        specPropertyValues.map(item=>{spec += item + ' '});
        return spec;

    }

    getShoppingCartItem(item) {
        let check = item.check;
        return <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
                if(this.props.selectProduct){
                    this.props.selectProduct(item.id);
                }
            }}>
        <View style={[styles.itemContain,{paddingBottom:this.props.isLast?15:0}]}>

                <CheckBox isCheck={check} style={[{marginLeft: 5,}]}/>

            <XImage style={styles.itemImg} uri={item.imgUrl}/>
            <View style={{flex: 1, flexDirection:'column',height: 80,}}>

                <Text numberOfLines={2} style={styles.productName}>{item.productName}</Text>
                <Text style={styles.spec} numberOfLines={2}>{this._getSpecStr(item.specPropertyValues)}</Text>
                <View style={{flex:1}}/>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={styles.price}>{formatMoney(item.salePrice)}</Text>
                    <StepperView max={item.stock}
                                 count={item.quantity}
                                 updateCount={({action}) => {
                                     this._updateCount(action, item)
                                 }}/>
                </View>
            </View>
        </View>
        </TouchableOpacity>


    }

    render() {
        return (
            <View style={[styles.container,{marginBottom:this.props.isLast?8:0}]}>

                {this.getShoppingCartItem(this.props.data)}

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
    },
    contentContainer: {
        backgroundColor: 'white',
    },
    storeLayout: {
        padding: 9,
        flexDirection: 'row',
        backgroundColor: '#F9F9F9',
    },
    storeName: {
        color: titleTextColor,
        fontSize: 15,

    },
    productName: {
        color: titleTextColor,
        fontSize: 14,
    },
    line: {
        backgroundColor: placeholderTextColor,
        height: 0.5,
        flex: 1,
        marginTop: 10,
        marginBottom: 10
    },
    itemContain: {
        // paddingBottom: 15,
        paddingTop: 15,
        paddingHorizontal: 5,
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
    },
    itemImg: {
        width: 80,
        height: 80,
        marginLeft: 5,
        borderWidth: 0.3,
        borderColor: placeholderTextColor,
        marginRight: 10,
    },
    spec: {
        color: contentTextColor,
        fontSize: 12,
        marginTop: 3,
    },
    price: {
        color: mainColor,
        fontSize: 14,
        marginTop: 3,
        flex: 1,
    },
    icon: {
        width: 31,
        height: 31,
        resizeMode: 'contain',
    },
    countContainer: {
        height: 31,
        paddingLeft: 12,
        paddingRight: 12,
        backgroundColor: mainBackgroundColor,
        marginRight: 10,
        marginLeft: 10,
        justifyContent: 'center',
    },
    selectCount: {
        fontSize: 16,
        color: titleTextColor,

    },
    checkItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    }
});

selector = (state) => {
    return {
        token: state.loginStore.token,
    }
};

export default connect(selector)(ShoppingCartItem);