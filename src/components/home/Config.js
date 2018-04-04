import {View} from "react-native";
import React from 'react';

import CarouselHome from "./home/CarouselHome";
import GuideModules from "./home/GuideModules";
import HYBuy from "./home/HYBuy";
import RushPurchase from "./home/RushPurchase";
import GuideStreet from "./home/GuideStreet";
import Sale from "./home/Sale";
import QuarterZone from "./home/QuarterZone";
import SpecialZone from "./home/SpecialZone";


export const ModuleStyle = {
    BANNER: 'BANNER',   //轮播图
    GUIDE: 'GUIDE',     //功能入口
    A: 'A',
    IA: 'IA',
    B: 'B',
    IB: 'IB',
    C: 'C',
    F4: 'F4',
    DEFAULT: 'DEFAULT',
};


export function getTargetModuleComponent({index,item}){
    let modelId = item.modelId;
    let flag = item.flag;
    let content = getModuleComponent(modelId,item.data,flag);
    if(content){
        return <View key={index}>{content}</View>
    }
    return content;
}

function getModuleComponent(modelId,source,flag) {
    switch (modelId){
        case ModuleStyle.BANNER://广告轮播图
            return <CarouselHome data={source} {...flag}/>;
        case ModuleStyle.GUIDE:
            return <GuideModules {...flag}/>;
        case ModuleStyle.F4:
            return <HYBuy data={source} {...flag}/>;
        case ModuleStyle.A:
            return <RushPurchase data={source} {...flag}/>;
        case ModuleStyle.IA:
            return <GuideStreet data={source.contents} {...flag}/>;
        case ModuleStyle.B:
            return <Sale data={source} {...flag}/>;
        case ModuleStyle.IB:
            return <Sale data={source} isIntegral={true} {...flag}/>;
        case ModuleStyle.C:
            return <QuarterZone data={source} {...flag}/>;
        case ModuleStyle.DEFAULT:
            return <SpecialZone data={source} {...flag}/>;
        default:return null;
    }
}