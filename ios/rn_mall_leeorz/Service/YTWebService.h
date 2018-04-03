//
//  GFCWebService.h
//  GFCMall
//
//  Created by juweitu on 2017/11/28.
//  Copyright © 2017年 juweitu. All rights reserved.
//

#import <Foundation/Foundation.h>

///服务端响应代码枚举
typedef NS_ENUM(NSUInteger, GFCWebServiceResponseCode)
{
  ///成功
  GFCWebServiceResponseSuccess         = 1,
};

extern NSString * const GFCWebServiceAppHost;

#pragma mark - GFCWebServiceResponse

///接口响应类
@interface GFCWebServiceResponse : MTLModel<MTLJSONSerializing>

///响应代码(code)
@property (nonatomic,readonly) GFCWebServiceResponseCode code;
///响应数据(data)
@property (nonatomic,readonly) id data;
///响应消息(message)
@property (nonatomic,readonly) NSString *message;
///接口是否正常返回数据
@property (nonatomic,readonly) BOOL success;

@end

#pragma mark - GFCWebService

/**
 *  调用接口成功回调
 *
 *  @param response  响应对象
 */
typedef void(^ GFCWebServiceSuccessCallBack)(NSURLSessionDataTask *task,GFCWebServiceResponse *response);

/**
 *  调用接口失败回调
 *
 *  @param error     错误对象
 */
typedef void(^ GFCWebServiceFailureCallBack)(NSURLSessionDataTask *task,NSError *error);

@interface YTWebService : NSObject

@property (nonatomic,copy) NSString *userAgent;

/**
 *  获取接口调用对象单例
 *
 *  @return 接口调用对象单例
 */
+ (instancetype)service;

- (void)getAction:(NSString *)action
           params:(NSDictionary *)params
          success:(GFCWebServiceSuccessCallBack)successCallBack
          failure:(GFCWebServiceFailureCallBack)failureCallBack;

- (void)postAction:(NSString *)action
            params:(NSDictionary *)params
           success:(GFCWebServiceSuccessCallBack)successCallBack
           failure:(GFCWebServiceFailureCallBack)failureCallBack;

- (NSURLSessionDataTask *)postAction:(NSString *)action
                              params:(NSDictionary *)params
                               files:(NSDictionary *)files
                             success:(GFCWebServiceSuccessCallBack)successCallBack
                             failure:(GFCWebServiceFailureCallBack)failureCallBack;

- (NSDictionary *)fileDictionaryOfImageInfo:(NSDictionary *)imgInfo;
- (NSDictionary *)fileDictionaryOfAudioInfo:(NSDictionary *)audioInfo;
- (NSDictionary *)fileDictionaryOfVideoInfo:(NSDictionary *)videoInfo;

- (NSDictionary *)fileDictionaryOfImageInfo:(NSDictionary *)imgInfo
                                  audioInfo:(NSDictionary *)audioInfo
                                  videoInfo:(NSDictionary *)videoInfo;

@end

