export const schema = {
    name: 'keywords',
    id: 'id'
}

const reducer = (state = {}, action) => {
    // 外部影响，实体组件如果存在响应，也应该进行更新
    if (action.response && action.response.keywords) {
        return { ...state, ...action.response.keywords }
    }
    return state
}

export default reducer