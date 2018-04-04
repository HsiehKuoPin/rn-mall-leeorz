import React, {Component} from 'react';
import {NavigationActions, TabBarBottom, TabNavigator} from "react-navigation";
// import Index from "../home/Index";
import ShoppingCart from "../shoppingcart/ShoppingCart";
import Personal from "../personal/index/TabPersonal";
import {
    ic_tabhost_index,
    ic_tabhost_index_selected,
    ic_tabhost_product,
    ic_tabhost_product_selected,
    ic_tabhost_shoppingcart,
    ic_tabhost_shoppingcart_selected,
    ic_tabhost_personal,
    ic_tabhost_personal_selected,
} from '../../constraint/Image';
import TabBarItem from "./TabBarIconItem";
import {content2TextColor, mainColor} from "../../constraint/Colors";
import {StatusBar, Text, View, Dimensions} from "react-native";
import {connect} from "react-redux";

const {width} = Dimensions.get('window');

import {isIphoneX} from 'react-native-iphone-x-helper';
import ProductCategory from "../product/ProductCategory";
import {goto, init} from "../../reducers/RouterReducer";
import {notifyUpdateUserInfo,notifyUpdateShoppingCart} from "../../reducers/CacheReducer";
import Home from "../home/Home";
import {
    ic_tabhost_bottom_icon1, ic_tabhost_bottom_icon2, ic_tabhost_bottom_icon3,
    ic_tabhost_bottom_icon4
} from "../../../resources/index";

let token = undefined;
let dispatch = undefined;
class Main extends Component {

    constructor(props){
        super(props);
        this.stackIndex = 0;
    }

    componentDidMount() {
        token = this.props.token;
        dispatch = this.props.dispatch;
        this.stackIndex = this.props.nav.index;
        this.tabIndex = this.refs.tab.state.nav.index;

        let {initialRouteName} = this.props.navigation.state.params?this.props.navigation.state.params:{undefined};
        if(initialRouteName){
            this.switchTab(initialRouteName);
        }
    }

    componentWillReceiveProps(nextProps) {
        let stackIndex = nextProps.nav.index;
        let tabIndex = this.refs.tab.state.nav.index;

        if (nextProps.token === undefined) {//登录失效，跳回首页
            if (tabIndex === 2 || tabIndex === 3) {//当前如果是购物车或者个人中心的话跳转到首页
                this.switchTab('Index');
            }
            return;
        }

        if(this.stackIndex !== stackIndex){//判断stack index是否改变
            if(this.tabIndex !== tabIndex){//判断tab index是否改变
                if (stackIndex === 0 && tabIndex === 3) {//已经返回个人中心
                    dispatch(notifyUpdateUserInfo(new Date().valueOf()));
                } else if (stackIndex === 0 && tabIndex === 2) {//已经返回购物车
                    dispatch(notifyUpdateShoppingCart(new Date().valueOf()));
                }
            }
        }
        this.stackIndex = stackIndex;
    }


    /**
     * 切换到指定界面
     * @param tabName
     */
    switchTab(tabName) {
        this.refs.tab._navigation.navigate(tabName);
    }

    render() {
        token = this.props.token;
        return (
            <View style={{flex: 1}}>
                <StatusBar
                    backgroundColor={'black'}
                    translucent={false}
                    barStyle={'light-content'}/>
                <Tab ref='tab'/>
                {this.props.shoppingCartProductTotalCount === 0 ? null : (
                    <View style={{
                        bottom: 30 + (isIphoneX() ? 35 : 0),
                        right: width / 4 + width / 14,
                        position: 'absolute',
                        borderRadius: 7.5,
                        paddingLeft: 3,
                        paddingRight: 3,
                        minWidth: 15,
                        minHeight: 15,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: mainColor,
                    }}>
                        <Text style={{
                            color: 'white',
                            fontSize: 10,
                            backgroundColor: '#00000000',
                        }}>{this.props.shoppingCartProductTotalCount}</Text>
                    </View>
                )}
            </View>

        );
    }


}


judgeLoginState = ({scene, jumpToIndex}) => {
    if (token) {
        jumpToIndexFunc = jumpToIndex;
        jumpToIndex(scene.index);
        if (scene.index === 3) {//个人中心
            setTimeout(() => {
                dispatch(notifyUpdateUserInfo((new Date()).valueOf()))
            }, 200);
        } else if (scene.index === 2) {//购物车
            setTimeout(() => {
                dispatch(notifyUpdateShoppingCart((new Date()).valueOf()))
            }, 200);
        }
    }else {
        dispatch(goto('Login'));
    }
};

const TabNavigatorConfigs = {
        initialRouteName: 'Index',
        tabBarComponent: TabBarBottom,
        tabBarPosition: 'bottom',
        lazy: true,
        swipeEnabled: false,
        animationEnabled: false,
        backBehavior: 'none',
        tabBarOptions: {
            activeTintColor: mainColor,
            inactiveTintColor: '#2c2c2c',
            style: {backgroundColor: '#ffffff',},
            labelStyle: {
                fontSize: 12, // 文字大小
            },
        }
    };



const TabRouteConfigs = {
    Index: {
        screen: Home,
        navigationOptions: ({navigation}) => ({
            tabBarLabel: '首页',
            tabBarIcon: ({focused, tintColor}) => (
                <TabBarItem
                    tintColor={tintColor}
                    focused={focused}
                    selectedImage={ic_tabhost_bottom_icon1}
                    normalImage={ic_tabhost_bottom_icon1}
                />
            ),
        }),
    },
    Product: {
        screen: ProductCategory,
        navigationOptions: {
            tabBarLabel: '商品',
            tabBarIcon: ({focused, tintColor}) => (
                <TabBarItem
                    tintColor={tintColor}
                    focused={focused}
                    selectedImage={ic_tabhost_bottom_icon2}
                    normalImage={ic_tabhost_bottom_icon2}
                />
            ),
        },
    },
    ShoppingCart: {
        screen: ShoppingCart,
        navigationOptions: {
            tabBarLabel: '购物车',
            tabBarIcon: ({focused, tintColor}) => (
                <TabBarItem
                    tintColor={tintColor}
                    focused={focused}
                    selectedImage={ic_tabhost_bottom_icon3}
                    normalImage={ic_tabhost_bottom_icon3}
                />
            ),
            tabBarOnPress: (({scene, jumpToIndex}) => {
                judgeLoginState({scene, jumpToIndex});
            }),
        },
    },
    Personal: {
        screen: Personal,
        navigationOptions: {
            tabBarLabel: '我的',
            tabBarIcon: ({focused, tintColor}) => (
                <TabBarItem
                    tintColor={tintColor}
                    focused={focused}
                    selectedImage={ic_tabhost_bottom_icon4}
                    normalImage={ic_tabhost_bottom_icon4}
                />
            ),
            tabBarOnPress: (({scene, jumpToIndex}) => {
                judgeLoginState({scene, jumpToIndex});
            }),
        },
    },
};

const Tab = TabNavigator(TabRouteConfigs, TabNavigatorConfigs);


selector = (state) => {
    return {
        shoppingCartProductTotalCount: state.shoppingCartStore.shoppingCartProductTotalCount,
        token: state.loginStore.token,
        nav: state.nav,
    }
};
export default connect(selector)(Main);