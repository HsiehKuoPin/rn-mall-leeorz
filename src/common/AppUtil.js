import {Platform,Dimensions} from 'react-native';
import {api_product, getHost} from "./CommonRequest";

export const SERVICE_CALL = '4008009433';
const {height,width} = Dimensions.get('window');
export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;


export function isIPhone5(){
    return Platform.OS === 'ios' && Dimensions.get('window').width === 320
}

export function isTrue(param) {
    return param === 'Y';
}

export function getQiniuUrl() {
    if(getHost() === api_product){
        return 'http://p0xk4au0z.bkt.clouddn.com/';
    }else{
        return 'http://p0xkrqo35.bkt.clouddn.com/';
    }
}

export function getAgentLink() {
    if(getHost() === api_product){
        return `http://agent.newmall.ejiamall.cn/?time=${(new Date()).valueOf()}`;
    }else{
        return `http://japi.wdfcds.com/?time=${(new Date()).valueOf()}`;
    }
}



