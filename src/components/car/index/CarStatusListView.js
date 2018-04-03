import React, {Component} from 'react';
import {View, StyleSheet, Platform, Dimensions, TouchableOpacity, FlatList, Text} from "react-native";

import {connect} from 'react-redux';
import {
    content2TextColor, placeholderTextColor,
    titleTextColor
} from "../../../constraint/Colors";
import XImage from "../../../widgets/XImage";

let deviceWidth = Dimensions.get('window').width;

/**
 * 您的推荐
 */
class CarStatusListView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectIndex: 0,
        }
    }

    render() {
        let data = this.props.data;
        return (
            <View style={{marginTop: 10,backgroundColor: 'white'}}>
                <View style={{backgroundColor: 'white', height: 60 + deviceWidth / 4}}>
                    <Text style={{padding: 15, fontSize: 16, color: titleTextColor}}>{'名车品牌'}</Text>
                    <View style={styles.line}/>
                </View>
                <View style={[styles.line,{marginLeft: 0, marginRight: 0,}]}/>
                {data.length === 0 ?null:
                <FlatList
                    style={{
                        marginTop: -1 * deviceWidth / 3.05,
                        // marginBottom: 23,
                    }}
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    data={data}
                    extraData={this.state.selectIndex}
                    keyExtractor={(item, index) => index}
                    renderItem={({item, index}) =>
                        <TouchableOpacity
                            key={index}
                            disabled={this.state.selectIndex === index}
                            activeOpacity={0.5}//点击时的透明度
                            onPress={
                                () => {
                                    this.props.onBrandPress(item.id);
                                    if (this.state.selectIndex !== index) {
                                        this.setState({selectIndex: index});
                                    }
                                }}>
                            <View style={[styles.container,
                                this.state.selectIndex === index ? styles.selectItemLayout : styles.normalItemLayout,
                            ]}>
                                <XImage
                                    uri={item.img_url}
                                    style={this.state.selectIndex === index ? styles.selectItemImage : styles.normalItemImage}/>
                                <Text style={styles.itemText} numberOfLines={1}>{item.value_text}</Text>
                            </View>
                        </TouchableOpacity>
                    }
                />}
                {/*<View style={{height: 20}}/>*/}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        marginLeft: 10,
        marginTop: 10,
        marginBottom: 10,
    },
    itemText: {
        color: content2TextColor,
        textAlign: 'center',
        fontSize: 13,
        marginTop: 5,
    },
    selectItemLayout: {
        backgroundColor: 'white',
        paddingVertical: 15,
        paddingHorizontal: 10,
        marginRight: 3,
        borderWidth: 0,
        borderColor: content2TextColor,
        shadowColor: 'gray',
        shadowOffset: {height: 2, width: 2},
        shadowOpacity: 0.2,
        elevation: 2
    },
    selectItemImage: {
        width: (deviceWidth - 20 * 5) / 4,
        height: (deviceWidth - 20 * 5) / 4,
        resizeMode:'contain',
    },
    normalItemLayout: {
        backgroundColor: '#00000000',
        borderColor: '#00000000',
        paddingBottom:5,
        marginTop: 25,
        marginBottom: 5,

    },
    normalItemImage: {
        resizeMode:'contain',
        width: (deviceWidth - 20 * 5) / 4,
        height: (deviceWidth - 20 * 5) / 4,
    },
    line:{
    marginLeft: 15,
    marginRight: 15,
    backgroundColor: placeholderTextColor,
    height: 0.5
    }

});

export default connect()(CarStatusListView);
