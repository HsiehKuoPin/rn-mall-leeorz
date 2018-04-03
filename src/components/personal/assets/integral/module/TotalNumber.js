import React,{Component} from 'React';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import {IntegralStyles} from "../../../../../styles/IntegralStyles";
import {formatMoney} from "../../../../../common/StringUtil";

export class TotalNumber extends Component{
    constructor(props){
        super(props);
        this.state = {
            total:0,
            totalTip:'',
        };
    }
    static defaultProps = {
        total:0,
        totalTip:''
    };

    componentWillReceiveProps(nextProps) {
        this.setState(Object.assign({},this.state,nextProps));
    }

    //渲染总数部分
    _renderTotal=(total)=>{
        if (total === undefined) return;
        // total = Number(total).toFixed(2);
        if (total.indexOf('.')>-1) {
            let strs = total.split("."); //字符分割
            return <Text style={IntegralStyles.bigTotalNumberStyle}>
                {strs[0]+'.'}
                <Text style={IntegralStyles.smallTotalNumberStyle}>{strs[1]}</Text>
            </Text>
        }else {
            return <Text style={IntegralStyles.bigTotalNumberStyle}>{total}</Text>
        }
    };

    render(){
        return <View style={{alignItems:'center',justifyContent:'center'}}>
                {this._renderTotal(formatMoney(this.props.total,false))}
                <Text style={IntegralStyles.totalTextStyle}>{this.props.totalTip}</Text>
            </View>

    }
}