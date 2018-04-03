import React, {Component} from 'react';
import {
    Image,
    Text,
    View,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    DeviceEventEmitter,
} from 'react-native';
import {
    mainColor,
    mainBackgroundColor,
    titleTextColor,
    content2TextColor,
    placeholderTextColor, contentTextColor
} from '../../constraint/Colors';
import TitleBar from '../../widgets/TitleBar';
import { ic_right_arrows} from '../../constraint/Image';
import {CommonStyles} from "../../styles/CommonStyles";
import {goto} from "../../reducers/RouterReducer";
import connect from "react-redux/es/connect/connect";
import XImage from "../../widgets/XImage";

class WaitCommentProductListComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // productList:[],
            productList:this.props.navigation.state.params.productList,
        };
    }

    componentDidMount(){
        this.listener = DeviceEventEmitter.addListener('Comment',(data)=>{
            let productList = [];
            this.state.productList.map(item=>{
                if(data.productId !== item.productSkuId){
                    productList.push(item);
                }
            });

            this.setState({productList:productList})
        });
    }
    componentWillUnmount(){
        this.listener.remove();
    }


    render() {
        return (
            <View style={{backgroundColor: mainBackgroundColor, flex: 1}}>
                <TitleBar title={'商品评价'}/>
                <View style={{flex: 1,}}>
                    <FlatList
                        ListHeaderComponent={()=><View style={{height:5}}/>}
                        data={this.state.productList}
                        keyExtractor={(item, index) => index}
                        renderItem={({item}) =>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={()=>{
                                    this.props.dispatch(goto('Evaluation', {
                                        'productSkuId': item.productSkuId,
                                        'orderItemId': item.id,
                                        'imgUrl': item.imgUrl,
                                        'orderId':item.orderId,
                                        'waitCommentProductCount':this.state.productList.length
                                    }))}}>
                                <CollectListItem data={item}/>
                            </TouchableOpacity>
                        }/>
                </View>
            </View>
        )
    }
}

class CollectListItem extends Component {
    render() {
        let {data} = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.itemContain}>
                    <XImage style={styles.itemImg} uri={data.imgUrl}/>
                    <View style={{flex: 1, marginLeft: 15}}>
                        <Text numberOfLines={1} style={styles.itemName}>{data.productName}</Text>
                        <Text numberOfLines={1} style={styles.sku}>{data.productSkuSpecProperty}</Text>
                        {/*<Text numberOfLines={1} style={styles.price}>￥ 599.00</Text>*/}
                    </View>
                    <Image source={ic_right_arrows} style={CommonStyles.rightArrowsStyle}/>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop:5,
        marginRight:10,
        marginLeft:10,
        marginBottom:5,
        backgroundColor: 'white',
        borderRadius: 5,
        shadowColor:'gray',
        shadowOffset:{height:2,width:2},
        shadowRadius:3,
        shadowOpacity:0.2,
        elevation: 2
    },
    itemContain: {
        flexDirection: 'row',
        padding: 12,
        alignItems:'center',
    },
    itemImg: {
        width: 95,
        height: 95,
        borderRadius: 5,
        borderWidth: 0.3,
        borderColor: placeholderTextColor,
    },
    itemName: {
        color: titleTextColor,
        fontSize: 18,
        marginTop: 10,
    },
    price: {
        alignItems: 'flex-end',
        color: contentTextColor,
        fontSize: 16,
        marginTop: 12
    },
    sku: {
        alignItems: 'flex-end',
        color: mainColor,
        fontSize: 14,
        marginTop: 12
    },
    check: {
        width: 15,
        height: 15,
        marginRight: 5,
        resizeMode: 'contain',
        marginTop: 5
    },
    itemDelete: {
        flexDirection: 'row',
        marginTop: 5,
        justifyContent: 'flex-end',
        alignItems: 'center',
    }
});

export default connect()(WaitCommentProductListComponent);