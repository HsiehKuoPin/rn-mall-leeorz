import React, {Component} from 'react';
import {View, TouchableOpacity, StyleSheet, Dimensions, Modal, Text, Image} from 'react-native';
import {
    content2TextColor, contentTextColor, mainBackgroundColor, mainColor,
    titleTextColor
} from "../../../constraint/Colors";

const {width, height} = Dimensions.get('window');
export default class ContentTipDialog extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
        };
    }

    dismiss() {
        this.setState({
            isVisible: false
        });
    }

    show() {
        this.setState({
            isVisible: true
        });
    }

    render() {
        return (
            <View style={{display:this.state.isVisible?'flex':'none'}}>
                <Modal
                    transparent={true}
                    visible={this.state.isVisible}
                    animationType={'fade'}
                    onRequestClose={() => {
                    }}>
                    <TouchableOpacity style={styles.container} activeOpacity={1}>
                        {this.renderDialog()}
                    </TouchableOpacity>
                </Modal>
            </View>
        );
    }

    renderDialog() {
        return (
            <View style={styles.modalStyle}>
                <Text style={styles.txtTitle}>提 示</Text>
                <Text style={styles.txtContent}>您的注册资格不足，是否前往购买？</Text>
                <View style={{flexDirection:'row',marginBottom:10}}>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={styles.txtCommit}
                        onPress={() => this.dismiss()}>
                        <Text style={{fontSize: 18, color: content2TextColor}}>取 消</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={[styles.txtCommit,{backgroundColor:mainColor,marginLeft:20}]}
                        onPress={this.props.onConfirm}>
                        <Text style={{fontSize: 18, color: '#fff'}}>确 定</Text>
                    </TouchableOpacity>
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
        elevation: 5,
    },
    modalStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        marginHorizontal: width/8,
        borderRadius: 8,
        padding:20,
    },
    txtTitle: {
        color: titleTextColor,
        fontSize: 18,
        marginTop:10,
    },
    txtContent: {
        color: contentTextColor,
        fontSize: 16,
        marginVertical:20,
    },
    txtCommit: {
        backgroundColor: mainBackgroundColor,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        paddingVertical:10,
        flex:1,
    },
});