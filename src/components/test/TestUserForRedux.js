import React,{Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions
}from 'react-native';

import {connect} from 'react-redux';
import {goto} from '../../reducers/RouterReducer';
import {encryption, formatMoney} from "../../common/StringUtil";
import {showToastShort} from "../../common/CommonToast";
import {getMiddle} from "../../common/PhotoUtil";

class TestUser extends Component{
    constructor(props){
        super(props);
    }

    _test = (str) => {
        encryption(str);
    };

    _testFormatMoney = (str) => {
        console.warn(formatMoney(str));
    };

    _testLink = () => {
        console.warn(getMiddle('http://www.baidu.com?imageView2/0/w/12312'));
    };

    render() {
        const {dispatch} = this.props;
        console.log('第一个界面>' + JSON.stringify(this.props.navigation));
        return (

            <View style={style.shadowBoxStyle}>

                <Text style={{marginTop:10}} onPress={this._test('123456')}>测试加密</Text>
                <Text style={{marginTop:10}} onPress={()=>this._testFormatMoney(undefined)}>测试格式化字符串</Text>
                <Text style={{marginTop:10}} onPress={()=>this._testLink()}>测试Link</Text>
            </View>
        );
    }
}

const style = StyleSheet.create({
    shadowBoxStyle:{
        backgroundColor:'white',
        width:Dimensions.get('window').width-20,
        marginLeft:10,
        borderColor:'white',
        borderWidth:5,
        borderRadius: 10,
        marginTop:74,
        shadowColor:'gray',
        shadowOffset:{height:2,width:2},
        shadowRadius:3,
        shadowOpacity:0.8,
        elevation:4
    }
});


export default connect()(TestUser);



