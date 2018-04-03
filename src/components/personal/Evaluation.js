import React, {Component} from 'react';
import {
    View, StyleSheet, Dimensions, Text, NativeModules,DeviceEventEmitter,
    TouchableOpacity,ScrollView,NativeEventEmitter
} from 'react-native';
import TitleBar from "../../widgets/TitleBar";
import {
    content2TextColor, mainBackgroundColor, mainColor,
    placeholderTextColor, titleTextColor
} from "../../constraint/Colors";
import {
    dialog_close,
    evaluation_camera, evaluation_empty_star, evaluation_full_star, ic_colored_tape, ic_selected, ic_un_selected,
} from "../../constraint/Image";
import {connect} from "react-redux";
import SelectPhotoDialog from "../product/module/SelectPhotoDialog";
import {showToastShort} from "../../common/CommonToast";
import {getRequestFailTip,isSuccess, post} from "../../common/CommonRequest";
import {goto, goBack} from '../../reducers/RouterReducer';
import {ORDER_ALL, ORDER_APPRAISE} from "../../constraint/OrderType";
import XImage from "../../widgets/XImage";
import {getQiniuUrl} from "../../common/AppUtil";

const {width, height} = Dimensions.get('window');
/**
 * 评价晒单界面：传入参数{'productSkuId':'','imgUrl':'','orderItemId':'',orderId:'String,订单id,非必填'}
 */
class Evaluation extends Component {
    _keyExtractor = (item, index) => index;
    constructor(props) {
        super(props);
        this.state = {
            fullStartCount:5,
            isAnonymity:true,
            imgUriList:[],
            appraiseLabels:[],
            refreshState:false,
        };
        this.imgUriList=[];
        this.orderId = this.props.navigation.state.params.orderId;
        this.waitCommentProductCount = this.props.navigation.state.params.waitCommentProductCount;
    }
    componentWillMount() {

        if(NativeModules.InteractionModule){
            let eventEmitter = new NativeEventEmitter(NativeModules.InteractionModule);
            this.listener = eventEmitter.addListener('photo', (imgUrL) => {
                let urlList = [];
                for (let item of JSON.parse(imgUrL)) {
                    // urlList.push('http://p0xkrqo35.bkt.clouddn.com/' + item +`?imageView2/0/w/${width}`);
                    urlList.push(getQiniuUrl() + item );
                }
                this.imgUriList.push(...urlList);
                this.setState({imgUriList: this.imgUriList});
            });
        }
    }
    componentWillUnmount(){
        if(NativeModules.InteractionModule){
            this.listener.remove();
        }
    }

    componentDidMount() {
        this._appraiseLabels();
    }

    //获取商品评价内容标签接口
    _appraiseLabels(){
        post('product/appraiseLabels',{},true)
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    this.setState({appraiseLabels:responseData.result});
                } else{
                    showToastShort(responseData?responseData.message:"请求出现异常");
                }
            }).catch((e) => {
            showToastShort(e.message);
        });
    }

    //新增商品评论接口
    _addAppraise(){
        let content = '';
        for (let label of this.state.appraiseLabels) {
            if (label.checked) content += ((content===''?'':';') + label.text);
        }
        if (content === ''){
            showToastShort('请至少选择一个评价');
            return;
        }
        let requestObj = {
            'productSkuId': this.props.navigation.state.params.productSkuId,
            'orderItemId': this.props.navigation.state.params.orderItemId,
            'score': this.state.fullStartCount,
            'content': content,
            'anonymous': this.state.isAnonymity?'Y':'N',
            'imgs': this.state.imgUriList,
            'token': this.props.token
        };

        post('product/addAppraise', requestObj,true)
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    showToastShort('评价成功');
                    if(this.waitCommentProductCount === 1){
                        DeviceEventEmitter.emit(ORDER_ALL, {orderId:this.orderId});
                        DeviceEventEmitter.emit(ORDER_APPRAISE, {type:'delete',orderId:this.orderId});
                        this.props.dispatch(goBack('MyOrder'));
                    }else if(this.waitCommentProductCount > 1){
                        DeviceEventEmitter.emit('Comment', {productId: this.props.navigation.state.params.productSkuId});
                        this.props.dispatch(goBack());
                    }else if(this.orderId){
                        DeviceEventEmitter.emit(ORDER_ALL, {orderId:this.orderId});
                        DeviceEventEmitter.emit(ORDER_APPRAISE, {type:'delete',orderId:this.orderId});
                        this.props.dispatch(goBack());
                    }else{
                        this.props.dispatch(goBack());
                    }
                } else{
                    showToastShort(getRequestFailTip(responseData));
                }
            }).catch((e) => {
            console.warn(e.message);
            showToastShort(getRequestFailTip());
        });
    }
    render(){
        return (
            <View style={{flex: 1}}>
                <TitleBar title={'评价晒单'}/>
                <View style={{flex: 1, backgroundColor: mainBackgroundColor}}>
                    <ScrollView style={{flex: 1}}>
                        <View style={styles.container}>
                            {this.header()}
                            <View style={{height: 0.5, marginTop: 18, marginBottom: 18, backgroundColor: placeholderTextColor,}}/>
                            <View style={{flexWrap:'wrap',flexDirection:'row'}}>
                                {this.state.appraiseLabels.map((item,index)=>{
                                    return <TouchableOpacity
                                                activeOpacity={0.7}
                                                key={index}
                                                onPress={()=> {
                                                item.checked=!item.checked;
                                                this.setState(preState => {
                                                    return {refreshState: !preState.refreshState};
                                                });
                                            }}>
                                                <Text style={[styles.txtColor, {
                                                color: item.checked ? mainColor : placeholderTextColor,
                                                borderColor: item.checked ? mainColor : placeholderTextColor}]}
                                                >{item.text}</Text>
                                                </TouchableOpacity>

                                })}
                            </View>
                            <View style={{flexDirection: 'row',marginTop:18, marginBottom:18,}}>
                                <View style={{flex:1}}/>
                                {
                                    this.imgUriList.map((item, index) => {
                                        return (
                                            <View key={index}>
                                                <TouchableOpacity
                                                    activeOpacity={0.7}
                                                    onPress={() => this.props.dispatch(goto('PhotoView',{imgUrlList: this.imgUriList, index: index}))}>
                                                    <XImage style={styles.uploadImg} uri={item + `?imageView2/0/w/300`}/>
                                                    {/*<XImage style={styles.uploadImg} uri={item.substring(0,item.indexOf('?imageView2/0/w/')) + `?imageView2/0/w/${(width-108)/4}`}/>*/}
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={styles.touchDelete}
                                                    activeOpacity={0.7}
                                                    onPress={() =>{
                                                        this.imgUriList.splice(index,1);
                                                        this.setState({imgUriList: this.imgUriList});
                                                    }}>
                                                    <XImage style={styles.imgDelete} source={dialog_close}/>
                                                </TouchableOpacity>
                                            </View>
                                        )
                                    })
                                }
                                <TouchableOpacity
                                    activeOpacity={0.7} style={styles.camera} onPress={()=> this.refs.SelectPhotoDialog.show()}>
                                    <XImage style={{height: 25, width: 25, margin: 5}} source={evaluation_camera}/>
                                    <Text style={{color: placeholderTextColor,fontSize:12}}>上传照片</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{flexDirection: 'row',alignItems:'center'}}>
                                <View style={{flex: 1}}/>
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={()=> {
                                        this.setState(preState => {
                                            return {isAnonymity: !preState.isAnonymity};
                                        });
                                    }}>
                                    <XImage source={this.state.isAnonymity ? ic_selected : ic_un_selected} style={styles.anonymity}/>
                                </TouchableOpacity>
                                <Text style={{color: titleTextColor}}>匿名评论</Text>
                            </View>
                            <View style={{height: 0.5, marginTop: 18, marginBottom:18, backgroundColor: placeholderTextColor}}/>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                style={styles.txtCommit}
                                onPress={() => this._addAppraise()}>
                                <Text style={{fontSize:18,color:'#fff'}} >提 交</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.tape}>
                            <XImage source={ic_colored_tape} style={{height: 60, width: 60}}/>
                        </View>
                    </ScrollView>
                    <SelectPhotoDialog
                        ref={'SelectPhotoDialog'}
                        onTakePhotos={() => {
                            if (this.imgUriList.length < 3) NativeModules.InteractionModule.openCamera(this.props.token);
                            else showToastShort("最多只可上传3张图片！");
                            this.refs.SelectPhotoDialog.dismiss();
                        }}
                        onAlbumChoose={() => {
                            if (this.imgUriList.length < 3) NativeModules.InteractionModule.openAlbum(this.props.token,3 - this.imgUriList.length);
                            else showToastShort("最多只可上传3张图片！");
                            this.refs.SelectPhotoDialog.dismiss();
                        }}
                    />
                </View>
            </View>
        );

    }

    header() {
        return <View style={{flexDirection: 'row'}}>
            <View style={styles.imgView}>
                <XImage uri={this.props.navigation.state.params.imgUrl} style={styles.img}/>
            </View>
            <View style={{justifyContent: 'center',marginLeft:10, height: 120,}}>
                <Text style={styles.txt}>评分：</Text>
                <View style={{flexDirection: 'row'}}>
                    {
                        [0, 1, 2, 3, 4].map((item, index) => {
                            return (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => {
                                        this.setState({fullStartCount: index + 1})
                                    }}
                                    activeOpacity={0.7}>
                                    <XImage
                                        style={{height: (width-270)/5, width: (width-270)/5, margin: 5}}
                                        source={index < this.state.fullStartCount ? evaluation_full_star : evaluation_empty_star}
                                    />
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
            </View>
        </View>;
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        shadowColor: 'gray',
        shadowOffset: {height: 2, width: 2},
        shadowRadius: 5,
        shadowOpacity: 0.2,
        elevation:2,
        margin: 10,
        padding: 20,
        borderRadius: 5,
    },
    tape: {
        position: 'absolute',
        height: 60,
        width: 60,
        marginLeft: width - 66,
        elevation: 2,
        marginTop: 6,
    },
    txt: {
        backgroundColor:'#00000000',
        color: titleTextColor,
        fontSize: 18,
        padding: 5,
    },
    img: {
        height: 118,
        width: 118,
        borderRadius: 5,
    },
    imgView: {
        height: 120,
        width: 120,
        backgroundColor:'#fff',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'gray',
        shadowOffset: {height: 2, width: 2},
        shadowRadius: 5,
        shadowOpacity: 0.4,
        elevation: 2,
    },
    txtColor: {
        backgroundColor:mainBackgroundColor,
        borderColor:placeholderTextColor,
        marginRight:10,
        marginTop:15,
        padding:8,
        paddingHorizontal:5,
        textAlign:'center',
        borderRadius:3,
        borderWidth:0.5,
        fontSize:12,
    },
    txtCommit: {
        backgroundColor:mainColor,
        margin:10,
        marginLeft:33,
        marginRight:33,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:5,
        height:40

    },
    uploadImg: {
        height: (width-108)/4,
        width:(width-108)/4,
        borderWidth: 1,
        borderColor: mainBackgroundColor,
        marginRight:10,
    },
    camera: {
        height: (width-108)/4,
        width: (width-108)/4,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:mainBackgroundColor,
        borderWidth: 1,
        borderColor: content2TextColor,
        borderStyle:'dashed',
        borderRadius:1,
    },
    anonymity: {
        width: 15,
        height: 15,
        marginRight: 10,
    },
    touchDelete: {
        width: 30,
        height: 30,
        position: 'absolute',
        right:0,
        top:-12,
        justifyContent:'center',
        alignItems:'center',

    },
    imgDelete: {
        width: 20,
        height: 20,
    },

});

/**
 * 声明在store tree 需要获取那部分数据
 * @param state
 * @returns {{token: string}}
 */
selector = (state) =>{
    return {
        token:state.loginStore.token,
    }
};
export default connect(selector)(Evaluation);