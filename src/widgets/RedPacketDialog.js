import React, {Component} from 'react';
import {
    View, TouchableOpacity, StyleSheet, Modal, Dimensions, Image, ImageBackground
} from 'react-native';
import {ic_red_packet_layer, ic_red_packet_cancel, ic_red_packet_envelopes} from '../constraint/Image'
import {goto} from "../reducers/RouterReducer";
import {post, getRequestFailTip, isSuccess} from '../common/CommonRequest';
import {showToastShort} from '../common/CommonToast';

const {width, height} = Dimensions.get('window');
export default class RedPacketDialog extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
        };
    }

    showDialog() {
        this.setState({isVisible: true});
    }

    dismiss() {
        this.setState({isVisible: false});
    }

    gotoRedPacket() {
        post('main/updateRedPackage', {token: this.props.token})
            .then((response) => {
                if (isSuccess(response)) {
                    showToastShort("领取成功!")
                    this.props.dispatch(goto('RedPacket', {redPacketInfo: this.props.redPacketInfo}))
                    this.dismiss()
                } else {
                    showToastShort(getRequestFailTip(response));
                    this.dismiss()
                }
            }).catch((e) => {
            showToastShort(getRequestFailTip());
            console.warn(e.message)
        });
    }

    render() {
        return (
            <Modal
                transparent={true}
                visible={this.state.isVisible}
                animationType={'fade'}
                onRequestClose={() => {
                }}>
                <View style={styles.container}>
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        <ImageBackground source={ic_red_packet_layer}
                                         style={{width: width - 50, height: height / 2}}>
                            <TouchableOpacity
                                style={{alignSelf: 'flex-end', marginRight: 50, marginTop: 50}}
                                activeOpacity={0.7}
                                onPress={() => this.dismiss()}>
                                <Image source={ic_red_packet_cancel}
                                       style={{width: 25, height: 25, resizeMode: 'contain'}}/>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.gotoRedPacket()}
                                              style={{marginTop: height / 3 - 20, alignSelf: 'center'}}>
                                <Image source={ic_red_packet_envelopes}
                                       style={{width: 150, height: 45, resizeMode: 'contain'}}/>
                            </TouchableOpacity>
                        </ImageBackground>
                    </View>
                </View>
            </Modal>
        )

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        alignItems: 'center',
        justifyContent: 'center',
    }
})

