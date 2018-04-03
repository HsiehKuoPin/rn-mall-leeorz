import React, {Component} from 'react';
import {View, TouchableOpacity, StyleSheet, Modal, Text, FlatList, ImageBackground, Image} from 'react-native';
import {mainColor, placeholderTextColor, titleTextColor} from "../../../../../constraint/Colors";
import {ic_n_drop_bg} from "../../../../../constraint/Image";
import {formatMoney} from "../../../../../common/StringUtil";

export default class JadeIntegralDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
        };
        this.left = 0;
        this.top = 0;
        this.marginTop = 0;
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

    render() {
        return (
            <View style={{display: this.state.isVisible ? 'flex' : 'none'}}>
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
            <View style={{left: this.left, top: this.top, marginTop: this.marginTop, width: this.width}}>
                <Image source={ic_n_drop_bg}
                       style={[styles.img, {marginLeft: (this.width - 16) / 2, marginBottom: -5}]}/>
                <View style={styles.modalStyle}>
                    <FlatList
                        showsVerticalScrollIndicator={true}
                        data={this.props.data}
                        keyExtractor={this._keyExtractor}
                        renderItem={({item, index}) => {
                            return <TouchableOpacity
                                key={index}
                                activeOpacity={0.6}
                                style={[styles.touch, {}]}
                                onPress={() => {
                                    this.setState({isVisible: false}, () => this.props.selectPrice(item.price));
                                }}>
                                <Text style={{
                                    marginLeft: 10,
                                    fontSize: 13,
                                    color: titleTextColor
                                }}>{item.ratio + '%玉积分：'}</Text>
                                <Text style={{
                                    marginRight: 10,
                                    fontSize: 13,
                                    color: titleTextColor
                                }}>{formatMoney(item.price,false)}</Text>
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
        maxHeight: 150,
    },
    touch: {
        flexDirection: 'row',
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomColor: placeholderTextColor,
        borderBottomWidth: 0.5,
        height:40,
    },
    img: {
        height: 16,
        width: 16,
        resizeMode: 'contain',
    }
});