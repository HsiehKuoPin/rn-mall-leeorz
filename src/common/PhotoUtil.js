import {emptyImgUrl} from "../constraint/Image";
const IMAGEVIEW2 = 'imageView2';
const QINIU = 'clouddn';
const SQUARE = `${IMAGEVIEW2}/0/w/`;

const SMALL = 120;
const MIDDLE = 240;
const HIGH = 400;

export function getSmall(link) {
        return getLink(link,IMAGEVIEW2,`${SQUARE}${SMALL}`);
}

export function getMiddle(link) {
    return getLink(link,IMAGEVIEW2,`${SQUARE}${MIDDLE}`);
}

export function getHigh(link) {
    return getLink(link,IMAGEVIEW2,`${SQUARE}${HIGH}`);
}

export function getLink(link,type,param) {
    if(!link)return emptyImgUrl;
    if(link.indexOf(QINIU) !== -1){
        let index = link.indexOf(`?${type}`);//如果已经有规格参数了就直接覆盖
        if(index !== -1){
            return `${link.substr(0,index)}?${param}`;
        }else{
            return `${link}?${param}`;
        }
    }

    return link;
}