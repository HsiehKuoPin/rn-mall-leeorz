import React, {Component} from 'react';
import {View, Text, StyleSheet, Dimensions, Image, FlatList, TouchableOpacity} from "react-native";
import LFlatList from '../../../widgets/LFlatList';
import {isSuccess, post} from "../../../common/CommonRequest";
import {content2TextColor, mainBackgroundColor, placeholderTextColor, titleTextColor} from "../../../constraint/Colors";
import {product_empty_star, product_full_star} from "../../../constraint/Image";
import {goto} from "../../../reducers/RouterReducer";
import {connect} from "react-redux";
import {getMiddle} from "../../../common/PhotoUtil";

const ScreenWidth = Dimensions.get('window').width;

/**
 * 商品评论列表
 */
export default class CommentListView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            productRating:'0',
        };
    }
    componentDidMount(){
        this._loadMoreComment();
    }

    _loadMoreComment() {
        this.refs.commentList._toEnd();
    }

    componentDidUpdate(nextState){
        this._loadMoreComment();
    }
    _onLoadMore(page = 1, callback, option) {
        let requestObj = {
            pageNo: page,
            pageSize: 20,
            "productId": this.props.productId,
            "appriseType": this.state.productRating,
        };
        post('product/appraises', requestObj)
            .then((responseJson) => {
                if (isSuccess(responseJson)) {
                    callback(responseJson.result.data, {haveNext: (responseJson.result.pageNo * responseJson.result.pageSize < responseJson.result.dataCount)});
                } else {
                    callback([], {requestError: true});
                }
            })
            .catch((e)=>{
                callback([], {requestError: true});
            });
    }


    render() {
        return <LFlatList
            ref="commentList"
            renderItem={({item,index})=><CommentItem data={{item,index}} dispatch={this.props.dispatch}/>}
            onLoadMore={this._onLoadMore.bind(this)}
            refreshable={false} // enable pull-to-refresh for iOS and touch-to-refresh for Android
            withSections={false} // enable sections
            isMounted={false}
            emptyView={()=><Text style={{marginTop:10,textAlign:'center'}}>暂时还没有评论</Text>}
            loadMoreable={true}
            isShowFirstLoadView={false}
            enableEmptySections={true}
            refreshableTintColor="blue"
            showsVerticalScrollIndicator={false}
            onEndReached={null}
        />;
    }
}

class CommentItem extends Component {
    render() {
        let {item,index} = this.props.data;
        return this.itemView(item,index);
    }

    itemView(itemP, indexP) {
        return (
            <View key={indexP} style={{margin:20}}>
                <View style={{flexDirection: 'row'}}>
                    <Image style={styles.imgItem} source={{uri: 'http://p0xkrqo35.bkt.clouddn.com/1515640540722.png'}}/>
                    <View style={{flex: 1, marginLeft:10}}>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={styles.txtName}>{itemP.memberName}</Text>
                            <View style={{flex: 1, height: 1}}/>
                            <Text style={{color: content2TextColor}}>{itemP.updateTime}</Text>
                        </View>
                        <View style={{flexDirection: 'row', marginBottom: 20}}>
                            {
                                [0,1,2,3,4].map((item,key)=>{
                                    return <Image key={key} style={styles.img} source={key < itemP.score?product_full_star:product_empty_star}/>
                                })
                            }
                        </View>

                        <View style={{flexWrap:'wrap',flexDirection:'row',flex:1}}>
                        {itemP.content.split(';').map((item,index)=>{
                            return <Text key={index} style={{
                                color: placeholderTextColor,
                                marginBottom: 10,
                                borderRadius: 3,
                                borderColor: placeholderTextColor,
                                borderWidth:0.5,
                                // minWidth:60,
                                padding:5,
                                textAlign:'center',
                                marginRight:10,
                                backgroundColor:mainBackgroundColor,
                            }}>{item}</Text>
                        })}
                        </View>
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={itemP.imgs}
                            numColumns={3}
                            getItemLayout={(data, index) => ( {length: 60, offset: 60 * index, index} )}
                            keyExtractor={(item, index) => index}
                            renderItem={({item, index}) =>
                                <TouchableOpacity
                                    onPress={() => {
                                        let imgUrlList = [];
                                        for (let i = 0; i < itemP.imgs.length; i++) {
                                            imgUrlList.push(itemP.imgs[i].imgUrl)
                                        }
                                        this.props.dispatch(goto('PhotoView', {imgUrlList:imgUrlList, index: index}))
                                    }}
                                    activeOpacity={0.7}>
                                    <Image
                                        style={{height: (ScreenWidth-150)/2, width: (ScreenWidth-150)/3,margin:5}}
                                        // source={{uri: item.imgUrl.indexOf('?imageView2/0/w/') >= 0 ? item.imgUrl : (item.imgUrl + '?imageView2/0/w/300')}}/>
                                        source={{uri: getMiddle(item.imgUrl)}}/>
                                </TouchableOpacity>
                            }
                        />
                    </View>
                </View>
                <View style={{height: 0.5, backgroundColor: placeholderTextColor}}/>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    img: {
        height: 30,
        width: 20,
        marginRight:1,
        resizeMode: 'contain',
    },
    imgItem:{
        height:38,
        width:38,
        borderRadius:15,
        resizeMode:'contain',
    },
    txtName: {
        color: titleTextColor,
        fontSize:16,
    },
});