import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
} from 'react-native';
import connect from "react-redux/es/connect/connect";
import {content2TextColor, contentTextColor, mainBackgroundColor, titleTextColor} from "../../constraint/Colors";
import {login_logo} from "../../constraint/Image";
import TitleBar from "../../widgets/TitleBar";
import {isIPhone5} from "../../common/AppUtil";
import {APP_NAME} from "../../constraint/Strings";

const {width} = Dimensions.get('window');

class AboutUs extends Component {

    constructor(props) {
        super(props)
    }

    render(){
        return(
            <View style={styles.container}>
                <TitleBar title={'关于我们'}
                          hideRight={true}
                />
                <View style={styles.viewStyle}>
                    <Image source={login_logo} style={styles.logo}/>
                    <Text style={styles.titleText}>{APP_NAME + ' v'+this.props.appVersion}</Text>
                    <Text style={styles.contentText}>{`\u3000\u3000${APP_NAME}共享社交商城是集合C2F、B2C、O2O等多种优势的创新型购物商城。商城产品涵盖日常用品、经典名车、保健养生、珠宝饰品、家用电器、数码科技、儿童用品等几十个品类、数千个品种，满足了消费者品质生活的需求。${APP_NAME}创新性提出“C2F+S”共享社交电商新模式，即构建“商城消费+社交电商+共享平台+大数据应用+区块链+实体经济+产业资本”的共享经济生态圈，打造一个平台与商家、创业者、消费者共生、共创、共享、共赢的新商业生态系统。\n`}</Text>
                    <Text style={{flex: 1}}> </Text>
                    <Text style={[styles.copyrightText, {marginBottom: 40}]}>联系邮箱:admin@ejiamall.cn</Text>
                    <Text style={[styles.copyrightText, {marginBottom: 10}]}>copyright@2017 - 2037</Text>
                    <Text style={[styles.copyrightText, {marginBottom: 20}]}>广东{APP_NAME}电子商务有限公司</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: mainBackgroundColor
    },

    viewStyle: {
        backgroundColor:'white',
        marginTop:10,
        flex:1,
        marginBottom:10,
        marginLeft:10,
        marginRight:10,
        borderWidth: 0,
        borderRadius: 5,
        shadowColor: 'gray',
        shadowOffset: {height: 2, width: 2},
        shadowRadius: 5,
        shadowOpacity: 0.2,
        elevation: 4,
        alignItems: 'center',
    },

    logo: {
        width:width/3.3,
        height:width/3.3,
        marginTop: 25,
        resizeMode: 'contain',
    },

    titleText: {
        color: titleTextColor,
        fontSize: 20,
        marginTop: 15,
    },

    contentText: {
        color: contentTextColor,
        fontSize: 13,
        marginTop: 20,
        paddingHorizontal: 12,
        lineHeight: isIPhone5() ? 16 : 22,
    },

    copyrightText: {
        color: content2TextColor,
        fontSize: 14,
    },
});

selector = (state) => {
    return {
        appVersion: state.loginStore.appVersion,
    }
};

export default connect(selector)(AboutUs);