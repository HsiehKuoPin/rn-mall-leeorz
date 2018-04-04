import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
} from 'react-native';

import {
    mainBackgroundColor, contentTextColor, content2TextColor, mainColor, priceColor
} from "../../../constraint/Colors";
import {BALANCE_ACCOUNT} from "../../../constraint/AssetsType";
import {connect} from 'react-redux'
import TitleBar from '../../../widgets/TitleBar';
const {width} = Dimensions.get('window');
import XImage from '../../../widgets/XImage';
import {ic_red_envelopes} from "../../../constraint/Image";
import {goto} from "../../../reducers/RouterReducer";
import RedEnvelopesDetailed from '../redEnvelopes/RedEnvelopesDetailed'
import {post, isSuccess} from "../../../common/CommonRequest";
import {showToastShort} from "../../../common/CommonToast";
import RequestErrorView from '../../../widgets/RequestErrorView';


class TaskBonus extends Component {

    constructor(props){
        super(props);
        this.state = {
            data:'',
            isRequestError: false,
            isLoading: true,
        };
    }

    componentDidMount() {
        this.loadAssignmentRedPackage()
    }

    loadAssignmentRedPackage() {
        post('main/assignmentRedPackage', {token: this.props.token})
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    this.setState({
                        isLoading: false,
                        isRequestError: false,
                        data:responseData.result
                    })
                } else {
                    this._errorMsg("请求出现异常");
                }
            }).catch((e) => {
            this._errorMsg(e.message);
        });
    }

    _errorMsg(msg) {
        this.setState({
            isRequestError: true,
            isLoading: false,
        });
        showToastShort(msg);
    }

    render() {

        let showView = this.state.isRequestError ? (
            <RequestErrorView onPress={() => {
                this.setState({isRequestError: false, isLoading: true,});
                this.loadAssignmentRedPackage();
            }}/>
        ) :(
            <View style={styles.container}>

                <RedEnvelopesAccount data={this.state.data}/>
                <RedEnvelopesDetailed/>
            </View>
        );

        return (
            <View style={styles.container}>
                {/*<TitleBar title={'任务红包'}*/}
                          {/*hideRight={false}*/}
                          {/*customRightView={() => (*/}
                              {/*<TouchableOpacity activeOpacity={0.7} onPress={() => {*/}
                                  {/*this.props.dispatch(goto('PaymentsBalance',{assetType: BALANCE_ACCOUNT}))*/}
                              {/*}}>*/}
                                  {/*<Text style={{color:'white'}}>{'查看余额'}</Text>*/}
                              {/*</TouchableOpacity>*/}
                          {/*)}*/}
                {/*/>*/}
                {/*{this.state.isLoading ? <LoadingView/> : showView}*/}
                {showView}
            </View>
        )
    }
}

class RedEnvelopesAccount extends Component {
        render (){
            let data = this.props.data;
            return (
                <View style={[styles.cellStyle,styles.shadowStyle]}>
                    <View style={{marginTop:20, marginBottom:20,marginRight:10,flexDirection:'row'}}>
                        <XImage source={ic_red_envelopes} style={{resizeMode:'contain',marginLeft:20, alignSelf:'center',width:80,height:120}} />
                        <View style={{marginLeft:20, marginRight:100,alignSelf:'center'}}>
                            <Text style={{color:contentTextColor,fontSize:17, marginBottom:10,}} numberOfLines={2}>{'本月共领红包 '}
                            <Text style={{color:mainColor}}>{data.redPkNumber+'个'}</Text>
                                <Text style={{color:contentTextColor}}>{' 共 '}</Text>
                                <Text style={{color:mainColor}}>{data.redPkAmount+'元'}</Text>
                            </Text>

                            <Text style={{color:content2TextColor,fontSize:14, marginBottom:10}} numberOfLines={2}>{'消费额 '}
                            <Text style={{color:mainColor}}>{data.consume}</Text>
                                <Text style={{color:contentTextColor}}>{' 达标 '}</Text>
                                <Text style={{color:mainColor}}>{data.standard}</Text>
                            </Text>

                            <Text style={{color:content2TextColor,fontSize:14}} numberOfLines={2}>{data.lastday}<Text style={{color:content2TextColor}}>{'前提货额'}</Text><Text style={{color:priceColor}}>{'￥'+data.pickGoods}</Text></Text>
                        </View>
                    </View>
                </View>
            )
        }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: mainBackgroundColor
    },
    shadowStyle:{
        backgroundColor:'white',
        borderRadius:5,
        shadowColor: 'gray',
        shadowOffset: {height: 2, width: 2},
        shadowRadius: 3,
        shadowOpacity: 0.2,
        elevation: 2
    },
    cellStyle:{
        marginTop:10,
        width:width-20,
        marginLeft:10,
    },
});

selector = (state) => {
    return {
        token: state.loginStore.token,
    }
};

export default connect(selector) (TaskBonus);
