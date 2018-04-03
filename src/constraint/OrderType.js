export const ORDER_ALL ='ORDER_ALL';//'全部订单';
export const ORDER_CREATED ='ORDER_CREATED';//'待付款';
export const ORDER_APPROVED = 'ORDER_APPROVED';// '待发货';
export const ORDER_HOLD = 'ORDER_HOLD';// '发货中';
export const ORDER_SENT = 'ORDER_SENT';// '待收货';
export const ORDER_APPRAISE = 'ORDER_APPRAISE';// '待评价';
export const ORDER_COMPLETED = 'ORDER_COMPLETED';// '已完成';
export const ORDER_CANCEL = 'ORDER_CANCEL';// '已取消';
export const ORDER_CLOSE = 'ORDER_CLOSE';// '已关闭';
export const ORDER_REFUND_UNDER_REVIEW = 'ORDER_REFUND_UNDER_REVIEW';// '退款审核中';
export const ORDER_RETURN_PRODUCT_UNDER_REVIEW = 'ORDER_RETURN_PRODUCT_UNDER_REVIEW';// '退货审核中';
export const ORDER_HAVE_REFUND = 'ORDER_HAVE_REFUND';// '已退款';
export const ORDER_HAVE_RETURN = 'ORDER_HAVE_RETURN';// '已退货';

//订单类型
export const ORDER_PRODUCT = 'ORDER_PRODUCT';// '普通订单';
export const ORDER_COMBO = 'ORDER_COMBO';// '套餐订单';
export const ORDER_OIL_CARD = 'ORDER_OIL_CARD';// '油卡订单';

//购车订单状态
export const ORDER_TO_CHOOSE = 'ORDER_TO_CHOOSE';// '待选择';
export const ORDER_HAS_PAYMENT = 'ORDER_HAS_PAYMENT';// '待支付尾款';
export const ORDER_CARCOMPLETED = 'ORDER_COMPLETED';// '已完成';
export const ORDER_HAS_DEFAULTED = 'ORDER_HAS_DEFAULTED';// '已违约';

//购车的用户操作状态
// export const NOT_OPERATING = 'NOT_OPERATING';// '未操作';
// export const UN_PREMISE_CAR = 'UN_PREMISE_CAR';// '不提车';
export const MENTION_THE_PREMISE_CAR = 'MENTION_THE_PREMISE_CAR';// '提前提车';
export const PREMISE_CAR = 'PREMISE_CAR';// '正常提车';

//车宝订购的类型
export const ORDER_DEPOSIT = 'ORDER_DEPOSIT';// '定金';
export const ORDER_RECORD = 'ORDER_RECORD';// '记录';
export const ORDER_CARALL = 'ORDER_ALL';// '类型';

export const getOrderStatusText = (status)=>{
    switch(status){
        case ORDER_CREATED: return '待付款';
        case ORDER_APPROVED: return '待发货';
        case ORDER_HOLD: return '发货中';
        case ORDER_SENT: return '待收货';
        case ORDER_APPRAISE: return '待评价';
        case ORDER_COMPLETED: return '已完成';
        case ORDER_CANCEL: return '已取消';
        case ORDER_CLOSE: return '已关闭';
        case ORDER_REFUND_UNDER_REVIEW: return '退款审核中';
        case ORDER_RETURN_PRODUCT_UNDER_REVIEW: return '退货审核中';
        case ORDER_HAVE_REFUND: return '已退款';
        case ORDER_HAVE_RETURN: return '已退货';
    }
};

export const getCarOrderStatusText = (status)=>{
    switch(status){
        case ORDER_TO_CHOOSE: return '未选择';
        case ORDER_HAS_PAYMENT: return '支付尾款';
        case ORDER_CARCOMPLETED: return '已完成';
        case ORDER_HAS_DEFAULTED: return '已违约';
    }
};

export const BTN_PAY = '前往支付';
export const BTN_CONFIRM = '确认收货';
export const BTN_COMMENT = '前往评价';
export const BTN_CANCEL = '取消订单';
export const BTN_LOGISTICS = '查看物流';
export const BTN_AGAIN = '再来一单';
export const BTN_AGAIN2 = '重新购买';
export const BTN_DELETE = '删除订单';
export const BTN_CUSTOM_SERVICE = '联系客服';
export const BTN_AFTER_SERVICE = '申请售后';