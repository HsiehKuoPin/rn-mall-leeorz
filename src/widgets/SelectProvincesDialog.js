import React, {Component} from 'react';
import {View, TouchableOpacity, StyleSheet, Modal,Text,Picker} from 'react-native';

import {connect} from 'react-redux';
import {showToastShort} from "../common/CommonToast";
import {post, isSuccess} from "../common/CommonRequest"
import {placeholderTextColor} from "../constraint/Colors";

class SelectProvincesDialog extends Component {

    // 定义默认属性
    static defaultProps = {
        // 默认显示北京(省)
        selectedProvince: '北京',
        // 默认显示北京省会市)
        selectedCity: '北京',
        // 默认显示(区)
        selectedArea: '东城区'
    }

    // 通过 state 更新
    constructor(props) {
        super(props)

        this.state = {
            isVisible: false,
            jsonData: [],
            // 省
            province: [],
            // 市
            city: [],
            // 区
            area: [],
            // 选中的省
            selectedProvince: this.props.selectedProvince,
            // 选中的市
            selectedCity: this.props.selectedCity,
            // 选中的地区
            selectedArea: this.props.selectedArea,
        }
    }

    _createAreaData() {
        let data = [];
        let len = area.length;
        for(let i=0;i<len;i++){
            let city = [];
            for(let j=0,cityLen=area[i]['city'].length;j<cityLen;j++){
                let _city = {};
                _city[area[i]['city'][j]['name']] = area[i]['city'][j]['area'];
                city.push(_city);
            }

            let _data = {};
            _data[area[i]['name']] = city;
            data.push(_data);
        }
        return data;
    }

    // 获取全国省: ['省1', '省2', '省3'......]
    getProvince() {
        var result = [];

        for (var code in this.state.jsonData) {

            result.push(this.state.jsonData[code].name);
        }

        return result;
    }

    // 获取各个省的城市[['省1-城市1', '省1-城市2', '省1-城市3'......],['省2-城市1', '省2-城市2', '省2-城市3'......]]
    getProvinceCity(province) {
        var result = [];
        var cityData = [];

        for (var code in this.state.jsonData) {

            let temp = this.state.jsonData[code].name
            if (temp == province) {

                cityData = this.state.jsonData[code].addresses
                for (var j in cityData) {
                    result.push(cityData[j].name);
                }
                break;
            }
        }
        return result;
    }

    // 获取各个省的城市[['省1-城市1-区1', '省1-城市1-区2', '省1-城市1-区3'......]......]
    getProvinceCityArea(province, city) {

        var result = [];
        var cityData = [];
        for (var code in this.state.jsonData) {

            let tempProvince = this.state.jsonData[code].name
            if (tempProvince == province) {

                cityData = this.state.jsonData[code].addresses

                for (var j in cityData) {
                    let tempCity = cityData[j].name
                    //
                    if (tempCity == city) {
                        areaData = cityData[j].addresses
                        for (var f in areaData)
                        {
                            result.push(areaData[f].name);
                        }
                        break;
                    }
                }
            }
        }

        return result;
    }

    componentDidMount() {
        post('user/getAddresses', {token: this.props.token})
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    this.setState({
                        jsonData: responseData.result.addresses
                    })

                    var province = this.getProvince();
                    this.state.selectedProvince = province[0];

                    var city = this.getProvinceCity(this.state.selectedProvince)
                    this.state.selectedCity = city[0]

                    var area = this.getProvinceCityArea(this.state.selectedProvince, this.state.selectedCity)
                    this.state.selectedArea = area[0]


                    this.setState({
                        province: province,
                        city: city,
                        area: area
                    });

                } else {
                    showToastShort(responseData.message)
                }
            }).catch((e) => {
            showToastShort(e.message);
        });
    }

    updateProvince(param) {

        var cityData = this.getProvinceCity(param)
        let defaultCity = cityData[0]

        var areaData = this.getProvinceCityArea(param, defaultCity)
        let defaultArea = areaData[0]

        this.setState({
            selectedProvince: param,
            selectedCity: defaultCity,
            selectedArea: defaultArea,
            city: cityData,
            area: areaData,

        })
    }

    updateProvinceCity(city) {

        var areaData = this.getProvinceCityArea(this.state.selectedProvince, city)
        let defaultArea = areaData[0]

        console.warn(JSON.stringify(this.state.selectedProvince, city, areaData))

        this.setState({
            selectedCity: city,
            selectedArea: defaultArea,
            area: areaData,

        })
    }

    updateProvinceCityArea(area) {

        this.setState({
            selectedArea: area,

        })
    }


    renderPicker(key, i) {

        return <Picker.Item key={i} label={key} value={key}/>
    }

    dismiss() {
        this.setState({
            isVisible: false
        });
    }

    show() {
        this.setState({
            isVisible: true
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{flex: 1}}>
                    <Modal
                        transparent={true}
                        visible={true}
                        animationType={'fade'}
                        onRequestClose={() => {
                        }}>
                        <TouchableOpacity style={styles.container} activeOpacity={1} onPress={() => this.dismiss()}>
                        </TouchableOpacity>
                        <View style={{backgroundColor:'white'}}>
                            <View style={{flexDirection:'row',backgroundColor:placeholderTextColor,justifyContent:'center',alignItems:'center',height:40}}>
                                    <Text style={{textAlign:'center',marginLeft:20}}>
                                        取消
                                    </Text>
                                <Text style={{flex:1,textAlign:'center'}}>
                                    选择地址
                                </Text>
                                    <Text style={{textAlign:'center',marginRight:20}}>
                                        确定
                                    </Text>
                            </View>
                            <View style={styles.pickerViewContainer}>
                                <Picker style={{flex: 1}}
                                        selectedValue={this.state.selectedProvince}
                                        onValueChange={(language) => this.updateProvince(language)}>
                                    {this.state.province.map((key, i) => this.renderPicker(key, i))}
                                </Picker>
                                <Picker style={styles.pickerItem}
                                        selectedValue={this.state.selectedCity}
                                        onValueChange={(language) => this.updateProvinceCity(language)}>
                                    {this.state.city.map((key, i) => this.renderPicker(key, i))}
                                </Picker>
                                <Picker style={{flex: 1}}
                                        selectedValue={this.state.selectedArea}
                                        onValueChange={(area) => this.updateProvinceCityArea(area)}>
                                    {this.state.area.map((key, i) => this.renderPicker(key, i))}
                                </Picker>
                            </View>
                        </View>

                    </Modal>
                </View>
            </View>
        )
            ;
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
    },
    pickerViewContainer: {
        flexDirection: 'row',
        backgroundColor:'white',
    },
    pickerItem: {
        flex: 1,
    }
})

selector = (state) => {
    return {
        token: state.loginStore.token
    }
};

export default connect(selector)(SelectProvincesDialog);