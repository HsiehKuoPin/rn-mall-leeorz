import React,{Component} from 'react';
import {
    ActivityIndicator,
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
                <ActivityIndicator
                    animating={true}
                    size="large"
                />
            </View>

        )
    }
}
