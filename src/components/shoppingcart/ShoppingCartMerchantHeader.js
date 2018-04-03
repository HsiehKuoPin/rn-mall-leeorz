import React, {Component} from 'react';
import {
    Image,
    Text,
    View,
    StyleSheet, TouchableOpacity,
} from 'react-native';
import {
    mainBackgroundColor,
    titleTextColor,
} from '../../constraint/Colors';
import {ic_un_selected, ic_selected, ic_delete} from '../../constraint/Image'
import {connect} from "react-redux";
import {allSelectMerchantProduct} from "../../reducers/ShoppingCartReducer";

class ShoppingCartMerchantHeader extends Component {

    constructor(props) {
        super(props);
    }
    render() {
        let check = this.props.data.allCheck;

        return (
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                    this.props.dispatch(allSelectMerchantProduct(this.props.data.merchantId,!check));
                }}>
                <View style={styles.container}>
                    <View style={styles.storeLayout}>
                        <Image source={check ? ic_selected : ic_un_selected} style={styles.check}/>
                        <Text style={styles.storeName}>{this.props.data.merchantName}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: mainBackgroundColor,
        flex: 1,
    },

    storeLayout:{
        padding:9,
        flexDirection:'row',
        backgroundColor:'#F9F9F9',
    },
    storeName: {
        color: titleTextColor,
        fontSize: 15,
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
    check: {
        width: 15,
        height: 15,
        marginRight: 8,
        marginTop: 2,
        resizeMode: 'contain',
    },
});

selector = (state) => {
    return {
        token: state.loginStore.token,
    }
}
export default connect(selector)(ShoppingCartMerchantHeader);