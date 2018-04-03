import React, {Component} from 'react'
import {View, StyleSheet, Image, TouchableOpacity, Text, Dimensions, ImageBackground} from 'react-native';
import {connect} from "react-redux";
import TitleBar from "../../widgets/TitleBar";
import {goto} from "../../reducers/RouterReducer";
import LoadingView from "../../widgets/LoadingView";
import RequestErrorView from "../../widgets/RequestErrorView";
import {content2TextColor, mainColor, titleTextColor} from "../../constraint/Colors";
import {
    ic_merchants_flagship_normal, ic_merchants_flagship_selected,
    ic_merchants_maker_normal,
    ic_merchants_maker_selected,
    ic_merchants_settled, ic_merchants_settled_iphoneX, ic_merchants_settled_left, ic_merchants_settled_right,
} from "../../constraint/Image";
import Swiper from 'react-native-swiper';
import {getRequestFailTip, isSuccess, post} from "../../common/CommonRequest";
import {showToastShort} from "../../common/CommonToast";
import {formatMoney} from "../../common/StringUtil";
import BaseComponent from "../../widgets/BaseComponent";
import XImage from "../../widgets/XImage";
import {isIphoneX} from "react-native-iphone-x-helper";
import {isIPhone5} from "../../common/AppUtil";

const {width, height} = Dimensions.get('window');

class MerchantsSettled extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            isRequestError: false,
            isLoading: true,
            data: {},
            index: 0,
            isMakerSelected: true,
            dataShow:[],
        };
    }

    componentDidMount() {
        this._loadNPlusComboList();
    }

    _loadNPlusComboList() {
        post('order/company/companyInList',{token:this.props.token})
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    this.setState({
                        data: responseData.result,
                        dataShow:responseData.result.markers,
                        isLoading: false,
                        isRequestError: false,
                    });
                } else {
                    this._errorMsg(responseData);
                }
            }).catch((e) => {
            this._errorMsg(e);
        });
    }

    _errorMsg(msg) {
        this.setState({
            isLoading: false,
            isRequestError: true,
        });
        showToastShort(getRequestFailTip(msg));
    }

    render() {
        return (
            <ImageBackground
                resizeMode='stretch'
                source={{uri: isIphoneX() ? ic_merchants_settled_iphoneX : ic_merchants_settled}}
                style={{flex: 1}}>
                <TitleBar title={'开店赚钱'} customBarStyle={{backgroundColor: 'transparent'}} hideRight={false}
                          customRightView={() => (<Text style={{color: 'white'}}
                                                        onPress={() => {
                                                            this.props.dispatch(goto('FranchiseRecord'))
                                                        }}>服务费记录</Text>)}/>
                {
                    this.state.isLoading ? <LoadingView/> :
                        (!this.state.isRequestError ? (this.state.dataShow.length === 0 ? null : this.showView()) :
                            <RequestErrorView onPress={() => {
                                this.setState({isRequestError: false, isLoading: true});
                                this._loadNPlusComboList();
                            }}/>)
                }
            </ImageBackground>
        )
    }

    showView() {
        let itemData = this.state.dataShow[this.state.index];
        let tipContent = itemData.upgrade?(this.state.isMakerSelected?'升级创客店':'升级企业店'):'前往支付';
        return (
            <View style={styles.content}>
                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={this._selectMaker}>
                        <XImage style={{width: width * 0.25, marginRight: 20}}
                                source={this.state.isMakerSelected ? ic_merchants_maker_selected : ic_merchants_maker_normal}/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={this._selectFlagship}>
                        <XImage style={{width: width * 0.25}}
                                source={this.state.isMakerSelected ? ic_merchants_flagship_normal : ic_merchants_flagship_selected}/>
                    </TouchableOpacity>
                </View>

                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 15,
                    backgroundColor: '#00000000'
                }}>
                    <View style={styles.line}/>
                    <Text style={{fontSize: 18, color: titleTextColor, marginHorizontal: 10}}>{itemData.name}</Text>
                    <View style={styles.line}/>
                </View>

                <View style={{width: width - 2 * width * 0.08+20,}}>
                    <Swiper
                        key={this.state.isMakerSelected}
                        style={styles.priceContain}
                        showsPagination={false}
                        showsButtons={true}
                        loop={false}
                        autoplay={false}
                        onIndexChanged={index => this.setState({index})}
                        prevButton={<Image source={ic_merchants_settled_left} style={styles.imgNext}/>}
                        nextButton={<Image source={ic_merchants_settled_right} style={styles.imgNext}/>}>
                        {
                            this.state.dataShow.map((item, index) => {
                                    return <View key={index} style={styles.priceChild}>
                                        {
                                            item.accounts.map((itemChild, indexChild) => {
                                                return <View key={indexChild} style={{flexDirection: 'row', height: 35, alignItems: 'center'}}>
                                                    <Text numberOfLines={2} style={styles.priceText}>{itemChild.accountTypeLabel}</Text>
                                                    <Text numberOfLines={2} style={styles.priceTextR}>{itemChild.amountLabel}</Text>
                                                </View>
                                            })
                                        }
                                        <View style={styles.priceLine}/>
                                        {
                                            item.pays.map((itemChild, indexChild) => {
                                                return <View key={indexChild} style={{flexDirection: 'row', height: 35, alignItems: 'center'}}>
                                                    <Text numberOfLines={2} style={styles.priceText}>{itemChild.accountTypeLabel}</Text>
                                                    <Text numberOfLines={2} style={styles.priceTextR}>{itemChild.amountLabel}</Text>
                                                </View>
                                            })
                                        }
                                    </View>
                                }
                            )
                        }
                    </Swiper>
                    <TouchableOpacity
                        disabled={!itemData.canBuy}
                        style={[styles.touch,{backgroundColor: itemData.canBuy?mainColor:content2TextColor}]}
                        activeOpacity={0.7}
                        onPress={() => {
                            itemData={...itemData,isMakerSelected:true};
                            this.props.dispatch(goto('MerchantsPaymentDetail',itemData))}}>
                        <Text style={{color: '#fff', fontSize: 16}}>{tipContent}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    _selectMaker = () => {
        if (!this.state.isMakerSelected) {
            this.setState({
                isMakerSelected: !this.state.isMakerSelected,
                dataShow: this.state.data.markers,
                index: 0
            })
        }
    };
    _selectFlagship = () => {
        if (this.state.isMakerSelected) {
            this.setState({
                isMakerSelected: !this.state.isMakerSelected,
                dataShow: this.state.data.flagshipStores,
                index: 0
            })
        }
    };
}

const styles = StyleSheet.create({
    content: {
        marginTop: isIphoneX()? height * 0.38 + 24 : (height * 0.38-20),
        marginHorizontal: width * 0.08-10,
        width: width - 2 * width * 0.08+20,
        position: 'absolute',
        alignItems: 'center'
    },
    line: {
        height: 5,
        width: 15,
        backgroundColor: '#F9D5B3',
        borderRadius: 5,
    },
    priceContain: {
        // width: width - 2 * width * 0.08,
        height: isIPhone5() ? 10 * 2 + 35 * 4 :10 * 2 + 35 * 4 + 20.5,
    },
    priceChild: {
        minWidth: width - 2 * width * 0.08 - 16 * 2 - 40,
        maxWidth:width - 2 * width * 0.08,
        flex:1,
        backgroundColor: '#F9D5B3',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 10,
        alignSelf: 'center',
        justifyContent:'center'
    },
    priceText: {
        width: (width - 2 * width * 0.08 - 16 * 2 - 40 - 20 * 2) * 0.5,
        color: titleTextColor,
        fontSize: isIPhone5() ? 12 : 14,
        padding: 0,
    },
    priceTextR: {
        color: titleTextColor,
        maxWidth:width*0.5,
        fontSize: isIPhone5() ? 12 : 14,
        padding: 0,
    },
    priceLine: {
        height: 0.5,
        maxHeight: 0.5,
        backgroundColor: '#583316',
        marginVertical: 10,
    },
    imgNext: {
        width: 16,
        height: 41,
        resizeMode: 'contain',
    },
    touch: {
        width: width - 2 * width * 0.08 - 16 * 2 - 40,
        borderRadius: 8,
        borderBottomRightRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        height: 35,
        marginTop: 20,
        alignSelf: 'center'
    },
});
selector = (state) => {
    return {
        token: state.loginStore.token,
    }
};

export default connect(selector)(MerchantsSettled);