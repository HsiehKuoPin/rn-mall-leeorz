import React,{Component} from 'react';
import Content from './style2/SelectAddress';
export default class SelectAddress extends Component{
    constructor(props){
        super(props)
    }

    render() {
        return <Content {...this.props}/>
    }
}