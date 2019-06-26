import url from "../../utils/url";
import { combineReducers } from 'redux'
import { schema as productSchema, getProductDetail } from './entities/products'
import { schema as shopSchema, getShopById } from './entities/shops'
import { FETCH_DATA } from '../middleware/api'

// actionTypes
export const types = {
    // 获取产品详情信息
    FETCH_PRODUCT_REQUEST: 'DETAIL/FETCH_PRODUCT_REQUEST',
    FETCH_PRODUCT_SUCCESS: 'DETAIL/FETCH_PRODUCT_SUCCESS',
    FETCH_PRODUCT_FAILURE: 'DETAIL/FETCH_PRODUCT_FAILURE',

    // 获取相关商家信息
    FETCH_SHOP_REQUEST: 'DETAIL/FETCH_SHOP_REQUEST',
    FETCH_SHOP_SUCCESS: 'DETAIL/FETCH_SHOP_SUCCESS',
    FETCH_SHOP_FAILURE: 'DETAIL/FETCH_SHOP_FAILURE',
}

// state
const initState = {
    product: {
        isFetching: false,
        id: null
    },
    relatedShop: {
        isFetching: false,
        id: null
    }
}

// actions
export const actions = {
    loadProductDetail: (id) => {
        return (dispatch, getState) => {
            // 如果产品已经获取过了，就不用再重复发送请求，使用缓存
            const product = getProduct(getState(), id)
            if (product) {
                return dispatch({
                    type: types.FETCH_PRODUCT_DETAIL_SUCCESS,
                    id
                })
            }
            const endpoint = url.getProductDetail(id)
            return dispatch(fetchProductDetail(endpoint, id))
        }
    },
    loadRelatedShop: (id) => {
        return (dispatch, getState) => {
            // 如果商家已经获取过了，就不用再重复发送请求，使用缓存
            const relatedShop = getRelatedShop(getState(), id)
            if (relatedShop) {
                return dispatch({
                    type: types.FETCH_SHOP_SUCCESS,
                    id
                })
            }
            const endpoint = url.getRelatedShop(id)
            return dispatch(fetchRelatedShop(endpoint, id))
        }
    }
}

const fetchProductDetail = (endpoint, id) => ({
    [FETCH_DATA]: {
        types: [
            types.FETCH_PRODUCT_REQUEST,
            types.FETCH_PRODUCT_SUCCESS,
            types.FETCH_PRODUCT_FAILURE
        ],
        endpoint,
        schema: productSchema
    },
    id
})

const fetchRelatedShop = (endpoint, id) => ({
    [FETCH_DATA]: {
        types: [
            types.FETCH_SHOP_REQUEST,
            types.FETCH_SHOP_SUCCESS,
            types.FETCH_SHOP_FAILURE
        ],
        endpoint,
        schema: shopSchema
    },
    id
})



// reducer
const product = (state = initState.product, action) => {
    switch (action.type) {
        case types.FETCH_PRODUCT_REQUEST:
            console.log('pruductReducer进行数据处理，返回新的state', action.type)
            return {
                ...state,
                isFetching: true
            }
        case types.FETCH_PRODUCT_SUCCESS:
            console.log('pruductReducer进行数据处理，返回新的state', action.type)
            return {
                ...state,
                isFetching: false,
                id: action.id
            }
        case types.FETCH_PRODUCT_FAILURE:
            console.log('pruductReducer进行数据处理，返回新的state', action.type)
            return {
                ...state,
                isFetching: false,
                id: null
            }
        default:
            return state
    }
}

const relatedShop = (state = initState.relatedShop, action) => {
    switch (action.type) {
        case types.FETCH_SHOP_REQUEST:
            console.log('relatedShop进行数据处理，请求中，返回新的state', action)
            return {
                ...state,
                isFetching: true
            }
        case types.FETCH_SHOP_SUCCESS:
            console.log('relatedShop进行数据处理，请求成功，返回新的state', {
                ...state,
                isFetching: false,
                id: action.id
            })
            return {
                ...state,
                isFetching: false,
                id: action.id
            }
        case types.FETCH_SHOP_FAILURE:
            console.log('relatedShop进行数据处理，返回新的state', action)

            return {
                ...state,
                isFetching: false,
                id: null
            }
        default:
            return state
    }
}

const reducer = combineReducers({
    product,
    relatedShop
})

export default reducer

// selectors
export const getProduct = (state, id) => {
    console.log('第七步, 从store中取出状态更新组件')
    return getProductDetail(state, id)
}

export const getRelatedShop = (state, id) => {
    console.log('第七步, 从store中取出状态更新组件')
    const product = state.entities.products[id]
    if (!product) return null
    const shopId = product.nearestShop
    if (shopId) {
        return getShopById(state, shopId)
    } else {
        return null
    }
}