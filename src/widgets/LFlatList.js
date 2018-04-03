'use strict'

var React = require('react');

var {
    FlatList,
    Platform,
    TouchableHighlight,
    View,
    Text,
    Image,
    RefreshControl,
} = require('react-native');

import LoadingView from "./LoadingView";
import {mainColor} from "../constraint/Colors";

const STATE_NO_MORE = 'noMore';
const STATE_LOADING = 'loading';
const STATE_ERROR = 'requestError';
const STATE_READY = 'ready';

var LFlatList = React.createClass({

    getDefaultProps() {
        return {
            customStyles: {},
            initialListSize: 10,
            isShowFirstLoadView: false,
            refreshable: true,
            loadMoreable: false,
            headerView: null,
            sectionHeaderView: null,
            scrollEnabled: true,
            onLoadMore(page, callback, options) {
                callback([]);
            },
            onRefreshing(callback, options) {
                callback([]);
            },

            loadingFooterView: null,
            loadingErrorFooterView: null,
            noMoreFooterView: null,
            emptyView: null,
            isShowEmptyView:false,
            renderSeparator: null,
            showFirstLoadView: null,

        };
    },

    propTypes: {
        customStyles: React.PropTypes.object,
        initialListSize: React.PropTypes.number,
        isShowFirstLoadView: React.PropTypes.bool,
        refreshable: React.PropTypes.bool,
        loadMoreable: React.PropTypes.bool,
        headerView: React.PropTypes.func,
        sectionHeaderView: React.PropTypes.func,
        scrollEnabled: React.PropTypes.bool,
        onLoadMore: React.PropTypes.func,
        onRefreshing: React.PropTypes.func,

        loadingFooterView: React.PropTypes.func,
        loadingErrorFooterView: React.PropTypes.func,
        noMoreFooterView: React.PropTypes.func,
        emptyView: React.PropTypes.func,
        isShowEmptyView:React.PropTypes.bool,
        renderSeparator: React.PropTypes.func,
        showFirstLoadView: React.PropTypes.func,
    },

    _setPage(page) {
        if(page < 1){
            page = 1;
        }
        this._page = page;
    },
    _getPage() {
        return this._page;
    },
    _setRows(rows) {
        this._rows = rows;
    },
    _getRows() {
        return this._rows;
    },
    _isLoading() {
        return this._loadingState;
    },
    _setLoading(state) {
        this._loadingState = state;
    },

    componentDidMount(){
        if (this.props.refreshable && this.props.isShowFirstLoadView) {
            this._onRefresh()
        }else if(this.props.loadMoreable && this.props.onLoadMore){
            this._toEnd()
        }

    },

    updateDataSource(data,options = {}){
        this._rows = [];
        if(options.pageNumber !== undefined && !isNaN(options.pageNumber)){
            this._setPage(options.pageNumber)
        }
        this._updateListUI(data,options);
    },

    //重置
    reset(){
        this.setState({
            ...this.getInitialState()
        }, () => {
            if (this.props.refreshable) {
                this._onRefresh()
            }else if(this.props.loadMoreable){
                this._loadMore();
            }
        })
    },

    /**
     * 加载更多数据中
     * @returns {XML}
     */
    _loadingFooterView() {
        if (this.props.loadingFooterView) {
            return this.props.loadingFooterView();
        }

        return (
            <View style={[this.defaultStyles.paginationView, this.props.customStyles.paginationView]}>
                <Text style={[this.defaultStyles.actionsLabel, this.props.customStyles.actionsLabel]}>
                    加载数据中...
                </Text>
            </View>
        );
    },

    /**
     * 请求失败
     * @returns {XML}
     */
    _loadingErrorFooterView() {
        if (this.props.loadingErrorFooterView) {
            return this.props.loadingErrorFooterView();
        }
        return (
            <View
                style={[this.defaultStyles.paginationView, this.props.customStyles.paginationView, {flexDirection: 'row'}]}>
                <Text style={[this.defaultStyles.actionsLabel, this.props.customStyles.actionsLabel]}>
                    请求出现异常
                </Text>
                <Text
                    onPress={() => {
                        this.setState({
                            loadingStatus: STATE_LOADING
                        },()=>{this._loadMore()});
                    }}
                    style={[this.defaultStyles.actionsLabel, this.props.customStyles.actionsLabel, {
                        color: '#dab26a',
                        marginLeft: 10
                    }]}>
                    点击重试
                </Text>
            </View>
        );
    },

    /**
     * 所有数据已经加载完毕
     * @returns {XML}
     */
    _noMoreFooterView() {
        if (this.props.noMoreFooterView) {
            return this.props.noMoreFooterView();
        }

        return null;

        // return (
        //     <View style={[this.defaultStyles.paginationView, this.props.customStyles.paginationView]}>
        //         <Text style={[this.defaultStyles.actionsLabel, this.props.customStyles.actionsLabel]}>
        //             已经没有更多数据
        //         </Text>
        //     </View>
        // );
    },

    headerView() {
        if (!this.props.headerView) {
            return null;
        }
        return this.props.headerView();
    },
    _emptyView(refreshCallback) {
        if (this.props.emptyView) {
            return this.props.emptyView(refreshCallback)
        }

        return (
            <View style={[this.defaultStyles.defaultView, this.props.customStyles.defaultView]}>
                <Text style={[this.defaultStyles.defaultViewTitle, this.props.customStyles.defaultViewTitle]}>
                    对不起，当前没有可以显示的数据
                </Text>

                <TouchableHighlight
                    underlayColor='#c8c7cc'
                    onPress={refreshCallback}>
                    <Text>
                        点击刷新
                    </Text>
                </TouchableHighlight>
            </View>
        );
    },
    renderSeparator() {
        if (this.props.renderSeparator) {
            return this.props.renderSeparator();
        }

        return (
            <View style={[this.defaultStyles.separator, this.props.customStyles.separator]}/>
        );
    },

    getInitialState() {
        this._setPage(1);
        this._setRows([]);

        return {
            dataSource: [],
            loadMoreable: this.props.loadMoreable,
            isRefreshing: false,
            isLoading: false,
            loadingStatus: this.props.loadMoreable? STATE_LOADING: STATE_NO_MORE,
            isShowFirstLoadView: this.props.isShowFirstLoadView,
        };
    },

    _onRefresh(options = {}) {
        if(!this.props.refreshable)return;
        this.setState({
            isRefreshing: true,
        });
        this._setPage(1);
        this.props.onRefreshing(this._refreshCallback);
    },

    /**
     * 刷新时候的回调
     * @param rows
     * @param options
     */
    _refreshCallback(rows = [], options = {}) {
        if(options.pageNumber !== undefined && !isNaN(options.pageNumber)){
            this._setPage(options.pageNumber)
        }else{
            this._setPage(this._page + 1);
        }
        this._updateListUI(rows, options);
    },

    setNativeProps(props) {
        this.refs.flatList.setNativeProps(props);
    },

    _loadMore() {
        if (this.state.loadingStatus !== STATE_NO_MORE) {
            this.props.onLoadMore(this._getPage(), this._loadMoreCallback, {});
        }
    },

    _loadMoreCallback(rows = [], options = {}) {
        this._setPage(this._getPage() + 1);
        let mergedRows = this._getRows().concat(rows);
        this._updateListUI(mergedRows, options);
    },

    _updateListUI(rows = [], options = {}) {
        if (rows !== null) {
            this._setRows(rows);
            if (options.requestError === true) {
                this._setPage(this._getPage() - 1);
                this.setState({
                    dataSource: this._getRows(),
                    isRefreshing: false,
                    loadingStatus: STATE_ERROR,
                    loadMoreable: options.loadMoreable === undefined ? true : options.loadMoreable,
                    isShowFirstLoadView: options.isShowFirstLoadView,
                });
            } else {
                this.setState({
                    dataSource: this._getRows(),
                    isRefreshing: false,
                    loadingStatus: (options.haveNext === true ? STATE_LOADING : STATE_NO_MORE),
                    loadMoreable: options.loadMoreable === undefined ? true : options.loadMoreable,
                    isShowFirstLoadView: options.isShowFirstLoadView,
                });
            }
        }

        setTimeout(() => {
            this._setLoading(false);
        }, 200);

    },
    _renderFooterView() {
        let loadingStatus = this.state.loadingStatus;
        let loadMoreable = this.state.loadMoreable;
        if (loadingStatus === STATE_LOADING && loadMoreable) {
            return this._loadingFooterView();
        } else if (loadingStatus === STATE_ERROR && loadMoreable) {
            return this._loadingErrorFooterView();
        } else if (loadingStatus === STATE_NO_MORE && loadMoreable&& this._getRows().length !== 0) {

            return this._noMoreFooterView();
            // return null;
        } else if (this._getRows().length === 0) {
            return this._emptyView(this._onRefresh);
        } else {
            return null;
        }
    },

    _toEnd() {
        let loadingStatus = this.state.loadingStatus;
        if (loadingStatus === STATE_LOADING && !this._isLoading()) {
            this._setLoading(true);
            this._loadMore(this._getPage(), this._loadMoreCallback, {});
        }
    },

    _keyExtractor(item, index) {
        return index;
    },
    _scrollToIndex(viewPosition, index) {
        this.refs.flatList.scrollToIndex({viewPosition: viewPosition, index: index});
    },
    render() {
        return (
            <View style={{flex: 1}}>
                {
                    this.state.isShowFirstLoadView ? (
                        <LoadingView/>
                    ) : (
                        <FlatList
                            ref="flatList"
                            data={this.state.dataSource}
                            footerViewStatus={this.state.loadingStatus}//没有其他意义，单纯更新footerView
                            renderSectionHeader={this.props.sectionHeaderView}
                            ListHeaderComponent={this.headerView}
                            ListFooterComponent={this._renderFooterView}
                            renderSeparator={this.state.loadMoreable ? this.renderSeparator:null}
                            removeClippedSubviews={false}
                            automaticallyAdjustContentInsets={false}
                            scrollEnabled={this.props.scrollEnabled}
                            canCancelContentTouches={true}
                            onRefresh={this.props.refreshable ? this._onRefresh : null}
                            refreshing={this.state.isRefreshing}
                            keyExtractor={this._keyExtractor}
                            enableEmptySections={true}
                            refreshControlAndroidColors={[mainColor]}
                            onEndReached={this._toEnd}
                            onEndReachedThreshold={0.2}

                            {...this.props}

                            style={this.props.style}
                        />
                    )
                }
            </View>
        );

    },

    defaultStyles: {
        separator: {
            height: 1,
        },
        actionsLabel: {
            fontSize: 12,
            color:'black',
        },
        paginationView: {
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
        },
        defaultView: {
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
        },
        defaultViewTitle: {
            fontSize: 13,
            color: 'black',
            fontWeight: 'bold',
            marginBottom: 15,
        },
    },
});


module.exports = LFlatList;
