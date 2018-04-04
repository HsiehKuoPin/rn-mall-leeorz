import React, {Component} from 'react'
import {View, FlatList, StyleSheet, TouchableOpacity, Text, Dimensions, ScrollView} from 'react-native'
import { mainBackgroundColor, mainColor, titleTextColor} from "../../constraint/Colors";
import {getRequestFailTip,  isSuccess, post} from "../../common/CommonRequest";
import connect from "react-redux/es/connect/connect";
import SearchView from "./search/SearchTitleBar";
import LoadingView from "../../widgets/LoadingView";
import RequestErrorView from "../../widgets/RequestErrorView";
import {showToastShort} from "../../common/CommonToast";
import {goto} from "../../reducers/RouterReducer";
import XImage from "../../widgets/XImage";
import {getSmall, getThumb} from "../../common/PhotoUtil";
import TitleBar from "../../widgets/TitleBar";

const {width, height} = Dimensions.get('window');

class ProductCategory extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isRequestError: false,
            productCategoryData: [],
            productListData: [],
            selectIndex: 0,
        }
    }

    componentDidMount() {
        this._loadProductCategory();
    }

    _loadProductCategory() {
        post('product/listCategory', {'parentId': '0'})
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    this._loadProductList(responseData.result[0].id);
                    this.setState({
                        productCategoryData: responseData.result,
                        isLoading: false,
                        isRequestError: false,
                    });
                } else {
                    this._errorMsg(responseData);
                }
            }).catch((e) => {
            this._errorMsg();
            console.warn(e.message);
        });
    }

    _errorMsg(msg) {
        this.setState({
            isLoading: false,
            isRequestError: true,
        });
        if (msg) {
            showToastShort(getRequestFailTip(msg));
        } else {
            showToastShort(getRequestFailTip())
        }

    }

    _loadProductList(parentId) {
        post('product/listCategory', {'parentId': parentId})
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    this.setState({productListData: responseData.result,});
                } else {
                    showToastShort(getRequestFailTip(responseData));
                }
            }).catch((e) => {
            showToastShort(getRequestFailTip());
            console.warn(e.message);
        });
    }

    render() {
        let imgUrl = "";
        if (!this.state.isLoading && !this.state.isRequestError)
            imgUrl = this.state.productCategoryData[this.state.selectIndex].imgUrl;
        let showView = this.state.isRequestError ? (
            <RequestErrorView onPress={() => {
                this.setState({isRequestError: false, isLoading: true,});
                this._loadProductCategory();
            }}/>
        ) : (
            <View style={{flex: 1, flexDirection: 'row'}}>
                <View style={styles.left}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={this.state.productCategoryData}
                        extraData={this.state.selectIndex}
                        keyExtractor={(item, index) => index}
                        renderItem={({item, index}) =>
                            <View style={{
                                flexDirection: 'row',
                                // backgroundColor: this.state.selectIndex === index ? mainColor : "#FFFFFF"
                                backgroundColor: 'white'
                            }}>
                                <View style={{
                                    backgroundColor: this.state.selectIndex === index ? mainColor : "#FFFFFF",
                                    minHeight: 30,
                                    width: 1,
                                    borderLeftColor: this.state.selectIndex === index ? mainColor : '#00000000',
                                    borderLeftWidth: this.state.selectIndex === index ? 3 : 0
                                }}/>
                                <TouchableOpacity
                                    style={styles.leftTouch}
                                    onPress={() => {
                                        if (this.state.selectIndex !== index) {
                                            this.setState({selectIndex: index});
                                            this._loadProductList(item.id);
                                        }
                                    }}
                                    activeOpacity={1}>
                                    <Text style={{
                                        color: (this.state.selectIndex === index ? mainColor : 'black'),
                                        marginLeft: this.state.selectIndex === index ? -3 : 0
                                    }}>{item.name}</Text>
                                </TouchableOpacity>
                            </View>
                        }
                    />
                </View>
                <ScrollView style={{flex: 1}}>
                    <XImage uri={imgUrl} style={{height: (width - 92) / 3}}/>
                    <View style={styles.rightView}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={this.state.productListData}
                        keyExtractor={(item, index) => index}
                        numColumns={3}
                        renderItem={({item, index}) =>
                            <TouchableOpacity
                                key={index}
                                style={{
                                    width: (width - 170) / 3,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    margin: 10
                                }}
                                activeOpacity={1}//点击时的透明度
                                onPress={
                                    () => this.props.dispatch(goto('ProductList', {id: {categoryId:item.id}}))}
                            >
                                <XImage uri={getSmall(item.imgUrl)}
                                        style={{width: (width - 180) / 3, height: (width - 180) / 3}}/>
                                <Text style={{fontSize:12,marginTop: 5,color:titleTextColor}} numberOfLines={1}>{item.name}</Text>
                            </TouchableOpacity>
                        }
                    />
                    </View>
                </ScrollView>
            </View>);
        return (
            <View style={styles.container}>
                <TitleBar onlyTitle={true} title={'商品'}/>
                {this.state.isLoading ? <LoadingView/> : showView}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: mainBackgroundColor,
    },
    left: {
        width: 90,
        backgroundColor: '#fff',
        marginRight:2,
    },
    leftTouch: {
        width: 90,
        minHeight: 45,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightView: {
        // margin: 10,
        backgroundColor: '#fff',
        // shadowColor: 'gray',
        // shadowOffset: {height: 2, width: 2},
        // shadowRadius: 2,
        // shadowOpacity: 0.2,
        // borderRadius: 2,
        // elevation: 2,
    },
});

export default connect()(ProductCategory);