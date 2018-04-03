import React, {Component} from 'react';
import {
    StatusBar,
    View,
} from 'react-native';
import {configureStore} from './app/Store';
import {Provider} from 'react-redux';
import AppWithNavigationState from './components/routers/AppWithNavigationState';
import {PersistGate} from "../node_modules/redux-persist/es/integration/react";
import {mainColor} from "./constraint/Colors";
import {getHost, updateConfig, updateHost} from "./common/CommonRequest";
import {showToastShort} from "./common/CommonToast";
import {getPaymentQRCode} from "./common/QRcodeUtil";
const {persistor, store} = configureStore();

export default class App extends Component {
    constructor(props) {
        super(props);

        console.log(this);
        this.state = {
            store: store,
        };
        updateConfig(props);

        if (!__DEV__) {
            global.console = {
                info: () => {},
                log: () => {},
                warn: () => {},
                debug: () => {},
                error: () => {},
            };
        }
    }

    render() {
        return (
            <Provider store={this.state.store}>
                <PersistGate persistor={persistor}>
                    <View style={{flex:1}}>
                        <StatusBar
                            backgroundColor={'black'}
                            translucent={true}/>
                        <AppWithNavigationState  appVersion={this.props.version}/>
                    </View>
                </PersistGate>
            </Provider>
        )
    }
}