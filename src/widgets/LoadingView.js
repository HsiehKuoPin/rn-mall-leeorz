import React,{Component} from 'react';
import {
    Animated,
    Easing,
    View,
} from 'react-native';
import {ic_circle_logo} from '../constraint/Image';

export default class LoadingView extends Component{
    constructor(props){
        super(props);
        this.state = {
            loading:true,
            rotateValue: new Animated.Value(0),//旋转角度的初始值
        }
    }

    startAnimation() {
        this.state.rotateValue.setValue(0);
            Animated.timing(this.state.rotateValue, {
                toValue: 1,  //角度从0变1
                duration:1000,  //从0到1的时间
                easing: Easing.out(Easing.linear),//线性变化，匀速旋转
            }).start(()=> {
                this.state.loading && this.startAnimation()
            });
    }

    componentDidMount() {
        //在初始化渲染执行之后立刻调用动画执行函数
        this.startAnimation();
    }

    componentDidUnMount(){
        this.setState({
            loading:false,
        })
    }

    render(){
        return (

            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                }}>
                <Animated.Image source = {ic_circle_logo}
                                style = {{width: 70,height: 70,
                                    transform: [
                                        //使用interpolate插值函数,实现了从数值单位的映射转换,上面角度从0到1，这里把它变成0-360的变化
                                        {rotateZ: this.state.rotateValue.interpolate({
                                            inputRange: [0,1],
                                            outputRange: ['360deg','0deg'],
                                        })},
                                    ]}}>
                </Animated.Image>
            </View>

        )
    }
}
