import url from '../../utils/url'
import {
    schema,
    TO_PAY_TYPE,
    AVAILABLE_TYPE,
    REFUND_TYPE,
    actions as orderActinos,
    types as orderTypes,
    getAllOrders
} from './entities/orders'
import { actions as commentActions } from './entities/comments'

import { FETCH_DATA } from '../middleware/api'
import { combineReducers } from 'redux'
import { createSelector } from 'reselect';

// 建立orderType与state中key的映射
const typeToKey = {
    [TO_PAY_TYPE]: 'toPayIds',
    [AVAILABLE_TYPE]: 'availableIds',
    [REFUND_TYPE]: 'availableIds'
}

const initState = {
    orders: {
        isFetching: false,
        loaded: false, // 标记用户原来的订单是否被加载
        ids: [],
        toPayIds: [], // 待付款的订单id
        availableIds: [], // 可使用的订单id
        refundIds: [] // 退款订单id
    },
    currentTab: 0, // 维护 选中tab
    // 维护订单信息
    currentOrder: {
        id: null,
        isDeleting: false,
        isCommenting: false,
        comment: '',
        stars: 0,
        commentTip: false, // 显示提交评论是否成功的提示框
    },
}

// actionTypes
export const types = {
    // 获取订单列表
    FETCH_ORDERS_REQUEST: 'USER/FETCH_ORDERS_REQUEST',
    FETCH_ORDERS_SUCCESS: 'USER/FETCH_ORDERS_SUCCESS',
    FETCH_ORDERS_FAILURE: 'USER/FETCH_ORDERS_FAILURE',
    // 设置当前选择的Tab
    SET_CURRENT_TAB: 'USER/SET_CURRENT_TAB',
    // 删除订单
    DELETE_ORDER_REQUEST: 'USER/DELETE_ORDER_REQUEST',
    DELETE_ORDER_SUCCESS: 'USER/DELETE_ORDER_SUCCESS',
    DELETE_ORDER_FAILURE: 'USER/DELETE_ORDER_FAILURE',
    // 删除确认对话框
    SHOW_DELETE_ORDER: 'USER/SHOW_DELETE_ORDER',
    HIDE_DELETE_ORDER: 'USER/HIDE_DELETE_ORDER',
    // 评价订单编辑
    SHOW_COMMENT_AREA: 'USER/SHOW_COMMENT_AREA',
    HIDE_COMMENT_AREA: 'USER/HIDE_COMMENT_AREA',
    SET_COMMENT_CONTENT: 'USER/SET_COMMENT_CONTENT',
    SET_STARS: 'USER/SET_STARS',
    // 提交评价
    POST_COMMENT_REQUEST: 'USER/POST_COMMENT_REQUEST',
    POST_COMMENT_SUCCESS: 'USER/POST_COMMENT_SUCCESS',
    POST_COMMENT_FAILURE: 'USER/POST_COMMENT_FAILURE',
    // 评论数据提交的对话框
    SHOW_COMMENT_TIP: 'USER/SHOW_COMMENT_TIP',
    HIDE_COMMENT_TIP: 'USER/HIDE_COMMENT_TIP'
}

// actionCreators
export const actions = {
    // 加载订单列表
    loadOrders: () => {
        return (dispatch, getState) => {
            const { loaded } = getState().user.orders
            if (loaded) {
                return null
            }
            const endpoint = url.getOrders()
            return dispatch(fetchOrders(endpoint))
        }
    },
    // 通过下标设置选中的tab
    setCurrentTab: index => ({
        type: types.SET_CURRENT_TAB,
        index
    }),
    // 删除订单
    removeOrder: () => {
        return (dispatch, getState) => {
            const { id } = getState().user.currentOrder
            if (id) {
                dispatch(deleteOrderRequest())
                new Promise((resolve, reject) => {
                    setTimeout(() => {
                        // 不仅要删除user模块下的订单
                        // 也要删除实体模块order下的订单
                        dispatch(deleteOrderSuccess(id))
                        dispatch(orderActinos.deleteOrder(id))
                        resolve()
                    }, 500)
                })
            }
        }
    },
    // 显示删除确认框
    showDeleteDialog: orderId => ({
        type: types.SHOW_DELETE_ORDER,
        orderId
    }),
    // 隐藏删除确认框
    hideDeleteDialog: () => ({
        type: types.HIDE_DELETE_ORDER
    }),
    // 显示评价区域框
    showCommentArea: orderId => ({
        type: types.SHOW_COMMENT_AREA,
        orderId
    }),
    // 隐藏评价区域框
    hideCommentArea: () => ({
        type: types.HIDE_COMMENT_AREA
    }),
    // 设置评价内容
    setCommentContent: comment => ({
        type: types.SET_COMMENT_CONTENT,
        comment
    }),
    // 设置评价星级
    setStars: stars => ({
        type: types.SET_STARS,
        stars
    }),
    // 提交评价
    submitComment: () => {
        return (dispatch, getState) => {
            dispatch(postCommentRequest())
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const { id, stars, comment } = getState().user.currentOrder
                    const commentObj = {
                        id: +new Date(),
                        stars,
                        content: comment
                    }
                    dispatch(postCommentSuccess())
                    // 更新订单表中 订单的id字段，只需要传id即可
                    dispatch(orderActinos.addComment(id, commentObj.id))
                    // 更新评论表中的评论，需要传入评论对象
                    dispatch(commentActions.addComment(commentObj))
                    resolve()
                })
            })
        }
    },
    // 显示对话框
    showCommentTip: () => ({
        type: types.SHOW_COMMENT_TIP
    }),
    // 隐藏对话框
    hideCommentTip: () => ({
        type: types.HIDE_COMMENT_TIP
    })
}

const fetchOrders = endpoint => ({
    [FETCH_DATA]: {
        types: [
            types.FETCH_ORDERS_REQUEST,
            types.FETCH_ORDERS_SUCCESS,
            types.FETCH_ORDERS_FAILURE
        ],
        endpoint,
        schema
    }
})

const deleteOrderRequest = () => ({
    type: types.DELETE_ORDER_REQUEST
})

const deleteOrderSuccess = orderId => ({
    type: types.DELETE_ORDER_SUCCESS,
    orderId
})

const postCommentRequest = () => ({
    type: types.POST_COMMENT_REQUEST
})

const postCommentSuccess = () => ({
    type: types.POST_COMMENT_SUCCESS
})

// reducers
const orders = (state = initState.orders, action) => {
    switch (action.type) {
        case types.FETCH_ORDERS_REQUEST:
            return {
                ...state,
                isFetching: true
            }
        case types.FETCH_ORDERS_SUCCESS:
            const res = action.response
            // 筛选出待付款的订单
            const toPayIds = res.ids.filter(
                id => res.orders[id].type === TO_PAY_TYPE
            )
            const availableIds = res.ids.filter(
                id => res.orders[id].type === AVAILABLE_TYPE
            )
            const refundIds = res.ids.filter(
                id => res.orders[id].type === REFUND_TYPE
            )
            return {
                ...state,
                isFetching: false,
                loaded: true,
                ids: state.ids.concat(res.ids),
                toPayIds: state.toPayIds.concat(toPayIds),
                availableIds: state.availableIds.concat(availableIds),
                refundIds: state.refundIds.concat(refundIds)
            }
        case types.FETCH_ORDERS_FAILURE:
            return {
                ...state,
                isFetching: false
            }
        case orderTypes.ADD_ORDER:
            // 拿到action派发过来的order
            const { order } = action
            // order类型 对应的state key字段
            const key = typeToKey[order.type]

            return key
            ? {
                ...state,
                ids: [order.id].concat(state.ids),
                [key]: [order.id].concat(state[key])
              }
            : {
                ...state,
                ids: [order.id].concat(state.ids)
              };
        case orderTypes.DELETE_ORDER:
        case types.DELETE_ORDER_SUCCESS:
            // 删除订单
            return {
                ...state,
                ids: state.ids.filter(id => id !== action.orderId),
                toPayIds: state.toPayIds.filter(id => id !== action.orderId),
                availableIds: state.availableIds.filter(
                    id => id !== action.orderId
                ),
                refundIds: state.refundIds.filter(id => id !== action.orderId)
            }
        default:
            return state
    }
}

const currentTab = (state = initState.currentTab, action) => {
    switch (action.type) {
        case types.SET_CURRENT_TAB:
            return action.index
        default:
            return state
    }
}

const currentOrder = (state = initState.currentOrder, action) => {
    switch (action.type) {
        case types.SHOW_DELETE_ORDER:
            return {
                ...state,
                id: action.orderId,
                isDeleting: true
            }
        case types.SHOW_COMMENT_AREA:
            return {
                ...state,
                id: action.orderId,
                isCommenting: true
            }
        
        case types.HIDE_COMMENT_AREA:
        case types.HIDE_DELETE_ORDER:
        case types.DELETE_ORDER_SUCCESS:
        case types.DELETE_ORDER_FAILURE:
        case types.POST_COMMENT_SUCCESS:
        case types.POST_COMMENT_FAILURE:
            return {
                ...state,
                id: null,
                isDeleting: false,
                isCommenting: false,
                comment: '',
                stars: 0,
            }
        
        case types.SET_COMMENT_CONTENT:
            return {
                ...state,
                comment: action.comment
            }
        case types.SET_STARS:
            return {
                ...state,
                stars: action.stars
            }
        case types.SHOW_COMMENT_TIP:
            return {
                ...state,
                commentTip: true
            }
        case types.HIDE_COMMENT_TIP:
            return {
                ...state,
                commentTip: false
            }
        default:
            return state
    }
}

const reducer = combineReducers({
    orders,
    currentTab,
    currentOrder
})

export default reducer

// selectors
export const getCurrentTab = state => state.user.currentTab

export const getCommentTip = state => state.user.currentOrder.commentTip

export const getUserOrders = state => state.user.orders

export const getOrders = createSelector(
    [getCurrentTab, getUserOrders, getAllOrders],
    (tabIndex, userOrders, orders) => {
        const tabs = ['ids', 'toPayIds', 'availableIds', 'refundIds']
        // 当前选中的 tab
        const tab = tabs[tabIndex]
        // 拿到对应tab维护的订单数组
        const ordersIds = userOrders[tab]
        // 通过id 拿到order表中的数据
        return ordersIds.map(id => orders[id])
    }
)

export const getDeletingOrderId = state => {
    if (state.user.currentOrder && state.user.currentOrder.isDeleting)
    return state.user.currentOrder && state.user.currentOrder.isDeleting
        ? state.user.currentOrder.id
        : null
}

// 获取正在评价的订单id
export const getCommentingOrderId = state => {
    return state.user.currentOrder && state.user.currentOrder.isCommenting
    ? state.user.currentOrder.id
    : null
}

// 获取评论信息
export const getCurrentOrderComment = state => {
    return state.user.currentOrder ? 
        state.user.currentOrder.comment : ""
}

// 获取订单评分信息
export const getCurrmentOrderStars = state => {
    return state.user.currentOrder ? 
        state.user.currentOrder.stars : 0
}