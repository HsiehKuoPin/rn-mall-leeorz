/**
 * Created by PC on 2017/7/18.
 */
import React, {Component} from 'react';
import {Image, Text, View} from "react-native";
export default class TabBarItem extends Component {


    constructor(props) {
        super(props);
    }

    static defaultProps = {
        // tintColor: '#ffffff',
        focused: false,
        normalImage: NaN,
        selectedImage: NaN,
    };

    static propTypes = {
        tintColor: React.PropTypes.string,
        focused: React.PropTypes.bool,
        normalImage: React.PropTypes.number,
        selectedImage: React.PropTypes.number,
    };

    render() {
        return (
            <View style={{width: 23, height: 23}}>

            <Image source={ this.props.focused ? this.props.selectedImage : this.props.normalImage }
                   style={ {
                       // tintColor: this.props.tintColor,
                       width: 23, height: 23} }
            />
            </View>
        );
    }
}