import React, {Component} from 'react';
import {View, TouchableOpacity, StyleSheet, Modal, Text, FlatList, Image,DeviceEventEmitter} from 'react-native';
import {placeholderTextColor, titleTextColor} from "../../../constraint/Colors";
import {ic_n_drop_bg} from "../../../constraint/Image";
export default class LogisticsDown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
        };
        this.left=0;
        this.top=0;
        this.marginTop=0;
    }

    dismiss() {
        this.setState({
            isVisible: false
        });
    }

    show(x, y, width, height) {
        this.left = x;
        this.top = y;
        this.width = width;
        this.marginTop = height;
        this.setState({
            isVisible: true,
        });
    }

    renderLogisticsInformation(item){
        this.props.selectValue(item.courierName);
        DeviceEventEmitter.emit('Informatio', item.courierName, item.courierKey,)
        this.dismiss();
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
                    <TouchableOpacity style={styles.container} activeOpacity={1} onPress={() => this.dismiss()}>
                        {this.renderDialog()}
                    </TouchableOpacity>
                </Modal>
            </View>
        );
    }
    _keyExtractor = (item, index) => index;
    renderDialog() {
        return (
            <View style={{left:this.left, top:this.top, marginTop:this.marginTop,width:this.width}}>
                <Image source={ic_n_drop_bg} style={[styles.img, {marginLeft:this.width-20-8,marginBottom:-5}]}/>
                <View style={styles.modalStyle}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={this.props.data}
                        keyExtractor={this._keyExtractor}
                        renderItem={({item, index}) => {
                            return <TouchableOpacity
                                key={index}
                                activeOpacity={0.7}
                                style={[styles.touch, {}]}
                                onPress={() => {
                                    this.renderLogisticsInformation(item)
                                }}>
                                <Text style={{fontSize: 18, color: titleTextColor}}>{item.courierName}</Text>
                            </TouchableOpacity>
                        }}/>
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        elevation: 5,
    },
    modalStyle: {
        backgroundColor: '#fff',
        borderRadius: 3,
        maxHeight:230,
    },
    touch: {
        paddingVertical:15,
        justifyContent:'center',
        alignItems:'center',
        borderBottomColor:placeholderTextColor,
        borderBottomWidth:0.5,
    },
    img:{
        height:16,
        width:16,
        resizeMode:'contain',
    }
});