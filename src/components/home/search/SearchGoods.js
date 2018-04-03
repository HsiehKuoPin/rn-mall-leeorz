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
import SearchView from '../module/SearchView';
import {saveSearch, clearSearch} from '../../../reducers/SearchReducer'

class SearchGoods extends Component {

    _onSubmitEditing(searchText) {
        if (searchText !== '' && searchText.trim() !== '') {
            this.props.dispatch(goto('SearchResult', {search: searchText}));
            this.props.dispatch(saveSearch(searchText))
        }
    }

    render() {
        let showHistoryView = this.props.searchInfo.length === 0 ? (<View/>) : (
            <View style={{marginTop: 20, marginHorizontal: 20}}>
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.historyText}>历史搜索</Text>
                    <View style={{flex: 1}}/>
                    <TouchableOpacity onPress={() => this.props.dispatch(clearSearch())}>
                        <Image source={ic_delete} style={styles.deleteImg}/>
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection: 'row', flexWrap: 'wrap', flex: 1}}>
                    {this.props.searchInfo.map((item, index) => {
                        return (
                            <TouchableOpacity key={index}
                                              style={styles.itemContain1}
                                              onPress={() => {
                                                  this.props.dispatch(goto('SearchResult', {search: item}))
                                              }}>
                                <Text style={{fontSize: 16, color: contentTextColor}} numberOfLines={1}>{item}</Text>
                            </TouchableOpacity>
                        )
                    })}
                </View>
            </View>
        );
        return (
            <View style={{backgroundColor: mainBackgroundColor, flex: 1}}>
                <SearchView noShowRightImage={true} isSearch={true}
                            getSearchText={(searchText) => this._onSubmitEditing(searchText)}/>
                {showHistoryView}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    historyText: {
        fontSize: 18,
        color: titleTextColor,
    },
    deleteImg: {
        width: 20,
        height: 20,
        marginTop: 3,
        resizeMode: 'contain',
    },
    itemContain: {
        backgroundColor: 'white',
        width: (Dimensions.get('window').width - 85) / 4,
        borderRadius: 3,
        borderWidth: 1,
        borderColor: placeholderTextColor,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
        marginTop: 15,
    },
    itemContain1: {
        backgroundColor: 'white',
        borderRadius: 3,
        borderWidth: 0.5,
        borderColor: placeholderTextColor,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
        marginTop: 15,
        paddingHorizontal: 10,
    },
});

selector = (state) => {
    return {
        searchInfo: state.searchStore.searchInfo
    }
};

export default connect(selector)(SearchGoods)