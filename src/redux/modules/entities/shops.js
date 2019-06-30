export const schema = {
    id: 'id',
    name: 'shops'
}

const reducer = (state = {}, action) => {
    // 外部影响，实体组件如果存在响应，也应该进行更新
    if (action.response && action.response.shops) {
        return { ...state, ...action.response.shops }
    }
    return state
}

export default reducer

export const getShopById = (state, id) => {
    return state.entities.shops[id]
}