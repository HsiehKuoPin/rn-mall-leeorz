// import React from 'react'
import {StyleSheet} from 'react-native';
import {mainColor, placeholderTextColor} from "../../constraint/Colors";
export const style_edit_text =StyleSheet.create({

    //矩形
    rectangle_border: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        borderWidth: 1,
        borderColor:'white',
        backgroundColor: 'rgba(255, 255, 255, 0.35)',
    },
    //半圆
    circle_border: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
        borderWidth: 1,
        borderColor:'white',
        backgroundColor: 'rgba(255, 255, 255, 0.35)',
    },
    //默认
    _default:{
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
        borderWidth: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.35)',
    },
    //下划线
    under_line:{
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 13,
        borderBottomColor: placeholderTextColor,
        paddingBottom: 5,
        borderBottomWidth: 0.5,
    },
    textInput: {
        fontSize: 14,
        flex: 1,
        padding: 0,
        marginLeft:5,
    },
});

