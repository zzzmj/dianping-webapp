export const schema = {
    name: 'products',
    id: 'id'
}

const reducer = (state = {}, action) => {
    // 外部影响，实体组件如果存在响应，也应该进行更新
    if (action.response && action.response.products) {
        return { ...state, ...action.response.products }
    }
    return state
}

export default reducer

export const getProductDetail = (state, id) => {
    const product = state.entities.products[id]
    // 如果product包含详情数据，那么返回product，否则返回空
    if (product && product.detail && product.purchaseNotes) {
        return product
    } else {
        return null
    }
}