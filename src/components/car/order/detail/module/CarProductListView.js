import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    Text,
} from 'react-native';

import {content2TextColor, mainColor, placeholderTextColor, titleTextColor} from "../../../../../constraint/Colors";
import XImage from "../../../../../widgets/XImage";

class CarProductListView extends Component {

    _keyExtractor = (item, index) => index;

    render() {
        var data = this.props.data;
        var contentArr;
        contentArr = data.productSkuSpecProperty.split(',');
        return (
            <View>
                <FlatList horizontal={false}
                          data={[data]}
                          showsHorizontalScrollIndicator={false}
                          contentContainerStyle={styles.flatListStyle}
                          numColumns={1}
                          keyExtractor={this._keyExtractor}
                          renderItem={({item, index}) =>
                              <View style={{
                                  borderTopLeftRadius: 6,
                                  borderTopRightRadius: 6,
                              }}>
                                  <View
                                      key={index}
                                      style={styles.viewStyle}>
                                      <View style={styles.ImageViewStyle}>
                                          <XImage
                                              uri={item.productImg}
                                              style={styles.imageStyle}/>
                                      </View>

                                      <View style={{flex: 1, marginTop: 15, marginRight: 10}}>
                                          <Text style={{
                                              fontSize: 15,
                                              paddingBottom: 5,
                                              color: titleTextColor,
                                              lineHeight: 20,
                                          }}
                                                numberOfLines={2}>{item.productName}</Text>
                                          {
                                              contentArr.map((item, index) => <Text
                                                  style={{
                                                      marginRight: 30,
                                                      marginBottom: 5,
                                                      fontSize: 13,
                                                      color: content2TextColor,
                                                  }}
                                                  key={index}
                                                  numberOfLines={1}>{item}</Text>)
                                          }
                                      </View>
                                  </View>
                                  <View style={{
                                      marginLeft: 15,
                                      marginRight: 15,
                                      backgroundColor: placeholderTextColor,
                                      height: 0.5
                                  }}/>
                              </View>

                          }
                />
                <View style={{flex: 1}}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    flatListStyle: {
        backgroundColor: '#00000000',
    },
    viewStyle: {
        flexDirection: 'row',
        backgroundColor: 'white',
        marginBottom: 5,
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6
    },
    ImageViewStyle: {
        margin: 15,
        borderWidth: 0.5,
        borderColor: placeholderTextColor,
        borderRadius: 5,
        backgroundColor:'white',
        shadowColor: placeholderTextColor,
        shadowOffset: {height: 4, width: 4},
        shadowRadius: 3,
        shadowOpacity: 0.2,
        elevation: 2
    },
    imageStyle: {
        borderRadius: 5,
        width: 90,
        height: 90,
    },
});

export default (CarProductListView);
