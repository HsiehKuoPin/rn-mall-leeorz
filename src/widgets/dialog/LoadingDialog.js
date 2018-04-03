import React, {Component} from 'react';
import {
    Modal,
    ActivityIndicator,
    View,
    TouchableWithoutFeedback
} from 'react-native';
import connect from "react-redux/es/connect/connect";


class LoadingDialog extends Component {

    _getLoadingView() {
            return (
                <ActivityIndicator
                    animating={true}
                    size="large"
                />
            );
    }

    render() {
        let{visible,isCanceledOnTouchOutside} = this.props.loadingDialog;
        return (
            <Modal
                animationType={"fade"}
                transparent={true}
                onRequestClose={() => {}}
                visible={visible}
            >
                <TouchableWithoutFeedback
                    style={{elevation:5}}
                    onPress={isCanceledOnTouchOutside?() => this.dismiss():null}>
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: 'rgba(0,0,0,.5)',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                        <TouchableWithoutFeedback>
                            <View style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: 10,
                                // width: '50%',
                                width: 80,
                                backgroundColor: 'white',
                                borderRadius: 10,
                                height: 80
                            }}>
                                {this._getLoadingView()}
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        );
    }
}
selector = (state)=>{
  return {
      loadingDialog:state.cacheStore.loadingDialog
  }
};

export default connect(selector)(LoadingDialog);