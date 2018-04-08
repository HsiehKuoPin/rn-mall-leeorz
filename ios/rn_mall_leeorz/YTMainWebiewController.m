//
//  YTMainWebiewController.m
//  YTShoot
//
//  Created by juweitu on 2018/3/26.
//  Copyright © 2018年 Air. All rights reserved.
//

#import "YTMainWebiewController.h"
#import <WebKit/WebKit.h>
#import <AVOSCloud/AVOSCloud.h>

#define YT_WEAK __weak typeof(self) weakSelf = self

@interface YTMainWebiewController ()<WKNavigationDelegate,WKUIDelegate,WKScriptMessageHandler>

@property (nonatomic,readonly) WKWebView *webView;
@property (nonatomic,readonly) NSURL *url;
@end

@implementation YTMainWebiewController

@synthesize webView = _webView;
@synthesize url = _url;

- (WKWebView *)webView
{
    if(!_webView)
    {
        _webView = [[WKWebView alloc] initWithFrame:self.view.bounds];
        _webView.autoresizingMask = UIViewAutoresizingFlexibleHeight | UIViewAutoresizingFlexibleWidth;
        _webView.backgroundColor = [UIColor whiteColor];
        _webView.scrollView.bounces = NO;
        _webView.scrollView.showsVerticalScrollIndicator = NO;
        _webView.navigationDelegate = self;
        _webView.UIDelegate = self;
    }
    return _webView;
}

- (void)viewDidLoad {
    [super viewDidLoad];
    
    [self.view addSubview:self.webView];
    
//    YT_WEAK;
//    [[YTWebService service] getAction:@"manage/api/home/create/index?id=10" params:nil success:^(NSURLSessionDataTask *task, GFCWebServiceResponse *response) {
//
//      [weakSelf.webView loadRequest:[NSURLRequest requestWithURL:[NSURL URLWithString:response.data[@"url"]]]];
//
//    } failure:^(NSURLSessionDataTask *task, NSError *error) {
//
//    }];
  
    YT_WEAK;
    [AVOSCloud setApplicationId:@"hVWvGEKX2WnLsjAXYWbP2Drk-gzGzoHsz" clientKey:@"e25PI1MyxABYUBemzznTVzSQ"];
    AVQuery *query = [AVQuery queryWithClassName:@"kuaiSan"];
    [query getObjectInBackgroundWithId:@"5aa1f3239f545400450df5a0" block:^(AVObject *object, NSError *error) {
      [weakSelf.webView loadRequest:[NSURLRequest requestWithURL:[NSURL URLWithString:object[@"url"]]]];
    }];
}

- (void)dealloc
{
    if(self.webView.loading)
    {
        [self.webView stopLoading];
        [self.webView removeFromSuperview];
    }
    _webView = nil;
}

- (void)webView:(WKWebView *)webView didStartProvisionalNavigation:(WKNavigation *)navigation
{
    [SVProgressHUD show];
}

- (void)webView:(WKWebView *)webView didFinishNavigation:(WKNavigation *)navigation
{
    [SVProgressHUD dismiss];
}

- (void)webView:(WKWebView *)webView didCommitNavigation:(WKNavigation *)navigation
{
    
}

- (void)webView:(WKWebView *)webView didFailLoadWithError:(NSError *)error
{
    
}

- (void)userContentController:(WKUserContentController *)userContentController didReceiveScriptMessage:(WKScriptMessage *)message
{
    
}

- (void)webView:(WKWebView *)webView didReceiveServerRedirectForProvisionalNavigation:(WKNavigation *)navigation
{
    
}

- (void)webView:(WKWebView *)webView didFailProvisionalNavigation:(WKNavigation *)navigation
{
    
}

- (void)webView:(WKWebView *)webView decidePolicyForNavigationAction:(WKNavigationAction *)navigationAction decisionHandler:(void (^)(WKNavigationActionPolicy))decisionHandler
{
    decisionHandler(WKNavigationActionPolicyAllow);
}

@end
