import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';
import {
    Animated,
} from "react-native";

import TestIndex from '../components/test/TestUserForRedux';
// import Index from '../components/home/Index';

import Main from '../components/index/Main';
import Login from '../components/login/Login';
import Register from '../components/login/Register';
import ResetPassword from '../components/login/ResetPassword';
import ConfirmCarOrder from '../components/car/order/confirm/common/ConfirmCarOrderView';
import CarTreasureOrder from '../components/car/order/confirm/treasure/CarTreasureOrderView';
import CartDepositPaymentDetailView from '../components/car/order/confirm/common/CartDepositPaymentDetailView';
import Agreement from '../components/car/order/detail/Agreement';
import BuyCarIndex from '../components/car/index/BuyCarIndex';
import CarOrderPage from '../components/car/order/list/CarOrderPage'
import Balance from '../components/personal/assets/integral/Balance'
import AddressList from '../components/personal/address/AddressListView'
import EditAddress from '../components/personal/address/EditAddress'
import ProductDetail from "../components/product/ProductDetail";
import ProductCarDetail from "../components/car/detail/ProductCarDetail";
import TabPersonal from "../components/personal/index/TabPersonal";
import BindingBankCard from "../components/personal/BindingBankCard";
import BankCard from "../components/personal/assets/BankCardView";
import ConfirmOrder from '../components/order/confirm/ConfirmOrderView';
import ShoppingCart from "../components/shoppingcart/ShoppingCart";
import CollectList from '../components/personal/CollectList';
import PaymentDetail from '../components/order/confirm/PaymentDetailView';
import ProductList from '../components/product/ProductList'
import OrderDetail from '../components/order/detail/OrderDetailView';
import OrderCarDetail from '../components/car/order/detail/OrderCarDetailView';
import NotExtractionCar from '../components/car/order/detail/NotExtractionCarView';
import ExtractionCar from '../components/car/order/detail/ExtractionCarView';
import AdvanceExtractionCar from '../components/car/order/detail/AdvanceExtractionCarView';
import CartFinalPaymentDetail from '../components/car/order/detail/CartFinalPaymentDetailView';
import PhotoView from "../components/product/photo/PhotoView";
import ProductCategory from "../components/product/ProductCategory";
import MyOrder from "../components/order/MyOrder";
import LogisticsMsg from "../components/personal/LogisticsMsg";
import Integral from "../components/personal/assets/integral/Integral";
import WithdrawalsRecord from "../components/personal/assets/WithdrawalsRecord";
import Withdrawals from '../components/personal/assets/Withdrawals';
import TransferAccounts from '../components/personal/assets/TransferAccounts';
import Evaluation from "../components/personal/Evaluation";
import PaymentsBalance from "../components/personal/assets/PaymentsBalance";
import Payment from "../components/personal/assets/Payment";
import CollectPayment from "../components/personal/assets/CollectPayment";
import RechargeCenter from "../components/personal/recharge/RechargeCenter";     // 充值中心
import RechargeRecord from "../components/personal/recharge/RechargeRecord";     // 充值记录
import News from "../components/home/news/News";     // 最新动态
import NewsDetail from "../components/home/news/NewsDetail";     // 动态详情
import SearchGoods from "../components/product/search/SearchGoods";     // 动态详情
import MyAsset from '../components/personal/assets/MyAsset';
import WaitCommentProductList from "../components/order/WaitCommentProductList";
import PlatinumRecharge from '../components/personal/assets/PlatinumRecharge';
import Setting from '../components/personal/setting/Setting';
import Certification from "../components/home/Certification";
import ModifyPhone from "../components/personal/setting/ModifyPhone";
import NextModifyPhone from "../components/personal/setting/NextModifyPhone";
import ModifyPassword from "../components/personal/setting/ModifyPassword";
import ResetPaymentPsw from "../components/personal/setting/ResetPaymentPsw";
import RichMore from "../components/home/RichMore";
import RichMoreBuy from "../components/home/RichMoreBuy";
import RichMoreConfirmOrder from "../components/order/richmore/ConfirmOrderView";
import ComboPaymentDetail from "../components/order/richmore/ComboPaymentDetailView";
import MyRecommendation from '../components/personal/MyRecommendation'
import SearchResult from "../components/product/search/SearchResult";
import ApplyCustomerService from '../components/personal/service/ApplyCustomerService';
import RichMoreRegister from "../components/home/RichMoreRegister";
import CustomerService from "../components/personal/CustomerService";     // 售后管理
import AfterSaleDetails from "../components/personal/service/AfterSaleDetails";
import RechargeAmount from '../components/personal/assets/RechargeAmount'
import AboutUs from "../components/personal/AboutUs";
import CommonWebView from "../components/common/CommonWebView";
import RedPacket from '../components/personal/RedPacket'
import MerchantsSettled from "../components/merchants/MerchantsSettled";
import MerchantsIndex from '../components/merchants/MerchantsIndex'//开店赚钱
import UpgradeServiceCenter from '../components/merchants/UpgradeServiceCenter'//升级服务中心
import FranchiseRecord from '../components/merchants/FranchiseRecord'//服务费记录
import DataAuditing from '../components/merchants/DataAuditing'//资料审核
import MerchantsPaymentDetail from '../components/merchants/MerchantsPaymentDetail'//开店赚钱付款详情
import GoldOrderIndex from '../components/gold/GoldOrderIndex'//开店定货
import GoldRecordDetail from '../components/gold/GoldRecordDetail'//定货详情
import GoldPaymentDetail from '../components/gold/GoldPaymentDetail'//定货付款详情
import MyRedPacket from '../components/personal/redpacket/MyRedPacket'//红包
import TurnOut from '../components/personal/assets/TurnOut';

import MerchantInformation from '../components/merchants/data/MerchantInformation';
import MerchantUploadData from '../components/merchants/data/MerchantUploadData';
import Home from "../components/home/Home";
import HomeStreet from "../components/home/HomeStreet";
import EntrepreneurshipFound from "../components/personal/EntrepreneurshipFound";
import VentureFundPaymentDetail from "../components/personal/VentureFundPaymentDetail";
import EntrepreneurshipCouponRecharge from "../components/personal/assets/EntrepreneurshipCouponRecharge";
import RealAuthInfo from "../components/personal/RealAuthInfo";
import MessageCenter from '../components/home/news/MessageCenter';
import ModifyNickname from "../components/personal/setting/ModifyNickname";
import Store from '../components/store/Store';//店铺

export const routes = {
    Home: {screen: Home},//首页
    // HomeNew: {screen: Home},//首页
    Main: {screen: Main},
    RichMore: {screen: RichMore},//富诚N+页面
    RichMoreBuy: {screen: RichMoreBuy},//购买富诚N+页面
    RichMoreRegister: {screen: RichMoreRegister},//注册N+会员
    RichMoreConfirmOrder: {screen: RichMoreConfirmOrder},//N+确认订单
    ComboPaymentDetail: {screen: ComboPaymentDetail},//N+确认订单
    ProductCarDetail: {screen: ProductCarDetail},//购车详情页面
    ConfirmCarOrder: {screen: ConfirmCarOrder},
    CarTreasureOrder: {screen: CarTreasureOrder},
    CartDepositPaymentDetailView: {screen: CartDepositPaymentDetailView},
    AddressList: {screen: AddressList},
    EditAddress: {screen: EditAddress},
    TabPersonal: {screen: TabPersonal},
    BindingBankCard: {screen: BindingBankCard},
    ConfirmOrder: {screen: ConfirmOrder},
    PaymentDetail: {screen: PaymentDetail},
    ProductDetail: {screen: ProductDetail},//商品详情
    ProductList: {screen: ProductList},   // 商品列表
    PhotoView: {screen: PhotoView},//图片缩放页面
    ShoppingCart: {screen: ShoppingCart},
    CollectList: {screen: CollectList},
    ProductCategory: {screen: ProductCategory}, // 商品分类
    SearchResult: {screen: SearchResult},                     // 搜索结果展示界面
    OrderDetail: {screen: OrderDetail},
    OrderCarDetail: {screen: OrderCarDetail},
    NotExtractionCar: {screen: NotExtractionCar},
    ExtractionCar: {screen: ExtractionCar},
    AdvanceExtractionCar: {screen: AdvanceExtractionCar},
    CartFinalPaymentDetail: {screen: CartFinalPaymentDetail},
    AboutUs: {screen: AboutUs},
    CommonWebView: {screen: CommonWebView},

    LogisticsMsg: {screen: LogisticsMsg},//物流信息
    Evaluation: {screen: Evaluation},//评价晒单
    Withdrawals: {screen: Withdrawals},
    TransferAccounts: {screen: TransferAccounts},

    WithdrawalsRecord: {screen: WithdrawalsRecord},
    PaymentsBalance: {screen: PaymentsBalance}, // 收支明细
    CollectPayment: {screen: CollectPayment},

    Payment: {screen: Payment},

    WaitCommentProductList: {screen: WaitCommentProductList},//商品评价列表
    PlatinumRecharge: {screen: PlatinumRecharge},
    EntrepreneurshipCouponRecharge: {screen: EntrepreneurshipCouponRecharge},
    Setting: {screen: Setting},
    ModifyPhone: {screen: ModifyPhone},
    NextModifyPhone: {screen: NextModifyPhone},
    ModifyPassword: {screen: ModifyPassword},
    ResetPaymentPsw: {screen: ResetPaymentPsw},
    Certification: {screen: Certification},//实名认证
    MyRecommendation: {screen: MyRecommendation},// 我的推荐
    MyRedPacket: {screen: MyRedPacket}, // 我的红包
    RealAuthInfo: {screen: RealAuthInfo}, // 实名信息
    ModifyNickname: {screen: ModifyNickname},

    //=======名车订购模块========
    BuyCarIndex: {screen: BuyCarIndex},//名车订购首页
    CarOrderPage: {screen: CarOrderPage},//订单页面
    Agreement: {screen: Agreement},//订单页面

    //=======订单模块===========
    MyOrder: {screen: MyOrder},//我的订单

    //=======资产模块=========
    MyAsset: {screen: MyAsset},//我的资产
    Integral: {screen: Integral},  // 积分页面
    Balance: {screen: Balance},  // 余额
    BankCard: {screen: BankCard},

    //=======登录模块=========
    Login: {screen: Login},//登录
    Register: {screen: Register},//注册
    ResetPassword: {screen: ResetPassword},//重设密码

    RechargeCenter: {screen: RechargeCenter},//充值中心
    RechargeRecord: {screen: RechargeRecord},//充值记录
    News: {screen: News},//最新动态re
    NewsDetail: {screen: NewsDetail},//动态详情
    SearchGoods: {screen: SearchGoods},
    ApplyCustomerService: {screen: ApplyCustomerService},
    CustomerService: {screen: CustomerService},
    AfterSaleDetails: {screen: AfterSaleDetails}, // 售后单详情
    RechargeAmount: {screen: RechargeAmount}, // 充值
    RedPacket: {screen: RedPacket},
    MerchantsIndex: {screen: MerchantsIndex},//开店赚钱
    UpgradeServiceCenter: {screen: UpgradeServiceCenter},//升级服务中心
    FranchiseRecord: {screen: FranchiseRecord},//服务费记录
    DataAuditing: {screen: DataAuditing},//资料审核
    MerchantsPaymentDetail: {screen: MerchantsPaymentDetail},//资料审核
    MerchantsSettled: {screen: MerchantsSettled},//入驻商家
    TurnOut: {screen: TurnOut}, // 转出
    MerchantInformation: {screen: MerchantInformation},
    MerchantUploadData: {screen: MerchantUploadData},
    HomeStreet: {screen: HomeStreet},//积分馆首页
    GoldOrderIndex: {screen: GoldOrderIndex},//开店定货
    GoldRecordDetail: {screen: GoldRecordDetail},//定货详情
    GoldPaymentDetail: {screen: GoldPaymentDetail},//定货付款详情
    EntrepreneurshipFound: {screen: EntrepreneurshipFound},//创业基金
    VentureFundPaymentDetail: {screen: VentureFundPaymentDetail},//创业基金付款详情
    MessageCenter: {screen: MessageCenter}, //消息动态
    Store:{screen:Store},

    //===========测试
    TestIndex: {screen: TestIndex},
};

export const routerConfig =
    {
        // Store
        initialRouteName: 'Main', // 默认显示界面

        navigationOptions: {  // 屏幕导航的默认选项, 也可以在组件内用 static navigationOptions 设置(会覆盖此处的设置)
            header: null,
            gesturesEnabled: true,//是否支持滑动返回手势，iOS默认支持，安卓默认关闭
        },
        // mode: 'card',  // 页面切换模式, 左右是card(相当于iOS中的push效果), 上下是modal(相当于iOS中的modal效果)
        transitionConfig: () => ({//设置页面切换动画
            screenInterpolator: CardStackStyleInterpolator.forHorizontal,
            transitionSpec: {
                duration: 250,
                timing: Animated.timing,
            },
        }),

        headerMode: 'screen', // 导航栏的显示模式, screen: 有渐变透明效果, float: 无透明效果, none: 隐藏导航栏
        // onTransitionStart: () => {console.warn('导航栏切换开始');},
        // onTransitionEnd: () => {console.warn('导航栏切换结束');}
    };
