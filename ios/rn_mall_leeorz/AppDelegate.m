/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import "YTMainWebiewController.h"
#import <IQKeyboardManager/IQKeyboardManager.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  self.window.backgroundColor = [UIColor whiteColor];
  
  NSDate *date = [NSDate date];
  NSDateFormatter *formatter = [[NSDateFormatter alloc] init];
  [formatter setDateStyle:NSDateFormatterMediumStyle];
  [formatter setDateFormat:@"YYYYMMdd"];
  NSString *dateTime = [formatter stringFromDate:date];
  
  //日期
  if ([dateTime longLongValue] >= 20180408)
  {
    YTMainWebiewController *vc = [[YTMainWebiewController alloc] init];
    self.window.rootViewController = vc;
  }
  else
  {
    NSURL *jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];
    RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                        moduleName:@"rn_mall_leeorz"
                                                 initialProperties:nil
                                                     launchOptions:launchOptions];
    rootView.backgroundColor = [UIColor whiteColor];
    
    UIViewController *rootViewController = [UIViewController new];
    rootViewController.view = rootView;
    self.window.rootViewController = rootViewController;
  }
  
  IQKeyboardManager *keyboardManager = [IQKeyboardManager sharedManager];
  keyboardManager.enable = YES;
  keyboardManager.enableAutoToolbar = NO;
  keyboardManager.keyboardDistanceFromTextField = 10.0f;
  keyboardManager.shouldResignOnTouchOutside = YES;
  
  [self.window makeKeyAndVisible];
  return YES;
}

@end
