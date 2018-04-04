/**
 * Created by PC on 2017/7/18.
 */
import React, {Component} from 'react';
import {Image, Text, View} from "react-native";
import {mainColor} from "../../constraint/Colors";
export default class TabBarItem extends Component {


    constructor(props) {
        super(props);
    }

    static defaultProps = {
        tintColor: null,
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
        let showIcon = this.props.focused ? this.props.selectedImage : this.props.normalImage;;

            return (
            <View style={{width: 23, height: 23}}>

            <Image source={showIcon}
                   style={{
                       tintColor: this.props.tintColor,
                       width: 23, height: 23} }
            />
            </View>
        );
    }
}