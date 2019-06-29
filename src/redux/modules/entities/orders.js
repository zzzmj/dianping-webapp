export const schema = {
    name: 'orders',
    id: 'id'
}

// 导出几个常量
export const USED_TYPE = 1 // 已消费
export const TO_PAY_TYPE = 2 // 代付款
export const AVAILABLE_TYPE = 3 // 可使用
export const REFUND_TYPE = 4 // 退款

let orderIdCounter = 10;

export const types = {
    // 新增订单
    ADD_ORDER: 'ORDER/ADD_ORDER',
    //删除订单
    DELETE_ORDER: 'ORDER/DELETE_ORDER',
    ADD_COMMENT: 'ORDER/ADD_COMMENT'
}

export const actions = {
    // 新增订单
    addOrder: order =>{
        const orderId = `o-${orderIdCounter++}`
        return {
            type: types.ADD_ORDER,
            orderId,
            order
        }
    },
    // 删除订单
    deleteOrder: orderId => ({
        type: types.DELETE_ORDER,
        orderId
    }),
    // 新增评论
    addComment: (orderId, commentId) => ({
        type: types.ADD_COMMENT,
        orderId,
        commentId
    })
}

const reducer = (state = {}, action) => {
    if (action.type === types.ADD_ORDER) {
        return {
            ...state,
            [action.orderId]: action.order
        }
    } else if (action.type === types.DELETE_ORDER) {
        const {[action.orderId]: deleteOrder, ...restOrders} = state
        return restOrders
    } else if (action.type === types.ADD_COMMENT) {
        // 在该订单中，新增评论字段
        return {
            ...state,
            [action.orderId]: {
                ...state[action.orderId],
                commentId: action.commentId
            }
        }
    } else if (action.response && action.response.orders) {
        // 外部影响，实体组件如果存在响应，也应该进行更新
        return { ...state, ...action.response.orders }
    }
    return state
}

export default reducer

export const getOrderById = (state, id) => {
    return state.entities.orders[id]
}
