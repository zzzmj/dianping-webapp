export default {
    // 获取产品列表
    getProductList: (types, rowIndex, pageSize) => `/mock/products/${types}.json?rowIndex=${rowIndex}&pageSize=${pageSize}`,
    // 通过产品id获取产品详情
    getProductDetail: (id) => `/mock/products_detail/${id}.json`,
    // 通过产品id获取相关商家信息
    getRelatedShop: (id) => `/mock/shops/${id}.json`,
    // 获取流行关键字
    getPopularKeywords: () => `/mock/keywords/popular.json`,
    // 通过输入的信息获取关键字
    getRelatedKeywords: (text) => `/mock/keywords/related.json?keyword=${text}`,
    // 通过关键字获取商家列表
    getSearchResult: (keyword) => `/mock/shops/related.json?keyword=${keyword}`,
    // 获取个人订单列表
    getOrders: () => `/mock/orders/orders.json`
}