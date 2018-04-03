import React, { Component } from 'react'
import {
    WebView,
    Dimensions,
    ScrollView
} from 'react-native'

getInjectedJavaScript = (miniHeight)=>{
    return `
    (function () {
        var height = null;
    
        function postHeight(h){
            if (window.postMessage) {
                  window.postMessage(JSON.stringify({
                    type: 'setHeight',
                    height: h
                  }));
            }
        }
        
        function changeHeight() {
          if (document.body.scrollHeight != height) {
            height = document.body.scrollHeight;
            postHeight(height);
          }
        }
        
       window.addEventListener('resize', changeHeight);     
       setTimeout(function(){postHeight(${miniHeight})},100);
    } ())
    `;
}

// window.addEventListener('resize', changeHeight);
// setInterval(changeHeight,100);
export default class AutoHeightWebView extends Component {
    constructor (props) {
        super(props);
        this.state = ({
            height: 0
        })
    }

    /**
     * web端发送过来的交互消息
     */
    onMessage (event) {
        try {
            const action = JSON.parse(event.nativeEvent.data);
            if (action.type === 'setHeight' && action.height > 0) {
                this.setState({ height: action.height });
            }
        } catch (error) {
            console.log(error);
        }
    }

    render () {
        let miniHeight = Dimensions.get('window').height/2;
        return (
            <ScrollView style={[{minHeight:miniHeight},this.props.scrollStyle]}>
                <WebView
                    injectedJavaScript={getInjectedJavaScript(miniHeight)}
                    style={[{
                        width: Dimensions.get('window').width,
                        height: this.state.height,
                        padding:5
                    },this.props.wbStyle]}
                    automaticallyAdjustContentInsets
                    decelerationRate='normal'
                    scalesPageToFit
                    javaScriptEnabled // 仅限Android平台。iOS平台JavaScript是默认开启的。
                    domStorageEnabled // 适用于安卓
                    scrollEnabled={false}
                    onMessage={this.onMessage.bind(this)}
                    {...this.props}
                />
            </ScrollView>
        )
    }
}