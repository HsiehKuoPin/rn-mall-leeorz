import React, {Component} from 'react';
import {
    View, TouchableOpacity, StyleSheet, Modal, Text, Dimensions, Animated, Image, ActivityIndicator
} from 'react-native';

import {placeholderTextColor,titleTextColor,contentTextColor} from "../constraint/Colors";
import {getRegisterQRCode} from "../common/QRcodeUtil";
import {getHost} from "../common/CommonRequest";

const {width, height} = Dimensions.get('window');

export default class ScanRegistration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
            isLoadingQRCode:true,
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
                <Modal
                    transparent={true}
                    visible={this.state.isVisible}
                    animationType={'fade'}
                    onRequestClose={() => this.dismiss()}>
                    <TouchableOpacity style={styles.container} activeOpacity={1}>
                        {this.renderDialog()}
                    </TouchableOpacity>
                </Modal>

        );
    }
    renderDialog() {
        return (
            <View style={styles.containerView}>
                <Animated.View style={styles.mask}>
                    <Text style={styles.mask} onPress={this.dismiss.bind(this)}/>
                </Animated.View>
            <View style={{width:width-120,height:300,marginLeft:60,marginRight:60,backgroundColor:'white',borderRadius:5,alignItems:'center',marginTop:(height-300)/2}}>
                <Text style={{fontSize:18,color:titleTextColor,marginTop:20}}>{'扫码注册'}</Text>
                <Text style={{marginLeft:10,
                    marginRight:10,width:width-140,height:0.5,backgroundColor:placeholderTextColor, marginTop:20}}/>
                <View style={{
                    width:170,
                    height:170,
                    padding:5,
                    alignItems:'center',
                    justifyContent:'center',
                    marginHorizontal:15,marginTop:15}}>

                    {this.state.isLoadingQRCode?
                        <ActivityIndicator
                            animating={true}
                            size="large"
                        />:null}
                    <Image
                        onLoad={()=>{this.setState({isLoadingQRCode:false})}}
                        style={{width:165,height:165,position:'absolute'}}
                        source={{uri:getHost() + 'main/getQRCode?width=300&height=300&content=' + encodeURIComponent(getRegisterQRCode(this.props.memberId))}}
                    />
                </View>
                <Text style={{color:contentTextColor, marginTop:10}}>{'立即成为会员'}</Text>
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
    containerView: {
        position: "absolute",
        height: height,
    },
    mask: {
        justifyContent: "center",
        backgroundColor: "#383838",
        opacity: 0.3,
        position: "absolute",
        width: width,
        height: height,
    },
});

