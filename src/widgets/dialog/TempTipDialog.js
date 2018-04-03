import React, {Component} from 'react';
import {
    View, TouchableOpacity, StyleSheet, Modal, Text, Dimensions
} from 'react-native';

import {placeholderTextColor, titleTextColor} from "../../constraint/Colors";
import XImage from "../XImage";

const width = Dimensions.get('window').width;

class TipDialog extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isVisible: true,
        };
    }

    static defaultProps = {
        dialogMessage: '',
        onClickConfirm: null,//func callback
        onClickCancel: null,//func callback
    };

    showDialog(){
        this.setState({isVisible: true});
    }

    dismiss() {
        this.setState({isVisible: false});
    }

    renderDialog() {
        let {dialogMessage, cancelBtnText, onClickCancel, onClickConfirm, confirmBtnText} = this.props;
        return (
            <View
                style={styles.modalStyle}>
                <XImage source={{uri:'http://p0xkrqo35.bkt.clouddn.com/1519962991922.png'}} style={{width:width*0.7,height:width*0.7}}/>
                    <Text style={{
                        color:'white',
                        textAlign: 'center',
                        fontSize: 14,
                    }}
                          numberOfLines={2}>服务更新升级中,为您带来不便,敬请谅解！！！</Text>

            </View>
        )
    }

    render() {

        return (
            <View style={{flex: 1}}>
                <Modal
                    transparent={true}
                    visible={this.state.isVisible}
                    animationType={'fade'}
                    onRequestClose={() => {
                    }}>
                    <View style={styles.container}>
                        {this.renderDialog()}
                    </View>
                </Modal>
            </View>
        );
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
        width:width*0.8,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    },
    itemP: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal:5,
        paddingVertical:20,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    buttonStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 40
    },
    textStyle: {
        fontSize: 16,
        color: '#236DFB'
    }
});

export default TipDialog;