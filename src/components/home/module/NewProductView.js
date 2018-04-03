import React, {Component} from 'react';
import {FlatList, Dimensions,TouchableOpacity} from 'react-native';
import {connect} from "react-redux";
import {goto} from "../../../reducers/RouterReducer";
import {commonAction} from "../../../common/CommonAction";
import XImage from "../../../widgets/XImage";

const {width,height} = Dimensions.get('window');
class NewProductView extends Component {

    _keyExtractor = (item, index) => index;

    render() {
        return (
            <FlatList
                showsVerticalScrollIndicator={false}
                data={this.props.data}
                style={{margin:5}}
                keyExtractor={this._keyExtractor}
                numColumns={2}
                renderItem={({item, index}) =>
                    <TouchableOpacity
                        key={index}
                        activeOpacity={0.7}//点击时的透明度
                        onPress={() => {
                            commonAction(this.props.dispatch,{item,token:this.props.token});
                        }}>
                        <XImage uri={item.imgUrl}
                                style={{margin:5,backgroundColor:'#FFF',width:(width-30)/2,height:(width-30)/2*0.59}}/>
                    </TouchableOpacity>

                }
            />
        )
    }
}

selector = (state) => {
    return {
        token: state.loginStore.token,
    }
};

export default connect(selector)(NewProductView);