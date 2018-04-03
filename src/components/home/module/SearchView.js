import React, {Component} from 'react';
import {Image,
    Platform,
    View,
    TouchableOpacity,
    Text,
    NativeEventEmitter,
    NativeModules,
    TextInput} from "react-native";
import {ic_scan, ic_search, ic_search_left, whiteBackIco} from "../../../constraint/Image";
import {isIphoneX} from "react-native-iphone-x-helper";
import {mainColor} from "../../../constraint/Colors";
import {connect} from 'react-redux'
import {goto,goBack} from "../../../reducers/RouterReducer";
import {dealQRCode} from "../../../common/QRcodeUtil";

/**
 * 搜索栏
 */

const titleBarHeight = 45;
const defaultTop = Platform.OS === 'android' ? 0 : 20;
const topValue = 44;

class SearchView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value:null,
        };
    }

    componentDidMount(){
        if(NativeModules.InteractionModule){
            let emitter = new NativeEventEmitter(NativeModules.InteractionModule);
            this.listener = emitter.addListener('QRCode',(result)=>{
                dealQRCode(this.props.dispatch,result,this.props.token, this.props.isRealNameAuth);
            });
        }
    }

    componentWillUnmount(){
        if(this.listener){
            this.listener.remove();
        }
    }

    _getScanView(){
        if(this.props.noShowRightImage){
            return <View style={{width:50}}/>;
        }else{
            return <View>
                <TouchableOpacity
                    activeOpacity={0.7}//点击时的透明度
                    onPress={() => {
                        NativeModules.InteractionModule.openScanQRCode()
                    }}>
                    <Image style={{width: 25, height: 25,margin:10,marginTop:15,}} resizeMode={Image.resizeMode.contain} source={ic_scan}/>
                </TouchableOpacity>
            </View>
        }

    }
    _getLeftView(){
        if(this.props.isSearch){
            return <TouchableOpacity onPress={()=> this.props.dispatch(goBack())} style={{padding: 15}}>
                <Image style={{width: 15, height: 15,}} resizeMode={Image.resizeMode.contain} source={whiteBackIco}/>
            </TouchableOpacity>;
        }else{
            return <Image style={{width: 32, height: 32,margin:10,}} resizeMode={Image.resizeMode.contain} source={ic_search_left}/>
        }
    }

    _getClickContent(){
        return <TouchableOpacity
            style={{
                flex: 1,
                height: 35,
                justifyContent: 'center'
            }}
            activeOpacity={0.7}//点击时的透明度
            onPress={() => {
                this.props.dispatch(goto('SearchGoods'))
            }}>
            <View style={{
                height:35,
                flexDirection: 'row',
                alignItems: 'center',
                borderBottomWidth: 0.5,
                paddingBottom: 5,
                paddingRight: 10,
                borderBottomColor: '#FFF'
            }}>
                <Image
                    source={ic_search}
                    resizeMode={'contain'}
                    style={{height: 20, width: 20}}
                />
                <Text numberOfLines={1} style={{color: '#FFF', fontSize: 14, marginLeft: 5}}>请输入您需要搜索的商铺或商品名称</Text>
            </View>
        </TouchableOpacity>
    }

    _getInputContent(){
        return <TouchableOpacity
            style={{
                flex: 1,
                height: 50,
                // marginLeft: 20,
                // marginRight: 50,
                justifyContent: 'center'
            }}
            activeOpacity={0.7}>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderBottomWidth: 0.5,
                marginBottom: 5,
                paddingRight: 10,
                justifyContent:'center',
                borderBottomColor: '#FFF'
            }}>
                <TouchableOpacity activeOpacity={0.7}>
                    <Image
                        source={ic_search}
                        resizeMode={'contain'}
                        style={{height: 20, width: 20}}
                    />
                </TouchableOpacity>
                <TextInput style={{fontSize: 14, marginLeft: 5, height: 35, flex: 1, color: '#FFF',padding:0}}
                           placeholder='填写您要搜索的商品名称'
                           placeholderTextColor={'white'}
                           defaultValue={this.state.value}
                           onChangeText={(text) => {
                               this.setState({value: text})}}
                           clearButtonMode={'always'}
                           underlineColorAndroid={'transparent'}
                           onSubmitEditing={(event) => {this.props.getSearchText(event.nativeEvent.text),this.setState({value:''})}}
                />
            </View>
        </TouchableOpacity>
    }

    render() {
        return (
            <View style={{
                height: isIphoneX() ? (topValue + titleBarHeight) : (titleBarHeight + defaultTop),
                paddingTop: (isIphoneX() ? topValue : defaultTop),
                backgroundColor: mainColor,
                flexDirection: 'row',
                alignItems: 'center',
            }}>
                {this._getLeftView()}
                {this.props.isSearch?this._getInputContent():this._getClickContent()}
                {this._getScanView()}
            </View>
        )
    }
}

selector = (state) => {
    return {
        token: state.loginStore.token,
        isRealNameAuth:state.loginStore.otherConfig.isRealNameAuth,
    }
};

export default connect(selector)(SearchView)
