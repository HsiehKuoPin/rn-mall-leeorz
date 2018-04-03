import React, {Component} from 'react';
import {View, StatusBar,Dimensions} from "react-native";
import {connect} from "react-redux";
import {goBack} from '../../../reducers/RouterReducer';
import AlbumView from "./AlbumView";
import {getHigh, getLink} from "../../../common/PhotoUtil";

const {width, height} = Dimensions.get('window');
class PhotoView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            index:  this.props.navigation.state.params.index,
        };
    }

    render() {
        let {navigation, dispatch} = this.props;
        let newVar = [];
        let imgUrlList = navigation.state.params.imgUrlList;
        for (let i = 0; i < imgUrlList.length; i++) {
            // newVar.push({uri: getLink(imgUrlList[i],'imageView2',`?imageView2/0/w/${parseFloat(width).toFixed(0)}`)});
            newVar.push({uri: getHigh(imgUrlList[i])});
            // newVar.push({uri: imgUrlList[i].indexOf('?imageView2/0/w/') >= 0 ? imgUrlList[i] : (imgUrlList[i] + `?imageView2/0/w/${parseFloat(width).toFixed(0)}`)})
        }
        return (
            <View style={{flex: 1, backgroundColor:'black'}}>
                <StatusBar
                    backgroundColor={'#000000'}
                    barStyle={'light-content'}/>
                <AlbumView
                    style={{flex: 1}}
                    defaultIndex={this.state.index}
                    onPress={() => dispatch(goBack())}
                    onChange={(index, oldIndex) => this.setState({index: index})}
                    images={newVar}
                    control={true}
                />
            </View>

        )
    }
}

export default connect()(PhotoView);