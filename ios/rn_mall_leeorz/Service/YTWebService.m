//
//  GFCWebService.m
//  GFCMall
//
//  Created by juweitu on 2017/11/28.
//  Copyright © 2017年 juweitu. All rights reserved.
//

#import "YTWebService.h"

#pragma mark - GFCWebServiceResponse

NSString * const GFCWebServiceResponseCodeKey = @"code";
NSString * const GFCWebServiceResponseDataKey = @"data";
NSString * const GFCWebServiceResponseMessageKey = @"msg";

NSString * const GFCMultipartFormDataTypeImage = @"image/jpeg";
NSString * const GFCMultipartFormDataTypeVideo = @"video/mp4";
NSString * const GFCMultipartFormDataTypeAudio = @"audio/amr";

@interface GFCWebServiceResponse()

/**
 *  初始化服务端响应对象
 *
 *  @param code    响应代码
 *  @param message 消息
 *  @param data    数据
 *
 *  @return 响应对象
 */
- (instancetype)initWithCode:(GFCWebServiceResponseCode)code
                     message:(NSString *)message
                        data:(NSDictionary *)data;

@end

@implementation GFCWebServiceResponse

- (instancetype)initWithCode:(GFCWebServiceResponseCode)code
                     message:(NSString *)message
                        data:(NSDictionary *)data;
{
  if(self = [super init])
  {
    _code = code;
    _data = data;
    _message = message;
  }
  return self;
}

- (BOOL)success
{
  return (self.code == GFCWebServiceResponseSuccess);
}

+ (NSDictionary *)JSONKeyPathsByPropertyKey
{
  return @{@"code":GFCWebServiceResponseCodeKey,
           @"message":GFCWebServiceResponseMessageKey,
           @"data":GFCWebServiceResponseDataKey};
}

@end

NSString * const YTWebServiceAppHost = @"http://120.78.87.79/";

@interface YTWebService()

@property (nonatomic,strong) AFHTTPSessionManager *requestManager;
@end

@implementation YTWebService

+ (instancetype)service
{
  static YTWebService *shared = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    shared = [[self alloc] init];
    
    NSString *bundleName = [[NSBundle mainBundle] objectForInfoDictionaryKey:(NSString *)kCFBundleNameKey];
    NSInteger v = [[[NSBundle mainBundle] objectForInfoDictionaryKey:(NSString *)kCFBundleVersionKey] integerValue];
    
    NSString *userAgent = [[[UIWebView alloc] init] stringByEvaluatingJavaScriptFromString:@"navigator.userAgent"];
    userAgent = [userAgent stringByAppendingFormat:@"GFCmall/%@/%ld",bundleName,(long)v];
    shared.userAgent = userAgent;
    
    NSDictionary *dictionnary = [[NSDictionary alloc] initWithObjectsAndKeys:userAgent, @"UserAgent", nil];
    [[NSUserDefaults standardUserDefaults] registerDefaults:dictionnary];
    
    shared.requestManager = [[AFHTTPSessionManager alloc] initWithSessionConfiguration:[NSURLSessionConfiguration defaultSessionConfiguration]];
    shared.requestManager.responseSerializer.acceptableContentTypes = [NSSet setWithObjects:@"application/json",@"text/html",@"charset=UTF-8",@"text/plain", nil];
    shared.requestManager.responseSerializer = [AFJSONResponseSerializer serializer];
    shared.requestManager.requestSerializer = [AFJSONRequestSerializer serializer];
    [shared.requestManager.requestSerializer setValue:userAgent forHTTPHeaderField:@"User-Agent"];
    [shared.requestManager.requestSerializer setTimeoutInterval:20.0];
    [(AFJSONResponseSerializer *)shared.requestManager.responseSerializer setRemovesKeysWithNullValues:YES];
  });
  return shared;
}

- (void)getAction:(NSString *)action
           params:(NSDictionary *)params
          success:(GFCWebServiceSuccessCallBack)successCallBack
          failure:(GFCWebServiceFailureCallBack)failureCallBack
{
  void (^ success)(NSURLSessionDataTask *task, id responseObject) = ^(NSURLSessionDataTask *task, id responseObject) {
    
    GFCWebServiceResponse *response = [MTLJSONAdapter modelOfClass:[GFCWebServiceResponse class] fromJSONDictionary:responseObject error:nil];
    
    dispatch_async(dispatch_get_main_queue(), ^{
      successCallBack(task,response);
    });
  };
  
  void (^ failure)(NSURLSessionDataTask *task,NSError *error) = ^(NSURLSessionDataTask *task,NSError *error) {
    
    dispatch_async(dispatch_get_main_queue(), ^{
      if(!(error.code == NSURLErrorCancelled && [error.domain isEqualToString:NSURLErrorDomain]))
      {
        if (error.code == NSURLErrorCannotFindHost)
        {
          [SVProgressHUD showInfoWithStatus:@"当前网络异常，请检查网络后重试"];
        }
        else if(error.code != NSURLErrorTimedOut)
        {
          [SVProgressHUD showInfoWithStatus:error.localizedDescription];
        }
      }
      else
      {
        [SVProgressHUD dismiss];
      }
      failureCallBack(task,error);
    });
  };
  
  NSMutableDictionary *ps = [[NSMutableDictionary alloc] initWithDictionary:params];
  
  NSString *urlString = YTWebServiceAppHost;
  
  NSURL *baseURL = [NSURL URLWithString:urlString];
  urlString = [[NSURL URLWithString:action relativeToURL:baseURL] absoluteString];
  
  [self.requestManager GET:urlString
                parameters:ps
                  progress:nil
                   success:success
                   failure:failure];
}

- (void)postAction:(NSString *)action
            params:(NSDictionary *)params
           success:(GFCWebServiceSuccessCallBack)successCallBack
           failure:(GFCWebServiceFailureCallBack)failureCallBack
{
  [self postAction:action
            params:params
             files:nil
           success:successCallBack
           failure:failureCallBack];
}

- (NSURLSessionDataTask *)postAction:(NSString *)action
                              params:(NSDictionary *)params
                               files:(NSDictionary *)files
                             success:(GFCWebServiceSuccessCallBack)successCallBack
                             failure:(GFCWebServiceFailureCallBack)failureCallBack
{
  void (^ buildMultipart)(id <AFMultipartFormData> formData) = ^(id<AFMultipartFormData> formData) {
    
    void (^ block)(NSDictionary *info,NSString *ext,NSString *mime) = ^ void(NSDictionary *info,NSString *ext,NSString *mime)
    {
      for(NSString *key in info.keyEnumerator)
      {
        NSData *data = info[key];
        NSString *fileName = [NSString stringWithFormat:@"%@.%@",key,ext];
        [formData appendPartWithFileData:data name:key fileName:fileName mimeType:mime];
      }
    };
    
    block(files[GFCMultipartFormDataTypeImage],@"jpg",GFCMultipartFormDataTypeImage);
    block(files[GFCMultipartFormDataTypeAudio],@"amr",GFCMultipartFormDataTypeAudio);
    block(files[GFCMultipartFormDataTypeVideo],@"mp4",GFCMultipartFormDataTypeVideo);
  };
  
  void (^ success)(NSURLSessionDataTask *task, id responseObject) = ^(NSURLSessionDataTask *task, id responseObject) {
    
    GFCWebServiceResponse *response = [MTLJSONAdapter modelOfClass:[GFCWebServiceResponse class] fromJSONDictionary:responseObject error:nil];
    
    dispatch_async(dispatch_get_main_queue(), ^{
      if(!response.success)
      {
        
      }
      
      successCallBack(task,response);
    });
  };
  
  void (^ failure)(NSURLSessionDataTask *task,NSError *error) = ^(NSURLSessionDataTask *task,NSError *error) {
    
    dispatch_async(dispatch_get_main_queue(), ^{
      if(!(error.code == NSURLErrorCancelled && [error.domain isEqualToString:NSURLErrorDomain]))
      {
        if(error.code != NSURLErrorTimedOut)
        {
          
        }
      }
      failureCallBack(task,error);
    });
  };
  
  NSMutableDictionary *ps = [[NSMutableDictionary alloc] initWithDictionary:params];
  
  NSString *urlString = YTWebServiceAppHost;
  
  NSURL *baseURL = [NSURL URLWithString:urlString];
  urlString = [[NSURL URLWithString:action relativeToURL:baseURL] absoluteString];
  if(files.count > 0)
  {
    return [self.requestManager POST:urlString
                          parameters:ps
           constructingBodyWithBlock:buildMultipart
                            progress:nil
                             success:success
                             failure:failure];
  }
  else
  {
    return [self.requestManager POST:urlString
                          parameters:ps
                            progress:nil
                             success:success
                             failure:failure];
  }
}

- (NSDictionary *)fileDictionaryOfImageInfo:(NSDictionary *)imgInfo
{
  NSDictionary *dict = [NSDictionary dictionaryWithObject:imgInfo forKey:GFCMultipartFormDataTypeImage];
  return dict;
}

- (NSDictionary *)fileDictionaryOfAudioInfo:(NSDictionary *)audioInfo
{
  NSDictionary *dict = [NSDictionary dictionaryWithObject:audioInfo forKey:GFCMultipartFormDataTypeAudio];
  return dict;
}

- (NSDictionary *)fileDictionaryOfVideoInfo:(NSDictionary *)videoInfo
{
  NSDictionary *dict = [NSDictionary dictionaryWithObject:videoInfo forKey:GFCMultipartFormDataTypeVideo];
  return dict;
}

- (NSDictionary *)fileDictionaryOfImageInfo:(NSDictionary *)imgInfo audioInfo:(NSDictionary *)audioInfo videoInfo:(NSDictionary *)videoInfo
{
  NSDictionary *dict = @{GFCMultipartFormDataTypeImage:imgInfo,
                         GFCMultipartFormDataTypeAudio:audioInfo,
                         GFCMultipartFormDataTypeVideo:videoInfo};
  
  return dict;
}

@end

