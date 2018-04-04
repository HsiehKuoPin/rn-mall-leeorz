import React, {Component} from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    Image,
    Dimensions
} from 'react-native';
import {connect} from 'react-redux';
import {placeholderTextColor, mainBackgroundColor, titleTextColor, contentTextColor} from '../../../constraint/Colors';
import {goto} from '../../../reducers/RouterReducer';
import {ic_delete} from '../../../constraint/Image'
import SearchTitleBar from './SearchTitleBar';
import {saveSearch, clearSearch} from '../../../reducers/SearchReducer'
import XImage from "../../../widgets/XImage";
import {SCREEN_WIDTH} from "../../../common/AppUtil";
import {CommonStyles as CommonStyle} from "../../../styles/CommonStyles";

class SearchGoods extends Component {
    constructor(props){
        super(props);

    }
    _onSubmitEditing(searchText) {
        if (searchText !== '' && searchText.trim() !== '') {
            this.props.dispatch(goto('SearchResult', {search: searchText}));
            this.props.dispatch(saveSearch(searchText))
        }
    }

    _getHotWordView(){
       let hotWord = ['飞科','iPhoneX','耐克','阿迪达斯','MAC','钻石皇朝','苏尚儿']
       return  <View style={{paddingBottom:10,backgroundColor:'white'}}>
            <Text style={styles.historyText}>热门搜索</Text>
            <XImage style={{width:SCREEN_WIDTH,height:SCREEN_WIDTH * 0.25}} uri={'http://p0xk4au0z.bkt.clouddn.com/1520591518377.jpg'}/>
            <View style={{marginTop:10,marginHorizontal:10,flexDirection: 'row', flexWrap: 'wrap'}}>
                {hotWord.map((item, index) => {
                    return (
                        <TouchableOpacity key={index}
                                          style={styles.itemContain1}
                                          activeOpacity={0.7}
                                          onPress={() => {
                                              this.props.dispatch(goto('SearchResult', {search: item}))
                                          }}>
                            <Text style={{fontSize: 12, color: contentTextColor}} numberOfLines={1}>{item}</Text>
                        </TouchableOpacity>
                    )
                })}
            </View>
        </View>;
    }

    _getSearchHistoryView(){
        let {searchInfo} = this.props;
        let showHistoryView = searchInfo.length === 0 ? null : (
            <View style={{marginTop:5,paddingBottom:10,backgroundColor:'white'}}>
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.historyText}>搜索历史</Text>
                    <View style={{flex: 1}}/>
                    <TouchableOpacity onPress={() => this.props.dispatch(clearSearch())}>
                        <Image source={ic_delete} style={styles.deleteImg}/>
                    </TouchableOpacity>
                </View>
                <View style={[CommonStyle.vline,{marginBottom:5}]}/>
                <View style={{marginHorizontal:10,flexDirection: 'row', flexWrap: 'wrap'}}>
                    {searchInfo.map((item, index) => {
                        return (
                            <TouchableOpacity key={index}
                                              style={styles.itemContain1}
                                              activeOpacity={0.7}
                                              onPress={() => {
                                                  this.props.dispatch(goto('SearchResult', {search: item}))
                                              }}>
                                <Text style={{fontSize: 12, color: contentTextColor}} numberOfLines={1}>{item}</Text>
                            </TouchableOpacity>
                        )
                    })}
                </View>
            </View>
        );
        return showHistoryView;
    }

    render() {

        return (
            <View style={{backgroundColor: mainBackgroundColor, flex: 1}}>
                <SearchTitleBar noShowRightImage={true} isSearch={true}
                            getSearchText={(searchText) => this._onSubmitEditing(searchText)}/>
                {this._getHotWordView()}
                {this._getSearchHistoryView()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    historyText: {
        fontSize: 14,
        color: 'black',
        margin:10,
    },
    deleteImg: {
        width: 15,
        height: 15,
        margin:10,
        resizeMode: 'contain',
    },
    itemContain1: {
        backgroundColor: 'white',
        borderWidth: 0.5,
        borderColor: placeholderTextColor,
        height: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 5,
        marginTop:5,
        paddingHorizontal: 10,
    },
});

selector = (state) => {
    return {
        searchInfo: state.searchStore.searchInfo
    }
};

export default connect(selector)(SearchGoods)