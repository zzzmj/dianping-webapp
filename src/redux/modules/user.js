import url from '../../utils/url'
import {
    schema,
    TO_PAY_TYPE,
    AVAILABLE_TYPE,
    REFUND_TYPE,
    getOrderById
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
    currentTab: 0 // 维护 选中tab
}

// actionTypes
export const types = {
    // 获取订单列表
    FETCH_ORDERS_REQUEST: 'USER/FETCH_ORDERS_REQUEST',
    FETCH_ORDERS_SUCCESS: 'USER/FETCH_ORDERS_SUCCESS',
    FETCH_ORDERS_FAILURE: 'USER/FETCH_ORDERS_FAILURE',

    // 设置当前选择的Tab
    SET_CURRENT_TAB: 'USER/SET_CURRENT_TAB'
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

const reducer = combineReducers({
    orders,
    currentTab
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