import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    Text,
    Image,
    TouchableOpacity,
} from 'react-native';

import {connect} from 'react-redux';
import {goto, goBack} from '../../../reducers/RouterReducer';
import {saveAddress} from '../../../reducers/CacheReducer';
import TitleBar from '../../../widgets/TitleBar';
import RequestErrorView from '../../../widgets/RequestErrorView';
import {post,isSuccess} from "../../../common/CommonRequest"
import {showToastShort} from "../../../common/CommonToast";
import {content2TextColor, mainBackgroundColor, placeholderTextColor, titleTextColor} from "../../../constraint/Colors";
import {ic_delete, ic_edit, ic_selected, ic_un_selected} from "../../../constraint/Image";
import LoadingView from "../../../widgets/LoadingView";
import TipDialog from "../../../widgets/dialog/TipDialog";
import LFlatList from "../../../widgets/LFlatList";
import EmptyView from "../../common/empty/EmptyView";
import {isTrue} from "../../../common/AppUtil";

class AddressListView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isRequestError: false,
            showDeleteDia: false,
            selectItem:null,
        };
        this.updateFlag = 0;

        this.isSelectAddress = true;
        if(this.props.navigation.state.params){
            this.isSelectAddress = this.props.navigation.state.params.isSelectAddress;
        }

    }

    static defaultProps = {

    };

    componentDidMount() {
        // this.refs.lflatlist.reset();
        this.updateFlag = this.props.updateFlag;
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.updateFlag !== this.updateFlag){
            this.refs.lflatlist.reset();
            this.updateFlag = nextProps.updateFlag;
        }
    }


    _onLoadMore(page, callback, options) {
        post('user/addressList', {token: this.props.token})
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    this.setState({
                        isRequestError: false,
                    });

                    callback(responseData.result, {
                        isShowFirstLoadView: false,
                        haveNext: false})
                } else {
                    this._errorMsg(responseData.message);
                }
            }).catch((e) => {
            this._errorMsg(e.message);
        });
    }

    _errorMsg(msg) {
        this.setState({
            isRequestError: true,
        });
        showToastShort(msg);
    }


    render() {

        var showView = this.state.isRequestError ? (
            <RequestErrorView onPress={() => {
                this.setState({isRequestError: false});
            }}/>
        ) : (

            <View style={styles.container}>
                <LFlatList
                    ref={'lflatlist'}
                    refreshable={false}
                    loadMoreable={true}
                    onLoadMore={this._onLoadMore.bind(this)}
                    emptyView={()=><EmptyView emptyTip={'您还没有收货地址'} showRecommended={false}/>}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => index}
                    pagination={true}
                    ListHeaderComponent={() => <View style={{height: 5}}/>}//header头部组件
                    renderItem={({item, index}) =>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            key={index}
                            style={styles.viewStyle}
                            onPress={
                                this.isSelectAddress?(() => {
                                this.props.dispatch(saveAddress(item));
                                this.props.dispatch(goBack());
                            }):null}>
                            <View style={{flexDirection: 'row', padding: 15, paddingBottom: 10, borderRadius: 5}}>
                                <Text
                                    style={{
                                        fontSize: 15,
                                        color: titleTextColor,
                                    }}>{item.contactPerson === '' ? '收货人：' : '收货人：' + item.contactPerson}</Text>
                                <Text style={{
                                    fontSize: 15,
                                    marginLeft: 30,
                                    color: titleTextColor,
                                }}>{item.phone === '' ? '' : item.phone}</Text>
                                <View style={{flex: 1}}/>
                            </View>
                            <Text style={{
                                paddingLeft: 15,
                                paddingRight: 15,
                                fontSize: 14,
                                color: content2TextColor
                            }}
                                  numberOfLines={2}>
                                {item.area + item.addressDetail}
                            </Text>
                            <View style={{
                                margin: 15,
                                marginBottom: 0,
                                backgroundColor: placeholderTextColor,
                                height: 0.5
                            }}/>
                            <View style={{flexDirection: 'row', height: 40,alignItems:'center'}}>
                                <TouchableOpacity
                                    style={{
                                        flexDirection: 'row',
                                        marginLeft: 15,
                                        width: 75,
                                        height: 30,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                    activeOpacity={0.7}
                                    onPress={this.onPress.bind(this, item, index, 'default')}>
                                    <Image
                                        style={{
                                            marginRight: 5,
                                            width: 15,
                                            height: 15,
                                            resizeMode: 'cover',
                                        }}
                                        source={isTrue(item.isDefault)? ic_selected : ic_un_selected}
                                        resizeMode="contain"/>
                                    <Text style={{color: content2TextColor, fontSize: 13,}}>{'默认地址'}</Text>

                                </TouchableOpacity>
                                <View style={{flex: 1}}/>
                                <TouchableOpacity
                                    style={{
                                        flexDirection: 'row',
                                        marginRight: 15,
                                        width: 50,
                                        height: 30,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                    activeOpacity={0.7}
                                    onPress={this.onPress.bind(this, item, index, 'edit')}>
                                    <Image
                                        style={{
                                            marginRight: 5,
                                            width: 15,
                                            height: 15,
                                            resizeMode: 'cover',
                                        }}
                                        source={ic_edit}
                                        resizeMode="contain"/>
                                    <Text style={{
                                        color: content2TextColor,
                                        fontSize: 13,
                                        backgroundColor: 'transparent'
                                    }}>{'编辑'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{
                                        flexDirection: 'row',
                                        marginRight: 15,
                                        width: 50,
                                        height: 30,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                    activeOpacity={0.7}
                                    onPress={this.onPress.bind(this, item, index, 'delete')}>
                                    <Image
                                        style={{
                                            marginRight: 5,
                                            width: 15,
                                            height: 15,
                                            resizeMode: 'cover',
                                        }}
                                        source={ic_delete}
                                        resizeMode="contain"/>
                                    <Text style={{color: content2TextColor, fontSize: 13,}}>{'删除'}</Text>
                                </TouchableOpacity>

                            </View>

                        </TouchableOpacity>
                    }
                />
                <View>
                <TipDialog
                    ref={'tipDialog'}
                    confirmBtnText={'删除'}
                    dialogMessage={'是否确认删除收货地址'}
                    onClickConfirm={this.onDeletePress.bind(this,this.state.selectItem)}/>
                </View>
            </View>
        );
        return (
            <View style={styles.container}>
                <TitleBar
                    title={'地址列表'}
                    hideRight={false}
                    customRightView={() => (<Text style={{color: 'white'}}>新增地址</Text>)}
                    onRightViewClick={() => {
                        this.props.dispatch(goto('EditAddress', {addressDetail: null}))
                    }}

                />
                {showView}
            </View>
        );
    }

    onPress = (item, index, text) => {

        if (text === 'default') {
            if (!isTrue(item.isDefault)) {
                post('user/setDefaultAddress', {'addressId': item.id, token: this.props.token})
                    .then((responseData) => {
                        if (isSuccess(responseData)) {
                            showToastShort("设置成功");
                            this.refs.lflatlist.reset();

                        } else {
                            this._errorMsg(responseData.message);
                        }
                    }).catch((e) => {
                    this._errorMsg(e.message);
                });
            }
        }
        else if (text === 'edit') {
            this.props.dispatch(goto('EditAddress', {addressDetail: item}))
        }
        else {
            this.setState({
                selectItem: item,
            }, () => this.refs.tipDialog.showDialog())
        }
    }

    //删除接口
    onDeletePress = (item) => {

        let requestObj = {
            'addressId': item.id,
            token: this.props.token
        };
        post('user/removeAddress', requestObj)
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    showToastShort("删除成功");
                    this.refs.lflatlist.reset();
                } else {
                    this._errorMsg(responseData.message);
                }
            }).catch((e) => {
            this._errorMsg(e.message);
        });
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: mainBackgroundColor
    },
    viewStyle: {
        marginHorizontal: 10,
        marginVertical: 5,
        backgroundColor: 'white',
        borderRadius: 5,
        shadowColor: 'gray',
        shadowOffset: {height: 4, width: 4},
        shadowRadius: 5,
        shadowOpacity: 0.2,
        elevation: 2
    },
    imageStyle: {
        borderRadius: 5,
        width: 100,
        height: 100,
        resizeMode: 'contain',
    }
});

selector = (state) => {
    return {
        token: state.loginStore.token,
        updateFlag:state.cacheStore.updateAddressListFlag,
    }
};
export default connect(selector)(AddressListView);
