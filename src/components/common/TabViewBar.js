import {mainColor} from "../../constraint/Colors";

const React = require('react');
const ReactNative = require('react-native');
const {
    StyleSheet,
    Text,
    View,
    Animated,
    TouchableOpacity,
    Dimensions
} = ReactNative;

const {width} = Dimensions.get('window');
let left;
let orderType;
const DefaultTabBar = React.createClass({
    propTypes: {
        goToPage: React.PropTypes.func,
        activeTab: React.PropTypes.number,
        tabs: React.PropTypes.array,
        backgroundColor: React.PropTypes.string,
        activeTextColor: React.PropTypes.string,
        inactiveTextColor: React.PropTypes.string,
        textStyle: Text.propTypes.style,
        tabStyle: View.propTypes.style,
        renderTab: React.PropTypes.func,
        underlineStyle: View.propTypes.style,
    },


    getDefaultProps() {
        return {
            activeTextColor: mainColor,
            inactiveTextColor: '#666',
            backgroundColor: "white",
        };
    },

    renderTab(name, page, isTabActive, onPressHandler) {
        const {activeTextColor, inactiveTextColor, textStyle,} = this.props;
        const textColor = isTabActive ? activeTextColor : inactiveTextColor;
        const fontWeight = isTabActive ? 'bold' : 'normal';
        const numberOfTabs = this.props.tabs.length;

        return <TouchableOpacity
            style={{flex: 1,}}
            key={name}
            accessible={true}
            accessibilityLabel={name}
            accessibilityTraits='button'
            onPress={() => onPressHandler(page)}
        >
            <View style={[styles.tab, this.props.tabStyle]}>
                <View style={{flexDirection: 'row'}}>
                    <View style={{
                        height: 30,
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: (width - 1) / numberOfTabs
                    }}>
                        <Text style={[{color: textColor, fontWeight, fontSize: 16}, textStyle,]}>
                            {name}
                        </Text>
                    </View>
                    {(this.props.isShowLine && page !== (numberOfTabs - 1)) ? (<Text style={{
                        backgroundColor: '#c7c7c7',
                        width: 0.5,
                        height: 30
                    }}/>) : null}

                </View>
            </View>
        </TouchableOpacity>;
    },

    render() {

        orderType = this.props.orderType;

        const containerWidth = this.props.containerWidth;
        const numberOfTabs = this.props.tabs.length;
        const tabUnderlineStyle = {
            position: 'absolute',
            width: containerWidth / numberOfTabs,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center"
        };

        left = this.props.scrollValue.interpolate({
            inputRange: [0, 1,], outputRange: [0, containerWidth / numberOfTabs,],
        });

        let underlineWidth = (this.props.underlineWidth === undefined) ? 45 : this.props.underlineWidth;
        return (
            <View>
                <View style={[styles.tabs, {backgroundColor: this.props.backgroundColor,}, this.props.style,]}>
                    {this.props.tabs.map((name, page) => {
                        const isTabActive = this.props.activeTab === page;
                        const renderTab = this.props.renderTab || this.renderTab;

                        return renderTab(name, page, isTabActive, this.props.goToPage);
                    })}

                    <Animated.View
                        style={[{transform: [{translateX: left}]}, tabUnderlineStyle, this.props.underlineStyle]}>

                        <View style={{height: 2, width: underlineWidth, backgroundColor: mainColor,}}>
                        </View>
                    </Animated.View>
                </View>

                <View style={{backgroundColor: '#c7c7c7', width: width, height: 0.5, marginTop: 1}}/>
            </View>
        );
    },
});


const styles = StyleSheet.create({
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    tabs: {
        height: 47,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
});

module.exports = DefaultTabBar;
