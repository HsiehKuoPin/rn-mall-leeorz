import React, {Component} from 'react';
import {
    StyleSheet,
    Platform,
    View,
    TouchableOpacity,
    Text,
    NativeEventEmitter,
    NativeModules, Dimensions, Image
} from "react-native";
import {ic_index_mask, ic_scan, whiteBackIco} from "../../../constraint/Image";
import {isIphoneX} from "react-native-iphone-x-helper";
import {mainColor} from "../../../constraint/Colors";
import {connect} from 'react-redux'
import {goto, goBack} from "../../../reducers/RouterReducer";
import {dealQRCode} from "../../../common/QRcodeUtil";
import XImage from "../../../widgets/XImage";
import EditText from "../../../widgets/edittext/EditText";
import {style_edit_text} from "../../../widgets/edittext/style_edit_text";
import {ic_message, ic_notification, ic_search} from "../../../../resources/index";

/**
 * 搜索栏
 */
const titleBarHeight = 45;
const defaultTop = Platform.OS === 'android' ? 0 : 20;
const topValue = 44;
const {width, height} = Dimensions.get('window');

class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: null,
        };
    }

    componentDidMount() {
        if (NativeModules.InteractionModule) {
            let emitter = new NativeEventEmitter(NativeModules.InteractionModule);
            this.listener = emitter.addListener('QRCode', (result) => {
                dealQRCode(this.props.dispatch, result, this.props.token, this.props.isRealNameAuth);
            });
        }
    }

    componentWillUnmount() {
        if (this.listener) {
            this.listener.remove();
        }
    }

    render() {
        let heightY = isIphoneX() ? (topValue + titleBarHeight) : (titleBarHeight + defaultTop);
        return (
            <View style={{position: 'absolute',}}>
                <View style={{position: 'absolute', backgroundColor: mainColor, width: width, height: heightY,}}
                      opacity={this.props.opacity}/>
                <XImage source={ic_index_mask} style={{
                    position: 'absolute',
                    width: width,
                    height: width * 0.2 + (isIphoneX() ? topValue : 0),
                    resizeMode: 'cover'
                }} opacity={this.props.opacity === 0 ? 1 : 0}/>
                <View
                    style={{
                        height: heightY,
                        paddingTop: (isIphoneX() ? topValue : defaultTop),
                        backgroundColor: 'transparent',
                        flexDirection: 'row',
                        alignItems: 'center',
                        width: width,
                    }}>
                    {
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => this.props.dispatch(goBack())}>
                                <XImage source={null} style={{width: 18, height: 18, margin: 10}}/>
                            </TouchableOpacity>
                    }
                            <EditText
                                customStyle={style_edit_text.rectangle_border}
                                placeholder="请输入要搜索的商品名称"
                                      icon={ic_search}
                                      placeholderTextColor={'white'}
                                      onClick={()=>this.props.dispatch(goto('SearchGoods'))} />

                            <TouchableOpacity
                                style={{width: 48, height: 48}}
                                activeOpacity={0.7}
                                onPress={() => {
                                    if (this.props.token) {
                                        this.props.dispatch(goto('MessageCenter'))
                                    } else {
                                        this.props.dispatch(goto('Login'));
                                    }
                                }}>
                                <Image style={{width: 28, height: 28, margin: 10,}} source={ic_notification}/>
                                <View style={[styles.countView, {display: this.props.msgCount > 0 ? 'flex' : 'none'}]}>
                                    <Text style={styles.count}>{this.props.msgCount}</Text>
                                </View>
                            </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    touchSearch: {
        flex: 1,
        // height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 5,
        // padding:2,
        borderRadius: 15,
        borderWidth: 0,
        marginHorizontal: 10,
        // borderColor:'rgba(255, 255, 255, 0.4)',
        backgroundColor: 'rgba(255, 255, 255, 0.35)',
    },
    countView: {
        minHeight: 16,
        minWidth: 16,
        right: 5,
        top: 5,
        backgroundColor: 'red',
        borderRadius: 8,
        position: 'absolute',
        justifyContent: 'center',
    },
    count: {
        fontSize: 9,
        color: '#ffffff',
        paddingHorizontal: 5,
        backgroundColor: "#00000000"
    },
    title:{
        color:'white',
        fontSize:15,
        textAlign:'center'
    }
});
selector = (state) => {
    return {
        token: state.loginStore.token,
        isRealNameAuth: state.loginStore.otherConfig.isRealNameAuth,
    }
};

export default connect(selector)(SearchBar)
