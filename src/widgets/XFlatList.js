
import React, {PureComponent} from 'react'
import {View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity} from 'react-native'
import {mainColor} from "../constraint/Colors";

export const RefreshState = {
    Idle: 0,
    HeaderRefreshing: 1,
    FooterRefreshing: 2,
    NoMoreData: 3,
    Failure: 4,
};

// const DEBUG = false;
// const log = (text: string) => {DEBUG && console.log(text)};

type Props = {
    refreshState: number,
    onHeaderRefresh: (refreshState: number) => void,
    onFooterRefresh?: (refreshState: number) => void,
    data: Array<any>,

    footerContainerStyle?: any,
    footerTextStyle?: any,

    listRef?: any,

    footerRefreshingText?: string,
    footerFailureText?: string,
    footerNoMoreDataText?: string,
}

class XFlatList extends PureComponent {
    props: Props;

    static defaultProps = {
        footerRefreshingText: '数据加载中…',
        footerFailureText: '点击重新加载',
        footerNoMoreDataText: '已加载全部数据',
    };

    onHeaderRefresh = () => {
        if (this.shouldStartHeaderRefreshing()) {
            this.props.onHeaderRefresh(RefreshState.HeaderRefreshing)
        }
    };

    onEndReached = (info: any) => {
        if (this.shouldStartFooterRefreshing()) {
            this.props.onFooterRefresh && this.props.onFooterRefresh(RefreshState.FooterRefreshing)
        }
    };

    shouldStartHeaderRefreshing = () => {
        return this.props.refreshState !== RefreshState.HeaderRefreshing ;
    };

    shouldStartFooterRefreshing = () => {
        let {refreshState, data} = this.props;
        if (data.length === 0) {
            return false
        }
        return (refreshState === RefreshState.FooterRefreshing)
    };

    render() {
        return (
            <FlatList
                refreshControlAndroidColors={[mainColor]}
                ref={this.props.listRef}
                onEndReached={this.onEndReached}
                onRefresh={this.props.onHeaderRefresh?this.onHeaderRefresh:null}
                refreshing={this.props.refreshState === RefreshState.HeaderRefreshing}
                ListFooterComponent={this.renderFooter}
                onEndReachedThreshold={0.1}
                {...this.props}
            />
        )
    }

    renderFooter = () => {
        let footer = null;

        let footerContainerStyle = [styles.footerContainer, this.props.footerContainerStyle];
        let footerTextStyle = [styles.footerText, this.props.footerTextStyle];
        let {footerRefreshingText, footerFailureText, footerNoMoreDataText} = this.props;

        switch (this.props.refreshState) {
            case RefreshState.Idle:
                footer = (<View style={footerContainerStyle} />);
                break;
            case RefreshState.Failure:
                footer = (
                    <TouchableOpacity
                        style={footerContainerStyle}
                        onPress={() => {
                            this.props.onFooterRefresh && this.props.onFooterRefresh(RefreshState.FooterRefreshing)
                        }}
                    >
                        <Text style={footerTextStyle}>{footerFailureText}</Text>
                    </TouchableOpacity>
                );
                break;
            case RefreshState.FooterRefreshing:
                footer = (
                    <View style={footerContainerStyle} >
                        <ActivityIndicator size="small" color={mainColor} />
                        <Text style={[footerTextStyle, {marginLeft: 7}]}>{footerRefreshingText}</Text>
                    </View>
                );
                break;
            case RefreshState.NoMoreData:
                footer = (
                    <View style={footerContainerStyle} >
                        <Text style={footerTextStyle}>{footerNoMoreDataText}</Text>
                    </View>
                );
                break;
        }
        return footer
    }
}

const styles = StyleSheet.create({
    footerContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        // padding: 10,
        height: 44,
    },
    footerText: {
        fontSize: 14,
        color: '#555555'
    }
});

export default XFlatList