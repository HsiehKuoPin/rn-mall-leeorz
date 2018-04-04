import React, {Component} from 'react';
import {
    StyleSheet,
    Dimensions,
    View,
    TouchableOpacity,
    ImageBackground,
    Text,
    NativeModules,
    NativeEventEmitter, Platform
} from 'react-native';

import {connect} from 'react-redux';
import TitleBar from '../../../widgets/TitleBar';
import {getHost, getRequestFailTip, isSuccess, post} from "../../../common/CommonRequest";
import {showToastShort} from "../../../common/CommonToast";
import {
    titleTextColor,
    content2TextColor,
    placeholderTextColor,
    mainBackgroundColor,
    contentTextColor
} from '../../../constraint/Colors';
import {ic_merchant_data, ic_merchant_data_iphoneX} from '../../../constraint/Image';
import {
    dialog_close, evaluation_camera, ic_selected, ic_un_selected,
} from "../../../constraint/Image";
import XImage from "../../../widgets/XImage";
import SelectPhotoDialog from "../../product/module/SelectPhotoDialog";
import {goto, gotoAndClose} from '../../../reducers/RouterReducer';
import {isIphoneX} from 'react-native-iphone-x-helper';
import {getQiniuUrl} from "../../../common/AppUtil";
import {APP_NAME} from "../../../constraint/Strings";

const {width, height} = Dimensions.get('window');

class MerchantUploadData extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isAgreeAgreement: false,
            companyDocuments: [],
            legalIdentityCards: [],
            type: ''
        };
        this.companyDocuments = [];
        this.legalIdentityCards = [];
        if (this.props.navigation.state.params !== undefined) {
            this.company = this.props.navigation.state.params.merchantInfo;
            this.companyCertificates = this.props.navigation.state.params.companyCertificates;
        }
    }

    componentWillMount() {
        this.companyCertificates.map((item) => {
            if (item.type === 'COMPANY_DOCUMENTS') {
                this.companyDocuments.push(item.fileUrl);
                this.setState({companyDocuments: this.companyDocuments});
            } else {
                this.legalIdentityCards.push(item.fileUrl);
                this.setState({legalIdentityCards: this.legalIdentityCards});
            }
        });
        if (NativeModules.InteractionModule) {
            let eventEmitter = new NativeEventEmitter(NativeModules.InteractionModule);
            this.listener = eventEmitter.addListener('photo', (imgUrL) => {
                let urlList = [];
                for (let item of JSON.parse(imgUrL)) {
                    urlList.push(getQiniuUrl() + item);
                    // urlList.push(getQiniuUrl() + item + `?imageView2/0/w/${parseFloat(width).toFixed(0)}`);
                }
                if (this.state.type === 'companyDocuments') {
                    this.companyDocuments.push(...urlList);
                    this.setState({companyDocuments: this.companyDocuments});
                } else {
                    this.legalIdentityCards.push(...urlList);
                    this.setState({legalIdentityCards: this.legalIdentityCards});
                }
            });
        }
    }

    choosePicture(type, openType) {
        this.setState({type: type});
        if (type === 'companyDocuments') {
            if (openType === 'onTakePhotos') {
                if (this.companyDocuments.length < 3) NativeModules.InteractionModule.openCamera(this.props.token);
                else showToastShort("最多只可上传3张图片！");
                this.refs.SelectPhotoDialog.dismiss();
            } else {
                if (this.companyDocuments.length < 3) NativeModules.InteractionModule.openAlbum(this.props.token, 3 - this.companyDocuments.length);
                else showToastShort("最多只可上传3张图片！");
                this.refs.SelectPhotoDialog.dismiss();
            }
        } else {
            if (openType === 'onTakePhotos') {
                if (this.legalIdentityCards.length < 2) NativeModules.InteractionModule.openCamera(this.props.token);
                else showToastShort("最多只可上传2张图片！");
                this.refs.SelectPhotoDialog.dismiss();
            } else {
                if (this.legalIdentityCards.length < 2) NativeModules.InteractionModule.openAlbum(this.props.token, 2 - this.legalIdentityCards.length);
                else showToastShort("最多只可上传2张图片！");
                this.refs.SelectPhotoDialog.dismiss();
            }
        }
    }

    componentWillUnmount() {
        if (NativeModules.InteractionModule) {
            this.listener.remove();
        }
    }

    commitData() {
        if (this.companyDocuments.length === 0) {
            showToastShort("您还没上传公司证件...");
        } else if (this.legalIdentityCards.length < 2) {
            showToastShort("您还没上传有效身份证正反两面...")
        } else if (!this.state.isAgreeAgreement) {
            showToastShort(`亲,您还没同意《{APP_NAME}开放平台入驻商家服务协议》...`)
        } else {
            let requestObj = {
                token: this.props.token,
                company: this.company,
                companyDocuments: this.companyDocuments,
                legalIdentityCards: this.legalIdentityCards
            };
            post('order/company/uploadData', requestObj)
                .then((response) => {
                    if (isSuccess(response)) {
                        this.props.dispatch(gotoAndClose('DataAuditing', 'Main'))
                    } else {
                        showToastShort(getRequestFailTip(response));
                    }
                })
        }
    }

    render() {
        return (
            <ImageBackground resizeMode='stretch'
                             source={{uri: isIphoneX() ? ic_merchant_data_iphoneX : ic_merchant_data}}
                             style={{flex: 1}}>
                <TitleBar title={'上传资料'} customBarStyle={{backgroundColor: 'transparent'}}/>
                <View style={{flex: 1, marginHorizontal: 40}}>
                    <View style={styles.contentLayout}>
                        <Text style={styles.titleText}>公司证件:</Text>
                        <Text style={styles.text}>(营业执照、组织代码证、税务登记证或三证合一)</Text>
                        <View style={{flexDirection: 'row'}}>
                            {
                                this.companyDocuments.map((item, index) => {
                                    return (
                                        <View key={index}>
                                            <TouchableOpacity
                                                activeOpacity={0.7}
                                                onPress={() => this.props.dispatch(goto('PhotoView', {
                                                    imgUrlList: this.companyDocuments,
                                                    index: index
                                                }))}>
                                                <XImage style={styles.uploadImg}
                                                        uri={item.indexOf('?imageView2/0/w/') !== -1 ? item : item + `?imageView2/0/w/300`}/>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={styles.touchDelete}
                                                activeOpacity={0.7}
                                                onPress={() => {
                                                    this.companyDocuments.splice(index, 1);
                                                    this.setState({companyDocuments: this.companyDocuments});
                                                }}>
                                                <XImage style={styles.imgDelete} source={dialog_close}/>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                })
                            }
                            <TouchableOpacity
                                activeOpacity={0.7} style={styles.camera}
                                onPress={() => this.refs.SelectPhotoDialog.show('companyDocuments')}>
                                <XImage style={{height: 25, width: 25, margin: 5}} source={evaluation_camera}/>
                                <Text style={{color: placeholderTextColor, fontSize: 12}}>上传资料</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{marginTop: 20}}>
                            <Text style={styles.titleText}>法人身份证:</Text>
                            <Text style={styles.text}>(公司法人正反面有效身份证)</Text>
                            <View style={{flexDirection: 'row'}}>
                                {
                                    this.legalIdentityCards.map((item, index) => {
                                        return (
                                            <View key={index}>
                                                <TouchableOpacity
                                                    activeOpacity={0.7}
                                                    onPress={() => this.props.dispatch(goto('PhotoView', {
                                                        imgUrlList: this.legalIdentityCards,
                                                        index: index
                                                    }))}>
                                                    <XImage style={styles.uploadImg}
                                                            uri={item.indexOf('?imageView2/0/w/') !== -1 ? item : item + `?imageView2/0/w/300`}/>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={styles.touchDelete}
                                                    activeOpacity={0.7}
                                                    onPress={() => {
                                                        this.legalIdentityCards.splice(index, 1);
                                                        this.setState({legalIdentityCards: this.legalIdentityCards});
                                                    }}>
                                                    <XImage style={styles.imgDelete} source={dialog_close}/>
                                                </TouchableOpacity>
                                            </View>
                                        )
                                    })
                                }
                                <TouchableOpacity
                                    activeOpacity={0.7} style={styles.camera}
                                    onPress={() => this.refs.SelectPhotoDialog.show('legalIdentityCards')}>
                                    <XImage style={{height: 25, width: 25, margin: 5}} source={evaluation_camera}/>
                                    <Text style={{color: placeholderTextColor, fontSize: 12}}>上传资料</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', marginTop: 20, alignItems: 'center'}}>
                            <TouchableOpacity activeOpacity={1} style={{flexDirection: 'row'}}
                                              onPress={() => {
                                                  this.setState(preState => {
                                                      return {isAgreeAgreement: !preState.isAgreeAgreement};
                                                  });
                                              }}>
                                <XImage source={this.state.isAgreeAgreement ? ic_selected : ic_un_selected}
                                        style={styles.agreement}/>
                                <Text style={{fontSize: 12, color: contentTextColor}}>{'勾选即表示同意'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.7} onPress={() => this.props.dispatch(goto('Agreement', {title: `${APP_NAME}开放平台入驻商家服务协议`, url: getHost() + 'main/merchant_protocol.html'}))}>
                                <Text style={{fontSize: 12, color: '#65BCFE',}}>《{APP_NAME}开放平台入驻商家服务协议》</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.commit} onPress={() => this.commitData()}>
                        <Text style={{fontSize: 15, color: titleTextColor, textAlign: 'right'}}>提交资料</Text>
                    </TouchableOpacity>
                </View>
                <SelectPhotoDialog
                    ref={'SelectPhotoDialog'}
                    onTakePhotos={(type) => this.choosePicture(type, 'onTakePhotos')}
                    onAlbumChoose={(type) => this.choosePicture(type, 'onAlbumChoose')}
                />
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({

    contentLayout: {
        marginTop: Platform.OS === 'android' ? height / 7 + 15 : height / 7,
        backgroundColor: 'transparent'
    },
    titleText: {
        color: titleTextColor,
        fontSize: 16,
    },
    text: {
        color: content2TextColor,
        fontSize: 15,
        marginTop: 5
    },
    camera: {
        height: (width - 108) / 4,
        width: (width - 108) / 4,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: mainBackgroundColor,
        borderWidth: 1,
        borderColor: content2TextColor,
        borderStyle: 'dashed',
        borderRadius: 1,
    },
    agreement: {
        width: 15,
        height: 15,
        marginRight: 5,
    },
    commit: {
        position: 'absolute',
        width: 80,
        marginTop: Platform.OS === 'android' ? height / 1.47 : height / 1.48,
        alignSelf: 'flex-end',
        borderBottomColor: "#f8b265",
        paddingBottom: 5,
        backgroundColor: 'transparent',
        borderBottomWidth: 0.5,
    },
    uploadImg: {
        height: (width - 108) / 4,
        width: (width - 108) / 4,
        borderWidth: 1,
        marginTop: 10,
        borderColor: mainBackgroundColor,
        marginRight: 10,
    },
    touchDelete: {
        width: 30,
        height: 30,
        position: 'absolute',
        right: 0,
        // top: -12,
        justifyContent: 'center',
        alignItems: 'center',

    },
    imgDelete: {
        width: 20,
        height: 20,
    },
});

selector = (state) => {
    return {
        token: state.loginStore.token,
    }
};

export default connect(selector)(MerchantUploadData)
