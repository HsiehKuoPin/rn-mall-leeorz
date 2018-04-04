import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {emptyImgUrl} from "../constraint/Image";
import {tintColor} from "../constraint/Colors";

export default class XImage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {style, uri, ...others} = this.props;
        return (
            <Image style={[styles.defaultStyle, style]}
                   source={{uri: (uri === '' || !uri) ? emptyImgUrl : uri}}  {...others}/>
        )
    }
}

const styles = StyleSheet.create({
    defaultStyle: {
        resizeMode: 'contain',
    }
});