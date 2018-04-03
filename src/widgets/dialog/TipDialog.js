import React, {Component} from 'react';
import {
    View, TouchableOpacity, StyleSheet, Modal, Text, Dimensions
} from 'react-native';

import {placeholderTextColor, titleTextColor} from "../../constraint/Colors";

const width = Dimensions.get('window').width;

class TipDialog extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
        };
    }

    static defaultProps = {
        dialogMessage: '',
        cancelBtnText: '取消',//取消按钮
        confirmBtnText: '确定',//确定按钮
        onClickConfirm: null,//func callback
        onClickCancel: null,//func callback
        hideCancelBtn:false,
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
                <View style={styles.itemP}>
                    <Text style={{
                        flex: 1,
                        color:titleTextColor,
                        textAlign: 'center',
                        fontSize: 18,
                        fontWeight: 'bold',
                    }}
                          numberOfLines={2}>{dialogMessage}</Text>
                </View>

                <View style={{width: width*0.7, height: 0.5, backgroundColor: placeholderTextColor}}/>

                <View style={{flexDirection: 'row'}}>
                    {this.props.hideCancelBtn?null:<TouchableOpacity
                        style={styles.buttonStyle}
                        activeOpacity={0.7}
                        onPress={() => {
                            if (onClickCancel) onClickCancel();
                            this.dismiss();
                        }}>
                        <Text style={styles.textStyle}>{cancelBtnText}</Text>
                    </TouchableOpacity>}
                    {this.props.hideCancelBtn?null:<View style={{width: 0.5, backgroundColor: placeholderTextColor}}/>}
                    <TouchableOpacity
                        style={styles.buttonStyle}
                        activeOpacity={0.7}
                        onPress={() => {
                            if (onClickConfirm) onClickConfirm();
                            this.dismiss();
                        }}>
                        <Text style={styles.textStyle}>
                            {confirmBtnText}
                        </Text>
                    </TouchableOpacity>
                </View>


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
        backgroundColor: '#ffffff',
        width:width*0.75,
        borderWidth: 0.5,
        borderColor: placeholderTextColor,
        borderRadius: 10,
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