import { combineReducers } from 'redux'
import url from '../../utils/url'
import { FETCH_DATA } from '../middleware/api'
import { schema } from './entities/products'

// 定义一些常量
export const params = {
    // 猜你喜欢请求路径
    PATH_LIKES: 'likes',
    // 超值特惠请求路径
    PATH_DISCOUNTS: 'discounts',
    // 猜你喜欢一页显示数据条数
    PAGE_SIZE_LIKES: 5,
    // 超值特惠一页显示数据条数
    PAGE_SIZE_DISCOUNTS: 3
}

// ActionTypes
export const types = {
    // 猜你喜欢请求
    FETCH_LIKES_REQUEST: "HOME/FETCH_LIKES_REQUEST", 
    // 猜你喜欢请求成功
    FETCH_LIKES_SUCCESS: "HOME/FETCH_LIKES_SUCCESS", 
    // 猜你喜欢请求失败
    FETCH_LIKES_FAILURE: "HOME/FETCH_LIKES_FAILURE", 

    // 超值特惠请求
    FETCH_DISCOUNTS_REQUEST: "HOME/FETCH_DISCOUNTS_REQUEST", 
    // 超值特惠请求成功
    FETCH_DISCOUNTS_SUCCESS: "HOME/FETCH_DISCOUNTS_SUCCESS", 
    // 超值特惠请求失败
    FETCH_DISCOUNTS_FAILURE: "HOME/FETCH_DISCOUNTS_FAILURE", 
}

// State
const initState = {
    likes: {
        isFetching: false,
        pageCount: 0,
        ids: []
    },
    discounts: {
        isFetching: false,
        ids: []
    }
}

// Action
export const actions = {
    loadLikes: () => {
        return (dispatch, getState) => {
            // 获取页码下标
            const { pageCount } = getState().home.likes
            // 计算该页码第一条数据的下标
            const rowIndex = pageCount * params.PAGE_SIZE_LIKES
            const endpoint = url.getProductList(params.PATH_LIKES, rowIndex, params.PAGE_SIZE_LIKES)
            console.log('loadLikes', endpoint)

            return dispatch(fetchLikes(endpoint))
        }
    },
    loadDiscounts: () => {
        return (dispatch, getState) => {
            const { ids } = getState().home.discounts
            // 如果store中discounts组件已经加载过数据了，就不用再重新加载
            if (ids.length > 0) {
                return null
            }
            const endpoint = url.getProductList(params.PATH_DISCOUNTS, 0, params.PAGE_SIZE_DISCOUNTS)
            return dispatch(fetchDiscounts(endpoint))
        }
    }
}

const fetchLikes = (endpoint) => ({
    [FETCH_DATA]: {
        types: [
            types.FETCH_LIKES_REQUEST,
            types.FETCH_LIKES_SUCCESS,
            types.FETCH_LIKES_FAILURE
        ],
        endpoint,
        schema
    }
})

const fetchDiscounts = (endpoint) => ({
    [FETCH_DATA]: {
        types: [
            types.FETCH_DISCOUNTS_REQUEST,
            types.FETCH_DISCOUNTS_SUCCESS,
            types.FETCH_DISCOUNTS_FAILURE
        ],
        endpoint,
        schema
    }
})

// 猜你喜欢reducer
const likes = (state = initState.likes, action) => {
    switch (action.type) {
        case types.FETCH_LIKES_REQUEST:
            return {
                ...state,
                isFetching: true
            }
        case types.FETCH_LIKES_SUCCESS:
            return {
                ...state,
                isFetching: false,
                pageCount: state.pageCount + 1,
                ids: state.ids.concat(action.response.ids)
            }
        case types.FETCH_LIKES_FAILURE:
            return {
                ...state,
                isFetching: false
            }
        default:
            return state
    }
}

// 超值特惠reducer
const discounts = (state = initState.discounts, action) => {
    switch (action.type) {
        case types.FETCH_DISCOUNTS_REQUEST:
            return {
                ...state,
                isFetching: true
            }
        case types.FETCH_DISCOUNTS_SUCCESS:
            return {
                ...state,
                isFetching: false,
                ids: state.ids.concat(action.response.ids)
            }
        case types.FETCH_DISCOUNTS_FAILURE:
            return {
                ...state,
                isFetching: false
            }
        default:
            return state
    }
}

const reducer = combineReducers({
    likes,
    discounts
})

export default reducer

// selectors
// 获取猜你喜欢state
export const getLikes = state => {
    return state.home.likes.ids.map(id => {
        return state.entities.products[id]
    })
}

// 获取特惠商品state
export const getDiscounts = state => {
    console.log(state.home.discounts)
    return state.home.discounts.ids.map(id => {
        console.log(state.entities)
        console.log('id：', state.entities.products[id])
        return state.entities.products[id]
    })
}

export const getPageCountOfLikes = state => {
    return state.home.likes.pageCount
}