import React, {Component} from 'react';
import {
    View, StyleSheet, ScrollView, Image, Dimensions, Text, FlatList, ImageBackground,
    TouchableOpacity
} from 'react-native';
import TitleBar from "../../widgets/TitleBar";
import {
    content2TextColor, contentTextColor, mainBackgroundColor, mainColor,
    placeholderTextColor
} from "../../constraint/Colors";
import {ic_colored_tape, ic_fill, logistics_box} from "../../constraint/Image";
import {connect} from "react-redux";
import {isSuccess, post} from "../../common/CommonRequest";
import {showToastShort} from "../../common/CommonToast";
import LoadingView from "../../widgets/LoadingView";
import RequestErrorView from "../../widgets/RequestErrorView";
import XImage from "../../widgets/XImage";

const {width, height} = Dimensions.get('window');
/**
 * 物流信息：传入参数：orderId
 */
class LogisticsMsg extends Component {

    _keyExtractor = (item, index) => index;
    _keyExtractor1 = (item, index) => index;

    constructor(props) {
        super(props);
        this.state = {
            isLoading:true,
            isRequestError: false,
            selectIndex:0,
            data:[]
        }
    }
    componentDidMount(){
        this._getLogistics();
    }

    _getLogistics() {
        let orderId = this.props.navigation.state.params? this.props.navigation.state.params : undefined;//测试数据'N20171226193830908619840'
        let requestObj = {'orderId': orderId, 'token': this.props.token};
        post('order/getLogistics', requestObj)
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    this.setState({
                        data: responseData.result,
                        isLoading:false,
                        isRequestError: false,
                    });
                } else{
                    this._errorMsg(responseData?responseData.message:"请求出现异常");
                }
            }).catch((e) => {
            this._errorMsg(e.message);
        });
    }
    _errorMsg(msg) {
        this.setState({
            isLoading: false,
            isRequestError: true,
        });
        showToastShort(msg);
    }
    render() {
        return (
            <View style={{flex: 1}}>
                <TitleBar isWhiteBackIco={true} title={'物流信息'}/>
                {this.state.isLoading ? <LoadingView/> :this.showView() }
            </View>
        );
    }

    showView() {
        return (
            this.state.isRequestError ? (
                <RequestErrorView onPress={() =>{
                    this.setState({isRequestError: false, isLoading: true},()=>{
                        this._getLogistics();
                    });
                }}/>
            ) : (
                <View style={{flex: 1}}>
                    <View style={[styles.product, {display: this.state.data.length === 1 ? 'none' : 'flex'}]}>
                        <FlatList
                            showsHorizontalScrollIndicator={false}
                            horizontal={true}
                            data={this.state.data}
                            extraData={this.state.selectIndex}
                            keyExtractor={this._keyExtractor1}
                            renderItem={({item, index}) =>
                                <TouchableOpacity
                                    style={[styles.imgViewF, {borderColor: this.state.selectIndex === index ? mainColor : '#c7c7c7',}]}
                                    onPress={() => {
                                        if (this.state.selectIndex !== index) this.setState({selectIndex: index})
                                    }}
                                    activeOpacity={0.8}>
                                    <Image source={{uri: item.productImg}} style={styles.imgF}/>
                                </TouchableOpacity>
                            }
                        />
                    </View>
                    {this.msgView()}
                </View>)
        );
    }

    msgView() { //物流详情
        let itemData = this.state.data[this.state.selectIndex];
        return <View style={{flex: 1, backgroundColor: mainBackgroundColor}}>
            <View style={styles.container}>
                <View style={{flexDirection: 'row'}}>
                    <View style={styles.imgView}>
                        <Image source={{uri: itemData.productImg}} style={styles.img}/>
                    </View>
                    <View style={{justifyContent: 'center', marginLeft: 138, height: 120,}}>
                        <Text style={styles.txt}>物流状态：{itemData.pushStatus}</Text>
                        <Text style={styles.txt}>物流公司：{itemData.expressName}</Text>
                        <Text style={styles.txt}>快递单号：{itemData.trackingNumber}</Text>
                    </View>
                </View>
                <View style={{height: 0.5, marginTop: 18, marginBottom: 18, backgroundColor: placeholderTextColor}}/>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={itemData.expressContentList}
                    keyExtractor={this._keyExtractor}
                    renderItem={({item, index}) =>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{width: 25, alignItems: 'center', justifyContent: 'center'}}>
                                <View style={[styles.line, {backgroundColor: index === 0 ? '#fff' : placeholderTextColor}]}/>
                                {index === 0 ?<XImage style={{margin:3,height:16,width:16}} source={ic_fill}/>:<View style={styles.dot}/>}
                                <View style={[styles.line, {backgroundColor: index === itemData.expressContentList.length - 1 ? '#fff' : placeholderTextColor}]}/>
                            </View>
                            <View style={{paddingTop: 10, paddingBottom: 10, paddingRight: 0,flex: 1,}}>
                                <ImageBackground
                                    resizeMode='stretch'
                                    source={logistics_box}
                                    style={{padding:5,paddingRight:0,justifyContent: 'center'}}>
                                    <Text
                                        numberOfLines={2}
                                        style={[styles.msg, {color: index === 0 ? mainColor : content2TextColor}]}>{item.context}</Text>
                                    <Text
                                        style={[styles.msg, {color: index === 0 ? mainColor : content2TextColor}]}>{item.logTime}</Text>
                                </ImageBackground>
                            </View>
                        </View>
                    }
                />
            </View>
            <View style={styles.tape}>
                <Image source={ic_colored_tape} style={{resizeMode: 'contain', height: 60, width: 60}}/>
            </View>
        </View>;
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        shadowColor: 'gray',
        shadowOffset: {height: 2, width: 2},
        shadowRadius: 3,
        shadowOpacity: 0.2,
        elevation: 2,
        margin: 18,
        padding: 20,
        borderRadius: 8,
    },
    product: {
        backgroundColor:'#fff',
        justifyContent: 'center',
        padding:10,
    },
    tape: {
        position: 'absolute',
        height: 60,
        width: 60,
        marginLeft: width - 73,
        elevation: 2,
        marginTop: 14,
    },
    txt: {
        color: contentTextColor,
        fontSize: 14,
        padding: 6,
    },
    msg: {
        color: mainColor,
        fontSize: 13,
        padding: 5,
        paddingLeft:20,
        backgroundColor:'transparent'
    },
    imgF: {
        height: 86,
        width: 86,
        borderRadius: 6,
        resizeMode: 'contain'
    },
    imgViewF: {
        height: 90,
        width: 90,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#c7c7c7',
        justifyContent: 'center',
        alignItems: 'center',
        margin:10,
    },
    img: {
        height: 120,
        width: 120,
        borderRadius: 8,
        resizeMode: 'contain',
    },
    imgView: {
        height: 120,
        width: 120,
        position: 'absolute',
        borderRadius: 8,
        borderWidth: 0.5,
        borderColor: '#c7c7c7',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'gray',
        shadowOffset: {height: 2, width: 2},
        shadowRadius: 3,
        shadowOpacity: 0.4,
        elevation: 5,
        backgroundColor:'#fff'
    },
    dot:{
        height: 10,
        width: 10,
        backgroundColor:placeholderTextColor,
        margin:3,
        borderRadius: 5,
    },
    line:{
        width:2,
        flex:1,
        backgroundColor:placeholderTextColor
    }
});
selector = (state) =>{
    return {
        token:state.loginStore.token,
    }
};
export default connect(selector)(LogisticsMsg);