import React, {Component} from 'react';
import {View, TouchableOpacity, StyleSheet, Dimensions, Modal, Text, Image, NativeModules} from 'react-native';
import {contentTextColor, mainColor, titleTextColor} from "../../constraint/Colors";
import {dialog_close, dialog_login_rocket} from "../../constraint/Image";
import connect from "react-redux/es/connect/connect";
import {showLoginInvalidDialog} from "../../reducers/CacheReducer";
import {clearShoppingCart, clearShoppingCartProductTotalCount} from "../../reducers/ShoppingCartReducer";
import {clearToken} from "../../reducers/LoginReducer";
import {clearUser} from "../../reducers/UserInfoReducer";

const {width, height} = Dimensions.get('window');
class LoginInvalidDialog extends Component {
    constructor(props) {
        super(props);
    }


    componentWillReceiveProps(nextProps) {
        // console.warn(JSON.stringify(nextProps));
    }


    _clearAllUserData(){
        let {dispatch} = this.props;
        dispatch(clearShoppingCartProductTotalCount());
        dispatch(clearToken());
        dispatch(clearUser());
        dispatch(clearShoppingCart());
        if(NativeModules.GFCJPushModule)NativeModules.GFCJPushModule.clearAlias();
    }

    render() {
        let {visible,title,forceLogout} = this.props.loginInvalidDialog;
        return (

                <Modal
                    transparent={true}
                    visible={visible}
                    animationType={'fade'}
                    onRequestClose={() => {}}>
                    <TouchableOpacity style={styles.container} activeOpacity={1}>
                        {this.renderDialog(title,forceLogout)}
                    </TouchableOpacity>
                </Modal>

        );
    }

    renderDialog(title,forceLogout) {
        return (
            <View style={styles.modalStyle}>
                <View style={styles.contentView}>
                    <View style={{flexDirection: 'row'}}>
                        <View style={{flex: 1}}/>
                        <TouchableOpacity
                            style={styles.closeTouch}
                            activeOpacity={0.7}
                            onPress={() => {
                                if(forceLogout){
                                    this.props.goto();
                                }
                                this._clearAllUserData();
                                this.props.dispatch(showLoginInvalidDialog(false));

                            }}
                        >
                            <Image source={dialog_close} style={{resizeMode: 'contain', width: 40, height: 40}}/>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.txtTitle}>{title}</Text>
                    <Text style={styles.txtContent}>您好，请登录后再操作</Text>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={styles.txtCommit}
                        onPress={() => {
                            this.props.goto();
                            this._clearAllUserData();
                            this.props.dispatch(showLoginInvalidDialog(false));
                        }}>
                        <Text style={{fontSize: 18, color: '#fff'}}>前 往 登 录</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.imgRocket}>
                    <Image source={dialog_login_rocket}
                           style={{resizeMode: 'contain', width: width / 3, height: width / 3}}/>
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalStyle: {
        position: "absolute",
        backgroundColor: 'transparent',
        marginLeft: 18,
        marginRight: 18,
        borderRadius: 8,
    },
    imgRocket: {
        position: "absolute",
        elevation: 6,
        width: width / 3,
        height: width / 3,
        marginLeft: width / 3 - 18,
    },
    contentView: {
        marginTop: width / 3 * 0.38,
        backgroundColor: '#fff',
        borderRadius: 8,
        width: width - 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeTouch: {
        marginRight: 20,
        marginTop: 10,
    },
    txtTitle: {
        color: titleTextColor,
        fontSize: 18,
        margin: 10,
        marginTop: width / 3 * 0.62 - 40,
    },
    txtContent: {
        color: contentTextColor,
        fontSize: 16,
    },
    txtCommit: {
        backgroundColor: mainColor,
        width: width * 0.6,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        height: 45,
        marginTop: 30,
        marginBottom: 40,
    },
});
selector = (state) => {
    return {
        loginInvalidDialog:state.cacheStore.loginInvalidDialog,

    }
};
export default connect(selector)(LoginInvalidDialog)