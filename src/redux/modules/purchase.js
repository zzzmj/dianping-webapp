import { getProductDetail } from './entities/products'
import { actions as orderActions, AVAILABLE_TYPE } from "./entities/orders"

export const types = {
    SET_ORDER_QUANTITY: 'PURCHASE/SET_ORDER_QUANTITY',
    CLOSE_TIP: 'PURCHASE/CLOSE_TIP',
    SUBMIT_ORDER_REQUEST: 'PURCHASE/SUBMIT_ORDER_REQUEST',
    SUBMIT_ORDER_SUCCESS: 'PURCHASE/SUBMIT_ORDER_SUCCESS',
    SUBMIT_ORDER_FAILURE: 'PURCHASE/SUBMIT_ORDER_FAILURE'
}

const initState = {
    quantity: 1,
    showTip: false
}

export const actions = {
    setOrderQuantity: quantity => ({
        type: types.SET_ORDER_QUANTITY,
        quantity
    }),
    closeTip: () => ({
        type: types.CLOSE_TIP
    }),
    //提交订单
    submitOrder: productId => {
        return (dispatch, getState) => {
            // 1. 发送request请求
            dispatch({ type: types.SUBMIT_ORDER_REQUEST })
            return new Promise((resovle, reject) => {
                setTimeout(() => {
                    // 1. 获取产品id
                    const product = getProductDetail(getState(), productId)
                    // 2. 计算商品总价值
                    const quantity = getState().purchase.quantity
                    const totalPrice = (
                        product.currentPrice * quantity
                    ).toFixed(1)
                    // 3. 填写其余字段
                    const text1 = `${quantity}张 | 总价：${totalPrice}`
                    const text2 = product.validityPeriod
                    const order = {
                        title: `${product.shop}:${product.product}`,
                        orderPicUrl: product.picture,
                        channel: '团购',
                        statusText: '待消费',
                        text: [text1, text2],
                        type: AVAILABLE_TYPE
                    }
                    console.log('构造而成的order', order)
                    dispatch(orderActions.addOrder(order))
                    dispatch({ type: types.SUBMIT_ORDER_SUCCESS })
                    resovle()
                }, 500)
            })
        }
    }
}

const reducer = (state = initState, action) => {
    switch (action.type) {
        case types.SET_ORDER_QUANTITY:
            return {
                ...state,
                quantity: action.quantity
            }
        case types.CLOSE_TIP:
            return {
                ...state,
                showTip: false,
            }
        case types.SUBMIT_ORDER_SUCCESS:
            return {
                ...state,
                showTip: true,
            }
        default:
            return state
    }
}

export default reducer

// selectors
export const getPurchaseQuantity = state => {
    const purchase = state.purchase
    if (purchase && purchase.quantity) {
        return purchase.quantity
    } else {
        return null
    }
}

export const getTipStatus = state => {
    const purchase = state.purchase
    if (purchase && purchase.showTip) {
        return purchase.showTip
    } else {
        return null
    }
}

export const getProduct = (state, id) => {
    return getProductDetail(state, id)
}