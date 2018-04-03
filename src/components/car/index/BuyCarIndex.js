import React, {Component} from 'react';
import {View, Image, StyleSheet, Text, DeviceEventEmitter} from 'react-native';

import TitleBar from '../../../widgets/TitleBar';
import LFlatList from '../../../widgets/LFlatList';
import {connect} from 'react-redux';
import {goto} from '../../../reducers/RouterReducer';
import RequestErrorView from '../../../widgets/RequestErrorView';
import {showToastShort} from "../../../common/CommonToast";
import ProductList from "./ProductListView";
import CarStatusList from "./CarStatusListView";
import Carousel from "../../../widgets/Carousel";
import OrderDynamic from "./OrderCarDynamicView";
import {mainBackgroundColor} from "../../../constraint/Colors";
import {post, isSuccess, getRequestFailTip} from "../../../common/CommonRequest";
import XImage from "../../../widgets/XImage";
import {ic_buyCar_record} from "../../../constraint/Image";
import RecommendDialog from "../../home/module/RecommendDialog";
import {saveSingleOtherConfig} from "../../../reducers/LoginReducer";
import LoadingView from "../../../widgets/LoadingView";
import BaseComponent from "../../../widgets/BaseComponent";

//买车首页
class BuyCarIndex extends BaseComponent {

    constructor(props) {
        super(props);

        this.defaultCarBrandId = 0;
        this.state = {
            isLoadingHeaderData: true,
            isRequestError: false,
            isLoadMore: false,
            carStatus: '',
            headerViewData: {carBanner: [], carOrderList: [], carBrandsList: []},
            rowData: [],
        };
    }

    _getReferrer(text) {    //获取推荐人用户名
        post('user/getRecommend', {'recommend': text}, true)
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    this.setState({referrer: responseData.result.loginName})
                } else if (this.checkUserTokenValid({response: responseData}, false)) {
                    showToastShort(getRequestFailTip(responseData));
                    this.setState({referrer: ''})
                }
            }).catch((e) => {
            showToastShort(e.message);
            this.setState({referrer: ''})
        });
    }

    _bindRecommend() {  //会员绑定推荐人
        let requestObj = {'recommend': this.state.referrer, 'token': this.props.token};
        post('user/bindRecommend', requestObj, true)
            .then((responseData) => {
                this.refs.RecommendDialog.dismiss();
                if (isSuccess(responseData)) {
                    showToastShort("绑定成功");
                    this.props.dispatch(saveSingleOtherConfig('isHasRecommend', 'Y'));
                } else if (this.checkUserTokenValid({response: responseData}, false)) {
                    showToastShort(getRequestFailTip(responseData));
                }
            }).catch((e) => {
            this.refs.RecommendDialog.dismiss();
            showToastShort(e.message);
        });
    }

    render() {
        let {token, dispatch} = this.props;
        var showView = this.state.isRequestError ? (
            <RequestErrorView onPress={() => {
                this.setState({isRequestError: false, isLoadingHeaderData: true,})
                this._getCarIndexData();
            }}/>
        ) : (

            <View style={styles.container}>
                <LFlatList
                    ListHeaderComponent={<HeaderView data={this.state.headerViewData}
                                                     onBrandPress={(id) => this._resetCarList(id)}/>}
                    ref={'LFlatList'}
                    renderItem={({item, index}) => <ProductList data={item} key={index}/>}
                    onLoadMore={this._onLoadMore.bind(this)}
                    onRefreshing={this._onRefresh.bind(this)}
                    firstLoader={false} // display a loader for the first fetching
                    pagination={true} // enable infinite scrolling using touch to load more
                    refreshable={true} // enable pull-to-refresh for iOS and touch-to-refresh for Android
                    withSections={false} // enable sections
                    isMounted={false}
                    emptyView={() => null}
                    isShowFirstLoadView={true}
                    enableEmptySections={true}
                />
            </View>
        );
        return (
            <View style={styles.container}>
                <TitleBar title={'名车馆'}
                          hideRight={false}
                          customRightView={() => (<XImage source={ic_buyCar_record}
                                                          style={{width: 20, height: 20}}/>)}
                          onRightViewClick={() => {
                              dispatch(goto(token ? 'CarOrderPage' : 'Login'))
                          }}
                />
                {this.state.isLoadingHeaderData ? <LoadingView/> : showView}
                <RecommendDialog ref={'RecommendDialog'} referrer={this.state.referrer}
                                 onEnd={(text) => this._getReferrer(text)}
                                 confirm={() => this._bindRecommend()}/>
            </View>
        );
    }

    componentDidMount() {
        this._getCarIndexData();
        this.listener = DeviceEventEmitter.addListener('SHOWRECOMMENDVIEW', () => {
            this.refs.RecommendDialog.show();
        });
    }

    componentDidUnMount() {
        this.listener.remove();
    }

    _resetCarList(id) {
        let requestObj = {
            pageNo: 1,
            pageSize: 10,
            'descId': id
        };
        post('main/carOrderProducts', requestObj, true)
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    this.refs.LFlatList.updateDataSource([responseData.result.products],
                        {haveNext: ((responseData.result.products.pageNo) * responseData.result.products.pageSize < responseData.result.products.dataCount)})
                } else {
                    this.refs.LFlatList.updateDataSource([], {requestError: true});
                }
            })
            .catch((e) => {
                showToastShort(e.message);
            });

    }

    /**
     * 获取购车首页数据
     * @private
     */
    _getCarIndexData() {
        post('main/carPavilion')
            .then((responseData) => {
                if (isSuccess(responseData)) {

                    let carBrandsList = responseData.result.carBrandsList;
                    if (carBrandsList.length > 0) {
                        this.defaultCarBrandId = carBrandsList[0].id;
                    }
                    this.setState({
                        headerViewData: responseData.result,
                        isLoadingHeaderData: false,
                        isRequestError: false,
                    })
                }
                else
                {
                    this._errorMsg(responseData.message);
                }
            }).catch(e => {
            this._errorMsg(e);
        });
    }

    /**
     * 获取汽车列表
     * @private
     */
    _getCarList(callback, options, page = 1, brandId) {
        if (brandId === 0) {
            callback([], {haveNext: false});
            return;
        }
        let requestObj = {
            pageNo: page,
            pageSize: 10,
            'descId': brandId
        };

        post('main/carOrderProducts', requestObj)
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    callback([responseData.result.products], {haveNext: ((responseData.result.products.pageNo) * responseData.result.products.pageSize < responseData.result.products.dataCount)});
                } else {
                    callback([], {requestError: true});
                    showToastShort(responseData.message);
                }
            })
            .catch((e) => {
                callback([], {requestError: true});
                showToastShort(e.message);
            });
    }

    /**
     * 刷新数据
     * @param callback
     * @param options
     * @private
     */
    _onRefresh(callback, options) {
        this._getCarList(callback, options, 1, this.defaultCarBrandId)
    }


    _onLoadMore(page = 1, callback, options) {
        this._getCarList(callback, options, page);
    }

    _errorMsg(msg) {
        this.setState({
            isLoadingHeaderData: false,
            isRequestError: true,
        });
        showToastShort(getRequestFailTip(msg));
    }

}

class HeaderView extends Component {
    render() {
        let {data} = this.props;
        return <View>
            <Carousel data={data.carBanner} isFromCart={true}/>
            <OrderDynamic data={data.carOrderList}/>
            <CarStatusList data={data.carBrandsList} onBrandPress={(id) => this.props.onBrandPress(id)}/>
        </View>
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: mainBackgroundColor
    },
});

selector = (state) => {
    return {
        token: state.loginStore.token,
    }
};
export default connect(selector)(BuyCarIndex);