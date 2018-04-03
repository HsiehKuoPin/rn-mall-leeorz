// Stepper.js

'use strict';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, View, Text, TouchableOpacity, ViewPropTypes, Image} from 'react-native';
import {ic_addButton, ic_reduceButton, ic_un_reduceButton} from "../constraint/Image";
import {contentTextColor, mainBackgroundColor, placeholderTextColor, titleTextColor} from "../constraint/Colors";
import XImage from "./XImage";


export default class Stepper extends Component {

  static propTypes = {
    ...ViewPropTypes,
    defaultValue: PropTypes.number,
    value: PropTypes.number,
    step: PropTypes.number,
    max: PropTypes.number,
    min: PropTypes.number,
    valueStyle: Text.propTypes.style,
    valueFormat: PropTypes.func, //(value)
    subButton: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    addButton: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    disabled: PropTypes.bool,
    editable: PropTypes.bool,
    onChange: PropTypes.func, //(value)
  };

  static defaultProps = {
    ...View.defaultProps,
    defaultValue: 0,
    step: 1,
    subButton: <XImage style={{width: 30, height: 30}} source={ic_reduceButton}/>,
    addButton: <XImage style={{width: 30, height: 30}} source={ic_addButton}/>,
    disabled: false,
    editable: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      value: props.value ? props.value : (props.defaultValue ? props.defaultValue : 0),
      height: null,
    };
  }

  buildProps() {
    let {style, valueStyle, subButton, addButton, disabled, editable, pointerEvents, opacity, ...others} = this.props;

    style = [{
      backgroundColor: '#fff',
      borderColor: '#ccc',
      borderWidth: 0,
      borderRadius: 2,
      flexDirection: 'row',
      alignItems: 'center',
      overflow: 'hidden',
    }].concat(style);
    valueStyle = [{
      color: '#ccc',
      fontSize: 13,
      textAlign: 'center',
      minWidth: 40,
      paddingHorizontal: 8,
    }].concat(valueStyle);

    let btnStyle = {
      width: 20,
      height: 20,
      alignItems: 'center',
      justifyContent: 'center',
    };
    let btnTextStyle = {
      color: '#ccc',
      fontSize: 13,
    };
    if (!React.isValidElement(subButton)) {
      subButton = (
        <View style={[styles.imageButtonStyle, btnStyle]}>
          <Text style={btnTextStyle}>{subButton}</Text>
        </View>
      );
    }
    if (!React.isValidElement(addButton)) {
      addButton = (
        <View style={[styles.imageButtonStyle, btnStyle]}>
          <Text style={btnTextStyle}>{addButton}</Text>
        </View>
      );
    }

    if (disabled) {
      pointerEvents = 'none';
      opacity = 0.35;
    }

    this.props = {style, valueStyle, subButton, addButton, disabled, editable, pointerEvents, opacity, ...others};
  }

  onLayout(e) {
    if (this.state.height === null) {
      this.setState({
        height: e.nativeEvent.layout.height,
      });
    }
    this.props.onLayout && this.props.onLayout(e);
  }

  onSubButtonPress() {
    let {value, step, min, onChange} = this.props;
    if (value === undefined) value = this.state.value;
    value -= step;
    if (value < min) value = min;
    this.setState({value});
    onChange && onChange(value);
  }

  onAddButtonPress() {
    let {value, step, max, onChange} = this.props;
    if (value === undefined) value = this.state.value;
    value += step;
    if (value > max) value = max;
    this.setState({value});
    onChange && onChange(value);
  }

  render() {
    this.buildProps();

    let {style, subButton, addButton, value, valueStyle, valueFormat, max, min, disabled, editable, onLayout, ...others} = this.props;

    if (value === undefined) value = this.state.value;

    let subDisabled = !editable || value <= min;
    let addDisabled = !editable || value >= max;
    let subOpacity = !disabled && subDisabled ? 0.5 : 1;
    let addOpacity = !disabled && addDisabled ? 0.5 : 1;

    return (
      <View style={style} onLayout={e => this.onLayout(e)} {...others}>
        <TouchableOpacity disabled={subDisabled} activeOpacity={0.5} onPress={() => this.onSubButtonPress()}>
          <View style={{opacity: subOpacity}}>
            {subButton}
          </View>
        </TouchableOpacity>
        {/*<Text style={valueStyle} numberOfLines={1}>{valueFormat ? valueFormat(value) : value}</Text>*/}
        <View style={styles.viewLabelStyle}>
          <Text style={[styles.labelStyle,]}>{valueFormat ? valueFormat(value) : value}</Text>
        </View>
        <TouchableOpacity disabled={addDisabled} activeOpacity={0.5} onPress={() => this.onAddButtonPress()}>
          <View style={{opacity: addOpacity}}>
            {addButton}
          </View>
        </TouchableOpacity>
      </View>
    );
  }

}
const styles = StyleSheet.create({
    viewLabelStyle: {
        backgroundColor: mainBackgroundColor,
        borderRadius: 3,
        borderWidth: 0.8,
        borderColor: placeholderTextColor,
        minWidth: 45,
        height: 30,
        marginLeft: 10,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    labelStyle: {
        color: contentTextColor,
        paddingLeft: 5,
        paddingRight: 5,
        textAlign: 'center',
    },
    imageButtonStyle: {
        backgroundColor: mainBackgroundColor,
        borderRadius: 3,
        borderWidth: 0.5,
        borderColor: placeholderTextColor,
        justifyContent: 'center',
        alignItems: 'center'
    },
});

