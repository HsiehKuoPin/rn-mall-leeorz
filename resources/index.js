import {BaseIcon} from "./base/index";
import {HomeIcon} from "./home/index";
import {OrderIcon} from "./order/style2/index";
import {PersonalIcon} from "./personal/index";
import {LoginIcon} from "./login/index";
import {ProductIcon} from "./product/index";

export const {
    ic_top,//置顶按钮
    ic_default_avatar,//默认头像
    ic_checkbox,
    ic_checkbox_selected,
    ic_message,
    ic_search,
    ic_arrow_right,
    ic_arrow_left,
    ic_notification,
    ic_minus_disabled,
    ic_minus,
    ic_plus_disabled,
    ic_plus,
    ic_recommend,

    ic_street_bg,//
    ic_tabhost_bottom_icon1,
    ic_tabhost_bottom_icon2,
    ic_tabhost_bottom_icon3,
    ic_tabhost_bottom_icon4,

    ic_product_collect,
    ic_product_collect_full,
    ic_product_shopping_cart,

    ic_personal_module_address,
    ic_personal_module_collect,
    ic_personal_module_group,
    ic_personal_module_history,
    ic_personal_module_open,
    ic_personal_module_recharge,
    ic_personal_module_redpacket,
    ic_personal_module_service_phone,

    ic_login_account,
    ic_login_password,

    ic_order_customer_service,//售后服务
    ic_order_wait_comment,//待评论
    ic_order_wait_delivery,//待发货
    ic_order_wait_received,//待收货
    ic_order_wait_pay,//待支付
    ic_order_address,

} = {
    ...BaseIcon,
    ...HomeIcon,
    ...OrderIcon,
    ...PersonalIcon,
    ...LoginIcon,
    ...ProductIcon,
};