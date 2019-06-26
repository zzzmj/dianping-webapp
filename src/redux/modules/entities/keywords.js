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

export const getKeywordById = (state, id) => {
    if (!id) return null

    const keyword = state.entities.keywords[id]
    if (keyword) {
        return keyword
    } else {
        return null
    }
}

export const getKeywordByText = (state, text) => {
    const result = []
    const keywords = state.entities.keywords
    for (const id in keywords) {
        if (keywords.hasOwnProperty(id)) {
            const keyword = keywords[id];
            if (keyword.includes(text)) {
                result.push(keyword)
            }
        }
    }
    return result
}