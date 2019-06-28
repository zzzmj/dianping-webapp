import url from '../../utils/url'
import {
    schema,
    TO_PAY_TYPE,
    AVAILABLE_TYPE,
    REFUND_TYPE,
    getOrderById,
    actions as orderActinos,
    types as orderTypes
} from './entities/orders'
import { FETCH_DATA } from '../middleware/api'
import { combineReducers } from 'redux'

const initState = {
    orders: {
        isFetching: false,
        ids: [],
        toPayIds: [], // 待付款的订单id
        availableIds: [], // 可使用的订单id
        refundIds: [] // 退款订单id
    },
    currentTab: 0, // 维护 选中tab
    currentOrder: { // 维护 选中的订单
        id: null,
        isDeleting: false,
    }
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
}

// actionCreators
export const actions = {
    loadOrders: () => {
        return (dispatch, getState) => {
            const { ids } = getState().user.orders
            if (ids.length > 0) {
                return null
            }
            const endpoint = url.getOrders()
            return dispatch(fetchOrders(endpoint))
        }
    },
    setCurrentTab: index => ({
        type: types.SET_CURRENT_TAB,
        index
    }),
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
    showDeleteDialog: orderId => ({
        type: types.SHOW_DELETE_ORDER,
        orderId
    }),
    hideDeleteDialog: orderId => ({
        type: types.HIDE_DELETE_ORDER,
        orderId
    })
}

const deleteOrderRequest = () => ({
    type: types.DELETE_ORDER_REQUEST
})

const deleteOrderSuccess = (orderId) => ({
    type: types.DELETE_ORDER_SUCCESS,
    orderId
})

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
        case orderTypes.DELETE_ORDER:
        case types.DELETE_ORDER_SUCCESS:
            // 删除订单
            return {
                ...state,
                ids: state.ids.filter(id => id !== action.orderId),
                toPayIds: state.toPayIds.filter(id => id !== action.orderId),
                availableIds: state.availableIds.filter(id => id !== action.orderId),
                refundIds: state.refundIds.filter(id => id !== action.orderId),
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
            console.log('order reducer', action)
            return {
                ...state,
                id: action.orderId,
                isDeleting: true
            }
        case types.HIDE_DELETE_DIALOG:
        case types.DELETE_ORDER_SUCCESS:
        case types.DELETE_ORDER_FAILURE:
            return initState.currentOrder
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
export const getOrders = state => {
    // 四种 tab 标签
    const tabs = ['ids', 'toPayIds', 'availableIds', 'refundIds']
    // 当前 tab 下标
    const index = state.user.currentTab
    // 当前选中的 tab
    const tab = tabs[index]
    return state.user.orders[tab].map(id => getOrderById(state, id))
}

export const getDeletingOrderId = (state) => {
    if(state.user.currentOrder && state.user.currentOrder.isDeleting)
        console.log('selector state', state)
    return state.user.currentOrder && state.user.currentOrder.isDeleting ? state.user.currentOrder.id : null; 
}