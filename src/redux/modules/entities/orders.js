export const schema = {
  name: 'orders',
  id: 'id'
}

// 导出几个常量
export const USED_TYPE = 1 // 已消费
export const TO_PAY_TYPE = 2 // 代付款
export const AVAILABLE_TYPE = 3 // 可使用
export const REFUND_TYPE = 4 // 退款


const reducer = (state = {}, action) => {
  // 外部影响，实体组件如果存在响应，也应该进行更新
  if (action.response && action.response.orders) {
      return { ...state, ...action.response.orders }
  }
  return state
}

export default reducer

export const getOrderById = (state, id) => {
  return state.entities.orders[id]
}