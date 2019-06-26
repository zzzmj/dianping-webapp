export const schema = {
    id: 'id',
    name: 'shop'
}

const reducer = (state = {}, action) => {
    // 外部影响，实体组件如果存在响应，也应该进行更新
    if (action.response && action.response.shop) {
        return { ...state, ...action.response.shop }
    }
    return state
}

export default reducer

export const getShopById = (state, id) => {
    console.log('获取shop数据', state.entities.shops[id])
    return state.entities.shops[id]
}