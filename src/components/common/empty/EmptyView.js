import React, {Component} from 'react';
import {
    Image,
    Text,
    View,
    StyleSheet,
    ScrollView,
    Dimensions,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import {content2TextColor, mainColor, priceColor, titleTextColor} from '../../../constraint/Colors';
import {ic_empty_car, ic_your_recommend} from '../../../constraint/Image'
import {getRequestFailTip, isSuccess, post} from "../../../common/CommonRequest";
import connect from "react-redux/es/connect/connect";
import {saveRecommendProduct} from "../../../reducers/ProductReducer";
import {showToastShort} from "../../../common/CommonToast";
import XImage from "../../../widgets/XImage";
import {gotoDetail} from "../../../common/ProductUtil";
import {formatMoney} from "../../../common/StringUtil";
import {getMiddle} from "../../../common/PhotoUtil";
import {ic_recommend} from "../../../../resources/index";

const screenW = Dimensions.get('window').width;
const width = (screenW - 30) / 2;

class EmptyView extends Component {
    constructor(props) {
        super(props);

        this.emptyImage = ic_empty_car;
    }

    static defaultProps = {
        isShowEmptyView:true,
        emptyTip: '空空如也',
        showRecommended:true,
    };

    componentDidMount() {
        // product/recommended
        let {updateTime, dispatch} = this.props;
        if ((new Date().valueOf() - updateTime) < ( 24 * 60 * 60)) return;//无需更新推荐数据
        post('product/recommended', {pageNo: 1, pageSize: 4,})
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    dispatch(saveRecommendProduct(responseData.result.data, new Date().valueOf()));
                } else {
                    showToastShort(getRequestFailTip(responseData));
                }
            }).catch((e) => {
            console.warn(e.message);
            showToastShort(getRequestFailTip());
        })
    }

    _renderRecommended(productList){

        return <FlatList
            ListHeaderComponent={()=><Image style={{width: screenW, height: 30, marginTop: 10, marginBottom: 10}}
                                            source={ic_recommend}
                                            resizeMode="contain"/>}
            showsHorizontalScrollIndicator={false}
            data={productList}
            numColumns={2}
            keyExtractor={(item, index) => index}
            renderItem={({item, index}) =>
                <TouchableOpacity
                    key={index}
                    style={styles.container}
                    activeOpacity={0.7}//点击时的透明度
                    onPress={() => {gotoDetail(item,this.props.dispatch)}}>
                    {/*onPress={() => this.props.dispatch(goto('ProductDetail', item.id))}>*/}
                    <XImage uri={getMiddle(item.path)}
                            style={{
                                width: width,
                                height: width,
                                borderTopLeftRadius: 5,
                                borderTopRightRadius: 5,
                            }}/>
                    <Text style={styles.itemText} numberOfLines={2}>{item.name}</Text>
                    <View style={{flex: 1}}/>
                    <Text style={styles.priceText} numberOfLines={1}>{formatMoney(item.salePrice)}</Text>
                </TouchableOpacity>
            }
        />;
    }

    _getEmptyView(){
        if(this.props.isShowEmptyView){
            return <View style={styles.emptyViewStyle}>
                <Image source={this.emptyImage} style={{width: screenW, height: 120, resizeMode: 'contain'}}/>
                <Text style={styles.emptyText}>{this.props.emptyTip}</Text>
            </View>
        }
        return null;
    }

    render() {
        return <ScrollView>
                    {this._getEmptyView()}
                    {this.props.showRecommended?this._renderRecommended(this.props.productList):null}
                </ScrollView>
    }
}

const styles = StyleSheet.create({
    emptyViewStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        backgroundColor: 'white',
        height: 300,
        width: screenW - 20,
        marginHorizontal: 10,
        borderRadius: 5
    },
    emptyText: {
        marginTop: 15,
        color: content2TextColor,
        textAlign: 'center',
        fontSize: 14,
    },
    container: {
        width: width,
        backgroundColor: 'white',
        marginLeft: 10,
        marginBottom: 10,
        borderRadius: 5,
        overflow: 'hidden'
    },
    itemText: {
        color: titleTextColor,
        marginRight: 10,
        marginLeft: 10,
        textAlign: 'left',
        marginTop: 10,
        fontSize: 15,
    },
    priceText: {
        color: priceColor,
        marginTop: 10,
        marginBottom: 8,
        marginRight: 10,
        marginLeft: 5,
        textAlign: 'right',
        fontSize: 15,
    },
});

selector = (state) => {
    return {
        productList: state.productStore.recommendProductList,
        updateTime: state.productStore.recommendUpdateTime,
    }
};
export default connect(selector)(EmptyView);