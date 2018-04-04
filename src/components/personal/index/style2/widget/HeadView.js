import React, {Component} from 'react';
import {
    Image,
    Text,
    View,
    StyleSheet,
    Dimensions, TouchableOpacity
} from 'react-native';
import {
    ic_circle_logo, ic_authentication, ic_p_chuangke, ic_p_store
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
        return (
            <View style={styles.header}>
                    <View style={styles.avatarLayout}>
                        <Image source={ic_default_avatar} style={styles.avatar}/>
                    </View>
                    <Text style={styles.nickName} numberOfLines={1}>{this.props.userInfo.name}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    header: {
        flex: 1,
        position: 'relative',
        alignItems:'center',
        justifyContent:'center',
        marginTop:-50,
        marginBottom:10,
    },
    avatarLayout: {
        backgroundColor:'white',
        borderColor: mainColor,
        borderWidth: 3,
        borderRadius: 82/2,
        width: 82,
        height: 82,
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
        marginTop:10,
        color: 'black',
        fontSize: 16,
        backgroundColor:'#00000000',
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