import React, {Component} from 'react';
import {
    Image,
    Text,
    View,
    StyleSheet,
    Dimensions, TouchableOpacity
} from 'react-native';
import {
    ic_authentication, ic_p_chuangke, ic_p_store
} from "../../../../../constraint/Image";
import {mainColor} from "../../../../../constraint/Colors";
import {connect} from 'react-redux';
import {isIPhone5, isTrue} from "../../../../../common/AppUtil";
import {goto} from "../../../../../reducers/RouterReducer";
import {ic_default_avatar} from "../../../../../../resources/index";

class HeadComponent extends Component {
    constructor(props) {
        super(props);
    }

    _merchantTypeOnPress() {
        if (this.props.userInfo.merchantType === 'MERCHANT_MARKER' || this.props.userInfo.merchantType === 'MERCHANT_FLAGSHIP') {
            this.props.dispatch(goto('EntrepreneurshipFound'));
        }
    }

    render() {
        let authView = !isTrue(this.props.otherConfig.isRealNameAuth) ? (<View/>) : (
            <Image source={ic_authentication} style={{width: 21, height: 18, marginLeft: 10, marginTop: 3}}/>);
        return (
            <View style={styles.header}>
                <View style={{flexDirection: 'row', paddingVertical: 15, paddingLeft: 15, flex: 1,}}>
                    <View style={styles.avatarLayout}>
                        <Image source={ic_default_avatar} style={styles.avatar}/>
                    </View>
                    <View style={{marginHorizontal: 15, justifyContent: 'center', flex: 1}}>
                        <View
                            style={{
                                flexDirection: 'row',
                                flex: 1,
                                marginRight: 20
                            }}>
                            <Text style={styles.nickName}
                                  numberOfLines={1}><Text style={styles.memberGrade}>昵称:</Text>{this.props.userInfo.name}</Text>
                            {authView}
                        </View>
                        <Text style={styles.memberGrade}
                              numberOfLines={1}>会员ID: {this.props.userInfo.memberId}</Text>
                        <Text style={styles.memberGrade}
                              numberOfLines={1}>会员等级: {(this.props.userInfo.memberLevel === undefined) ? '' : this.props.userInfo.memberLevel}</Text>
                    </View>
                    <TouchableOpacity activeOpacity={0.7} style={[styles.icon, {marginRight: 5}]} onPress={() => this._merchantTypeOnPress()}>
                        <Image source={this.props.userInfo.merchantType === 'MERCHANT_MARKER' ? ic_p_chuangke : (this.props.userInfo.merchantType === 'MERCHANT_FLAGSHIP' ? ic_p_store : undefined)} style={styles.icon}/>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#00000000',
        flex: 1,
        flexDirection: 'row',
        position: 'relative'
    },
    avatarLayout: {
        borderColor: mainColor,
        borderWidth: 1,
        borderRadius: 78/2,
        width: 78,
        height: 78,
    },
    avatar: {
        width: 76,
        height: 76,
        borderRadius: 38,
    },
    icon: {
        width: isIPhone5() ? 50 : 70,
        height: isIPhone5() ? 50 : 70,
        alignSelf: 'center',
    },
    nickName: {
        color: 'black',
        fontSize: 16,
    },
    memberGrade: {
        flex: 1,
        color: 'black',
        fontSize: 13,
        marginTop: 2,
    },
});

selector = (state) => {
    return {
        otherConfig: state.loginStore.otherConfig
    }
};

export default connect(selector)(HeadComponent)