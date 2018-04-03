import React, {Component} from 'react';
import {View, Text, StyleSheet,Dimensions} from "react-native";
import {CommonStyles} from "../../styles/CommonStyles";
import {mainBackgroundColor, titleTextColor} from "../../constraint/Colors";
import TitleBar from "../../widgets/TitleBar";
import connect from "react-redux/es/connect/connect";

/**
 * 实名认证信息
 */
class RealAuthInfo extends Component {


    render() {
        return (

            <View style={{backgroundColor: mainBackgroundColor, flex: 1}}>
                <TitleBar title={'个人认证信息'} hideRight={true}/>
                <View style={styles.container}>
                    <View style={styles.item}>
                        <Text style={styles.itemLeft}>真实姓名</Text>
                        <Text style={styles.itemRight}>{this.props.userInfo.realName}</Text>
                    </View>
                    {/*<View style={[CommonStyles.vline,{width:Dimensions.get('window').width - 50}]}/>*/}
                    {/*<View style={styles.item}>*/}
                        {/*<Text style={styles.itemLeft}>身份证号</Text>*/}
                        {/*<Text style={styles.itemRight}>真实姓名</Text>*/}
                    {/*</View>*/}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        margin:10,
        borderRadius: 5,
        paddingHorizontal:15,
        backgroundColor:'white',
        shadowColor: 'gray',
        shadowOpacity: 0.2,
        shadowOffset: {height: 2, width: 2},
        shadowRadius: 3,
        elevation: 2
    },
    item:{
        flexDirection:'row',
        height:40,
        justifyContent:'center',
        alignItems:'center',
    },
    itemLeft:{
        alignItems:'center',
        justifyContent: 'center',
        fontWeight:'bold',
        fontSize:14,
        color: titleTextColor
    },
    itemRight:{
        paddingLeft:20,
        flex:1,
        alignItems:'center',
        justifyContent: 'center',
        color: titleTextColor
    },
});

selector = (state) => {
    return {
        token: state.loginStore.token,
        userInfo: state.userInfoStore.userInfo,
    }
};

export default connect(selector)(RealAuthInfo)