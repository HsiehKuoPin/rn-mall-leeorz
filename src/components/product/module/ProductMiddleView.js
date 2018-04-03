import React, {Component} from 'react';
import {View, Text, StyleSheet, Dimensions,TouchableOpacity} from "react-native";
import {
    contentTextColor, mainColor, placeholderTextColor,
} from "../../../constraint/Colors";

const ScreenWidth = Dimensions.get('window').width;
/**
 * 商品基本信息
 */
export default class ProductMiddleView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSelected: 0,
        };

    }
    _selectDetail = () => {
        if (this.state.isSelected!==0) {
            this.setState({isSelected: 0},this.props.isSelected(0))
        }
    };
    _selectDes = () => {
        if (this.state.isSelected!==1) {
            this.setState({isSelected: 1},this.props.isSelected(1))
        }
    };
    _selectComment = () => {
        if (this.state.isSelected!==2) {
            this.setState({isSelected: 2},this.props.isSelected(2))
        }
    };

    render() {
        return (

                <View style={{backgroundColor:'white'}}>
                    <View style={styles.container}>
                        <TouchableOpacity
                            style={styles.touch}
                            activeOpacity={0.7}
                            onPress={this._selectDetail}>
                            <Text style={this.state.isSelected===0?styles.txtSelected:styles.txt}>商品详情</Text>
                        </TouchableOpacity>
                        {/*<View style={{height: 30, width: 0.5, backgroundColor: placeholderTextColor}}/>*/}
                        {/*<TouchableOpacity
                            style={styles.touch}
                            activeOpacity={0.7}
                            onPress={this._selectDes}>
                            <Text style={this.state.isSelected===1?styles.txtSelected:styles.txt}>产品参数</Text>
                        </TouchableOpacity>*/}
                        {/*<View style={{height: 30, width: 0.5, backgroundColor: placeholderTextColor}}/>*/}
                        <TouchableOpacity
                            style={styles.touch}
                            activeOpacity={0.7}
                            onPress={this._selectComment}>
                            <Text style={this.state.isSelected===2?styles.txtSelected:styles.txt}>累计评价({this.props.appraiseCount})</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <View style={this.state.isSelected===0?styles.hintSelected:styles.hint}/>
                        {/*<View style={this.state.isSelected===1?styles.hintSelected:styles.hint}/>*/}
                        <View style={this.state.isSelected===2?styles.hintSelected:styles.hint}/>
                    </View>
                    <View style={{height: 0.5, backgroundColor: placeholderTextColor}}/>
                </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
    },
    touch: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopLeftRadius:8
    },
    txt: {
        fontSize: 16,
        color: contentTextColor,
    },
    txtSelected: {
        fontSize: 16,
        color: mainColor,
    },
    hint:{
        flex: 1,
        height: 1,
        marginHorizontal: ScreenWidth/8,
        backgroundColor:'transparent'
    },
    hintSelected:{
        flex: 1,
        height: 1,
        marginHorizontal: ScreenWidth/8,
        backgroundColor:mainColor
    },
});