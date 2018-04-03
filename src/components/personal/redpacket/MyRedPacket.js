import React, {Component} from 'react'
import TitleBar from "../../../widgets/TitleBar";
import {View} from "react-native";
import ScrollableTabView from "react-native-scrollable-tab-view";
import TabViewBar from '../../common/TabViewBar'
import TaskBouns from './TaskBonus';
import RedPacketList from './RedPacketList';
import {mainBackgroundColor} from "../../../constraint/Colors";
import {CONSUMER_COUPON_ACCOUNT, ENTREPRENEURSHIP_COUPON_ACCOUNT} from "../../../constraint/AssetsType";
import {connect} from "react-redux";
import {isSuccess, isTokenInvalid, post} from "../../../common/CommonRequest";
import {showLoginInvalidDialog} from "../../../reducers/CacheReducer";
import {showToastShort} from "../../../common/CommonToast";
import EmptyView from "../../common/empty/EmptyView";


class MyRedPacket extends Component {

    constructor(props) {
        super(props);
        this.viewArr = [];
        this.title = '红包';
        this.state={
            title:this.title,
            loading:true,
        }


    }

    componentDidMount(){
        this._checkHaveRedPacket();
    }

    /**
     * 检查是否存在红包
     * @private
     */
    _checkHaveRedPacket(){
        post('main/checkSundryRedPackage',{token:this.props.token},true)
            .then((responseData) => {
                if(isSuccess(responseData)) {
                    this._getContentView(responseData.result.task,responseData.result.entrepreneurship,responseData.result.consumer);
                    this.setState({
                        loading: false,
                    });
                }else if(isTokenInvalid(responseData)){
                    this.props.dispatch(showLoginInvalidDialog(true,true));
                }else{
                    showToastShort(responseData)
                }
            }).catch(e=>{
                showToastShort(e);
        });
    }

    _getContentView(haveTask,haveEntrepreneurship,haveConsumer){
        if(haveTask) {
            this.title = '任务红包';
            this.viewArr.push(<TaskBouns key={'Task'} tabLabel='任务红包'/>)

        }
        if(haveConsumer) {
            this.title = '消费红包';
            this.viewArr.push(<RedPacketList key={'Consumer'} tabLabel='消费红包' type={CONSUMER_COUPON_ACCOUNT}/>);

        }
        if(haveEntrepreneurship){
            this.title = '创业红包';
            this.viewArr.push(<RedPacketList key={'Entrepreneurship'} tabLabel='创业红包' type={ENTREPRENEURSHIP_COUPON_ACCOUNT}/>);
        }

        if(this.viewArr.length === 1){
            this.setState({title:this.title});
        }
    }


    _renderContentView(){
        if(this.state.loading)return null;
        if(this.viewArr.length === 0)return <EmptyView emptyTip='您没有任何红包数据' showRecommended={false}/>;
        else if(this.viewArr.length === 1)return this.viewArr[0];
        else {
            return <ScrollableTabView
                ref='ScrollableTabView'
                initialPage={0}
                renderTabBar={() => <TabViewBar isShowLine={false}/>}>
                {this.viewArr}
            </ScrollableTabView>
        }
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: mainBackgroundColor}}>
                <TitleBar title={this.state.title}/>
                {this._renderContentView()}
            </View>
        );
    }
}
selector=(state)=>{
    return {
        token:state.loginStore.token
    }
};
export default connect(selector)(MyRedPacket);