import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity
} from 'react-native';

import {connect} from 'react-redux';
import TitleBar from '../../../widgets/TitleBar';
import {mainBackgroundColor, mainColor, contentTextColor, placeholderTextColor} from "../../../constraint/Colors";
import RechargeRecordView from './RechargeRecordView'
import {showToastShort} from "../../../common/CommonToast";
class RechargeRecord extends Component {

    render() {
        return (
            <View style={{backgroundColor: mainBackgroundColor, flex: 1}}>
                <TitleBar title={'充值记录'}/>
                <View style={{
                    flexDirection: 'row',
                    backgroundColor: 'white',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {/*{this.tabBarItem("话费充值记录")}*/}
                    {/*<View style={styles.line}/>*/}
                    {/*{this.tabBarItem("油卡充值记录")}*/}
                </View>
                <RechargeRecordView/>
            </View>
        )
    }

    itemPress(tabName) {
        if (tabName === "油卡充值记录") {
            showToastShort("暂未开放，敬请期待")
        }
    }

    tabBarItem(tabName) {
        let lineView = tabName === "话费充值记录" ? (<View style={styles.mainLine}/>) : (null);
        return <View style={{height: 47, alignItems: 'center', justifyContent: 'center', flex: 1}}>
            <TouchableOpacity style={styles.titleLayout} onPress={() => this.itemPress(tabName)} activeOpacity={0.7}>
                <Text style={{fontSize:15, color: tabName === "话费充值记录" ? mainColor : contentTextColor}}>{tabName}</Text>
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
        width: 100,
        height: 3,
        backgroundColor: mainColor
    }
});

export default connect()(RechargeRecord)