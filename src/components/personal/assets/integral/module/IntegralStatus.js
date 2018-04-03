import React,{Component} from 'React';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import {mainColor, placeholderTextColor, titleTextColor} from "../../../../../constraint/Colors";
import {formatMoney} from "../../../../../common/StringUtil";

export default class IntegralStatus extends Component{
    constructor(props){
        super(props);
        this.state={
            available:0,
            availableText:'',
            frozen:0,
            frozenText:'',
        }
    }
    static defaultProps = {
        available:0,
        availableText:'',
        frozen:0,
        frozenText:'',
    };

    componentDidMount(){
        let {available,availableText,frozen,frozenText} = this.props;
        this.setState({available,availableText,frozen,frozenText});
    }


    componentWillReceiveProps(nextProps){
        let {available,availableText,frozen,frozenText} = nextProps;
        this.setState({available,availableText,frozen,frozenText});
    }

    render(){
        return (
        <View style={styles.topLayout}>
            <View style={styles.statusLayout}>
                <Text style={styles.statusValue}>{formatMoney(this.state.available,false)}</Text>
                <Text style={styles.statusText}>{this.state.availableText}</Text>
            </View>
            <View style={styles.line}/>
            <View style={styles.statusLayout}>
                <Text style={styles.statusValue}>{formatMoney(this.state.frozen,false)}</Text>
                <Text style={styles.statusText}>{this.state.frozenText}</Text>
            </View>
        </View>
        );
    }
}

const styles = StyleSheet.create({
    topLayout:{
        backgroundColor:'white',
        marginHorizontal:10,
        flexDirection:'row',
        borderRadius:3,
        height:65,
        marginTop:-32.5,
        shadowOpacity: 0.2,
        shadowOffset: {height: 2, width: 2},
        shadowRadius: 3,
        elevation: 2,
    },
    line:{
        width:0.5,
        backgroundColor:placeholderTextColor,
        marginVertical:10
    },
    statusLayout:{
        alignItems:'center',
        justifyContent:'center',
        flex:1
    },
    statusValue:{
        color:mainColor,
        fontSize:18,
        marginBottom:5
    },
    statusText:{
        color:titleTextColor,
        fontSize:13
    }
});