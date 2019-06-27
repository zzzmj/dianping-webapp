export default {
    // 获取产品列表
    getProductList: (types, rowIndex, pageSize) => `http://localhost:3000/mock/products/${types}.json?rowIndex=${rowIndex}&pageSize=${pageSize}`,
    // 通过产品id获取产品详情
    getProductDetail: (id) => `http://localhost:3000/mock/products_detail/${id}.json`,
    // 通过产品id获取相关商家信息
    getRelatedShop: (id) => `http://localhost:3000/mock/shops/${id}.json`,
    // 获取流行关键字
    getPopularKeywords: () => `http://localhost:3000/mock/keywords/popular.json`,
    // 通过输入的信息获取关键字
    getRelatedKeywords: (text) => `http://localhost:3000/mock/keywords/related.json?keyword=${text}`,
    // 通过关键字获取商家列表
    getSearchResult: (keyword) => `http://localhost:3000/mock/shops/related.json?keyword=${keyword}`,
    // 获取个人订单列表
    getOrders: () => `http://localhost:3000/mock/orders/orders.json`
}