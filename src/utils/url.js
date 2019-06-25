export default {
    /**
     * type: 请求类型
     * rowIndex: 页码下标
     * pageSize: 一页显示多少条数据
     */
    getProductList: (types, rowIndex, pageSize) => `http://localhost:3000/mock/products/${types}.json?rowIndex=${rowIndex}&pageSize=${pageSize}`,
    // 产品的id
    getProductDetail: (id) => `http://localhost:3000/mock/products_detail/${id}.json`,
    // 产品的id
    getRelatedShop: (id) => `http://localhost:3000/mock/shops/${id}.json`,
    getPopularKeywords: () => `http://localhost:3000/mock/keywords/popular.json`,
    getRelatedKeywords: () => `http://localhost:3000/mock/keywords/related.json`
}