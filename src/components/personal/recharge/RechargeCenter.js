import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

import {connect} from 'react-redux';
import TitleBar from '../../../widgets/TitleBar';
import {mainBackgroundColor, mainColor, placeholderTextColor, contentTextColor} from "../../../constraint/Colors";
import RechargeCenterView from './RechargeCenterView'
import {goto} from '../../../reducers/RouterReducer';
import {showToastShort} from "../../../common/CommonToast";

class RechargeCenter extends Component {

    render() {
        return (
            <View style={{backgroundColor: mainBackgroundColor, flex: 1}}>
                <TitleBar title={'充值中心'} hideRight={false}
                          customRightView={() => (<Text style={{color: 'white', fontSize: 15}}>充值记录</Text>)}
                          onRightViewClick={() => this.props.dispatch(goto('RechargeRecord'))}/>
                <View style={{
                    flexDirection: 'row',
                    backgroundColor: 'white',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {/*{this.tabBarItem("话费充值")}*/}
                    {/*<View style={styles.line}/>*/}
                    {/*{this.tabBarItem("油卡充值")}*/}
                </View>
                <RechargeCenterView/>
            </View>
        )
    }

    itemPress(tabName) {
        if (tabName === "油卡充值") {
            showToastShort("暂未开放，敬请期待")
        }
    }

    tabBarItem(tabName) {
        let lineView = tabName === "话费充值" ? (<View style={styles.mainLine}/>) : (null);
        return <View style={{height: 47, alignItems: 'center', justifyContent: 'center', flex: 1}}>
            <TouchableOpacity style={styles.titleLayout} onPress={() => this.itemPress(tabName)} activeOpacity={0.7}>
                <Text style={{fontSize:15, color: tabName === "话费充值" ? mainColor : contentTextColor}}>{tabName}</Text>
            </TouchableOpacity>
            {lineView}
        </View>;
    }
}

const styles = StyleSheet.create({
    titleLayout: {
        height: 47,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    line: {
        height: 25,
        width: 1,
        backgroundColor: placeholderTextColor,
    },
    mainLine: {
        width: 60,
        height: 3,
        backgroundColor: mainColor
    }
})

export default connect()(RechargeCenter)