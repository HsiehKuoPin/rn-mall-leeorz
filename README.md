#android 运行命令:
==============================================
react-native run-android
android 打包命令:
react-native bundle --platform android --dev false --entry-file index.android.js  --bundle-output output/android/newmall.jsbundle --assets-dest output/android/

#ios 运行命令:
==============================================
react-native run-ios
ios 打包命令:
react-native bundle --platform ios --dev false --entry-file index.ios.js  --bundle-output output/ios/newmall.jsbundle --assets-dest output/ios/


#关于订单列表界面initialPage 设置时候ios 列表一片空白的解决方案
================================================================================
##[ScrollView contentOffset bug#15808]  (https://github.com/facebook/react-native/issues/15808)
--------------------------------------------------------------------------------
目标文件路径:
/node_modules/react-native/React/Views/RCTScrollView.m
注释掉这三段代码:
//self.contentOffset = CGPointMake(
//  MAX(0, MIN(originalOffset.x, fullContentSize.width - boundsSize.width)),
//  MAX(0, MIN(originalOffset.y, fullContentSize.height - boundsSize.height)));
再增加这段:
self.contentOffset= originalOffset;


#关于修改FlatList Android RefreshControl 控件的颜色
================================================================================
目标文件路径:
node_modules/react-native/Libraries/Lists/VirtualizedList.js
第753行添加
colors={props.refreshControlAndroidColors}

再在使用Flatlist的添加 'refreshControlAndroidColors={[color]}'即可
ps:如果没有下拉刷新的功能则不用添加'refreshControlAndroidColors={[color]}'

#测试账号
============
18684711835
123456
