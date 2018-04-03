import React, { Component } from 'react';

import {
    StyleSheet,
    View,
    WebView,
} from 'react-native';

import TitleBar from '../../../../widgets/TitleBar';
import {connect} from 'react-redux';
import {goBack} from "../../../../reducers/RouterReducer";
import {getHost} from "../../../../common/CommonRequest";

class Agreement extends Component {
    constructor(props){
        super(props);
        this.title = this.props.navigation.state.params.title;
        this.url = this.props.navigation.state.params.url;
    }
    render() {
        return (
            <View style={styles.container}>
                <TitleBar title={this.title}
                          hideRight={true}
                          onBackViewClick={() => {
                              this.props.dispatch(goBack());
                          }}/>
                <WebView bounces={true}
                         scalesPageToFit={true}
                         source={{uri: this.url}}
                         style={{flex:1}}>
                </WebView>
            </View>

        );
    }
}

//样式定义
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2'
    }
});

export default connect()(Agreement);