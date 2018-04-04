import React, {Component} from 'react';
import {View, Dimensions, TouchableOpacity,Platform} from 'react-native';
import {post, isSuccess} from "../../common/CommonRequest"
import {mainBackgroundColor} from "../../constraint/Colors";
import {connect} from 'react-redux'
import SearchBar from "./home/SearchBar";
import BasePage from "./BasePage";
import {ModuleStyle} from "./Config";

class HomeStreet extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            opacity:0,
        };
        this.isHYBuy = this.props.navigation.state.params==='APP_HOME_LEGOU';
        this.action = this.props.navigation.state.params;
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: mainBackgroundColor}}>
                {this.getContentView()}
                <SearchBar opacity={this.state.opacity} onlyTitle={true}/>
            </View>
        );
    }

    onRefresh(callback, options) {
        var rows = [];
        Promise.all([post('main/module/street/banner', {street: this.props.navigation.state.params}),
            post('main/module/street', {street: this.props.navigation.state.params})])
            .then(([bannerData, moduleData]) => {
                if (isSuccess(bannerData) && isSuccess(moduleData)) {
                    rows.push({"data": bannerData.result, 'modelId': ModuleStyle.BANNER,flag:{action:this.action}});
                    for (let item of moduleData.result) {
                        rows.push({"data": item, 'modelId': item.style,flag:{isHYBuy:this.isHYBuy}});
                    }
                    callback(rows, {isShowFirstLoadView: false, pageNumber: 1});
                } else {
                    this._errorMsg(callback, rows, bannerData.message);
                }
            }).catch((e) => {
            this._errorMsg(callback, rows, e.message);
        });
    }

    onContentViewScroll(e) {
        let offsetY = e.nativeEvent.contentOffset.y / 100; //滑动距离
        //实现标题栏渐变效果
        if (offsetY >= 0 && (this.state.opacity !== 1 || offsetY <= 1)) {
            this.setState({opacity: offsetY >= 1 ? 1 : offsetY})
        }
    }
}

export default connect()(HomeStreet)
