import React, {Component} from 'react';
import {View, TouchableOpacity, StyleSheet, Dimensions, Modal, Text, TextInput} from 'react-native';
import {contentTextColor, mainBackgroundColor, mainColor, placeholderTextColor, titleTextColor} from "../../../constraint/Colors";
import {showToastShort} from "../../../common/CommonToast";
import {checkInputLegal} from "../../../common/StringUtil";

const {width, height} = Dimensions.get('window');
export default class RecommendDialog extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
            inputValue:''
        };
    }

    dismiss() {
        this.setState({
            isVisible: false,
        });
    }

    show() {
        this.setState({
            isVisible: true,
            inputValue:''
        });
    }
    _onPressConfirm(){
        if (this.refs.textInput.isFocused()&&this.state.inputValue !== ''){
            this.onBlur();
        }else if (this.state.inputValue ===''){
            showToastShort("您还没输入推荐人...")
        }else if (this.props.referrer===''){
            showToastShort("请输入正确的推荐人...")
        }else {
            this.props.confirm()
        }
    }
    render() {
        return (
            <View style={{position: 'absolute'}}>
                {
                    !this.state.isVisible ? null :
                        <TouchableOpacity style={styles.container} activeOpacity={1} onPress={() => this.dismiss()}>
                            {this.renderDialog()}
                        </TouchableOpacity>
                }
            </View>
        );
    }

    renderDialog() {
        return (
            <TouchableOpacity style={styles.modalStyle} activeOpacity={1}
                              onPress={() => {if (this.refs.textInput.isFocused())this.onBlur()}}>
                <View style={styles.inputLayout}>
                    <Text style={styles.holderText}>推荐人：</Text>
                    <TextInput
                        ref="textInput"
                        maxLength={16}
                        placeholder={'填写推荐人的手机号码或用户名'}
                        placeholderTextColor={placeholderTextColor}
                        underlineColorAndroid={'transparent'}
                        style={styles.inputText}
                        value={this.state.inputValue}
                        onChangeText={(inputValue) => this.setState({inputValue})}
                    />
                </View>
                <View style={styles.inputLayout}>
                    <Text style={styles.holderText}>推荐人用户名：</Text>
                    <Text style={[styles.holderText,{marginLeft:5,flex:1}]}>{this.props.referrer}</Text>
                </View>
                <TouchableOpacity activeOpacity={0.7} style={{backgroundColor: mainColor, width: width - 20 - 40}}
                                  onPress={() => this._onPressConfirm()}>
                    <Text style={{color:'white',paddingVertical:12,textAlign:'center',fontSize:17}}>{'确定'}</Text>
                </TouchableOpacity>
            </TouchableOpacity>
        )
    }

    onBlur() {
        this.refs.textInput.blur();
        if (this.state.inputValue === '') {
            // showToastShort("您还没输入推荐人...")
        } else if (this.state.inputValue.length < 2) {
            showToastShort("用户名要在2~16个字符之间哦...")
        } else if (checkInputLegal(this.state.inputValue)){
            showToastShort('您输入的用户名有误,请重新输入');
            this.setState({inputValue: ''})
        } else {
            this.props.onEnd(this.state.inputValue);
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        // position:'absolute',
        height:height,
        width:width,
    },
    modalStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        marginHorizontal: 10,
        borderRadius: 8,
        padding:20,
    },
    inputLayout:{
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        paddingBottom: 5,
    },
    holderText: {
        color: titleTextColor,
        fontSize: 16,
        padding:0,
    },
    inputText: {
        fontSize: 16,
        flex: 1,
        height: 40,
        backgroundColor:mainBackgroundColor,
        borderRadius:6,
        borderColor:placeholderTextColor,
        padding:0,
        paddingLeft:10,
        borderWidth:0.5,
        marginLeft:5,
    },
});