import React, {Component} from 'react';
import {
    StyleSheet,
    WebView,
    View, Text, TouchableOpacity, Image,
} from 'react-native';
import {mainBackgroundColor} from "../../constraint/Colors";
import TitleBar from '../../widgets/TitleBar';
import {connect} from 'react-redux'
import {goBack} from "../../reducers/RouterReducer";
import {setCustomClickBackFunc} from "../routers/AppWithNavigationState";
import {whiteBackIco} from "../../constraint/Image";



//页面传参{url:'www.baidu.com',token:'可指定token|非必填|string'}
class CommonWebView extends Component {
    constructor(props){
        super(props);
        this.state={
            title:'',
            canBack:false,
        };

        this.params = this.props.navigation.state.params;
    }
    /**
     * web端发送过来的交互消息
     */
    onMessage (event) {
        //调用webview里边的方法
        // this.webView.postMessage('testRNCallback(aaa)');

        let data = event.nativeEvent.data;
        if(data.indexOf('vueTitle') > -1){
            let title = data.substring(data.indexOf(':') + 1,data.length - 1);
            if(title){
                this.setState({title:title})
            }
        }

    }

    _getBaseScript({token,injectedParams}){
        if(!token)token = this.props.token;//如果外部没有传入token的话，直接用登录token代替
        let injectedParamsList = [];
        console.log(typeof injectedParams);
        if(typeof injectedParams === 'object'){
            for(let key in injectedParams) {
                injectedParamsList.push(`localStorage.setItem('${key}','${injectedParams[key]}')`);
            }
        }
        return `(function() {
          var originalPostMessage = window.postMessage;
        
          var patchedPostMessage = function(message, targetOrigin, transfer) { 
            originalPostMessage(message, targetOrigin, transfer);
          };
        
          patchedPostMessage.toString = function() { 
            return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage'); 
          };
        
          window.postMessage = patchedPostMessage;
          
          var localStorage = window.localStorage;
          localStorage.setItem('token','${token}');
          ${[...injectedParamsList]}
        })();
    `;
    }

    render(){
        let {url,token,title,html,injectedParams} = this.params;
        return (
            <View style={styles.container}>
                <TitleBar title={title?title:this.state.title}
                          customBarTextStyle={{marginHorizontal:100}}
                          customLeftView={() => (
                              <View style={{flexDirection: 'row',}}>
                                  <TouchableOpacity
                                      activeOpacity={0.7}
                                      style={[styles.icoLayout,{flexDirection:'row',alignItems:'center',justifyContent:'center'}]}
                                      onPress={() => {
                                            this.onBack();
                                      }}>
                                      <Image source={whiteBackIco} style={styles.backIco}/>
                                      <Text style={{color:'white'}}>返回</Text>
                                  </TouchableOpacity>
                                  {this.state.canBack?<TouchableOpacity
                                      activeOpacity={0.7}
                                      style={styles.closeBtn}
                                      onPress={() => {
                                          this.props.dispatch(goBack());
                                      }}>
                                      <Text style={{color:'white'}}>关闭</Text>
                                  </TouchableOpacity>:null}

                              </View>
                          )}
                          // onBackViewClick={()=>this.onBack()}
                />
                <WebView
                    injectedJavaScript={this._getBaseScript({token,injectedParams})}
                    ref={webview=>this.webView=webview}
                    automaticallyAdjustContentInsets={false}
                    onNavigationStateChange={(e)=>this.onNavigationStateChange(e)}
                    source={url?{uri: url}:{html:html}}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    decelerationRate="normal"
                    onMessage={this.onMessage.bind(this)}
                    scalesPageToFit={true}
                />
            </View>
        )
    }

    componentDidMount(){
        setCustomClickBackFunc(this.onBack.bind(this))
    }

    componentWillUnmount(){
        setCustomClickBackFunc(null)
    }

    onBack() {
        //如果网页还有上级页面（可返回）
        if (this.state.canBack) {
            this.webView.goBack();
        } else {
            this.props.dispatch(goBack());
        }
    }

    onNavigationStateChange(e) {
        this.setState({
            title: e.title,
            //设置是否要以返回上级页面
            canBack: e.canGoBack
        });
    }
}

var titleBarHeight;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: mainBackgroundColor,
    },
    icoLayout: {
        height: titleBarHeight,
        paddingVertical:15,
        paddingRight:3,
        paddingLeft:15,
        justifyContent: 'center',
    },
    backIco: {
        width: 15,
        height: 15,
        resizeMode: 'contain',
    },
    closeBtn:{
        paddingVertical:15,
        paddingRight:15,
        paddingLeft:3,
    }
});

selector = (state) => {
    return {
        token: state.loginStore.token,
    }
};

export default connect(selector)(CommonWebView);