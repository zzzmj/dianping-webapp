import React, { Component } from 'react'
import { connect } from 'react-redux'
import ProductOverview from './components/ProductOverview';
import ShopInfo from './components/ShopInfo';
import Detail from './components/Detail';
import Remark from './components/Remark';
import BuyButton from './components/BuyButton';
import Header from '../../components/Header'
import { actions, getProduct, getRelatedShop } from '../../redux/modules/detail'

class ProductDetail extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return true
    }
    
    render() {
        const { product, relatedShop } = this.props

        return (
            <div>
                <Header title={"团购详情"} onBack={this.handleClick}/>
                {product && <ProductOverview data={product} />}
                {relatedShop && <ShopInfo data={relatedShop} total={product.shopIds.length} />}
                {product && (<div>
                    <Detail data={product}/>
                    <Remark data={product}/>
                </div>) }
                <BuyButton id={product ? product.id : ''}/>
            </div>
        )
    }

    handleClick = () => {
        this.props.history.goBack();
    }

    componentDidMount() {
        const { product } = this.props
        // 第一次加载好数据，后面不要再重复加载，使用redux的缓存
        if (!product) {
            const productId = this.props.match.params.id
            this.props.loadProductDetail(productId)
        }
    }

    componentDidUpdate(preProps) {
        const props = this.props
        // 第一次从product中获取商家id，发送请求
        if(!preProps.product && props.product && props.product.nearestShop) {
            const shopId = props.product.nearestShop
            props.loadRelatedShop(shopId)
        }
    }
}

const mapStateToProps = (state, props) => {
    const productId = props.match.params.id
    return {
        product: getProduct(state, productId),
        relatedShop: getRelatedShop(state, productId)
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        loadProductDetail: (id) => {
            dispatch(actions.loadProductDetail(id))
        },
        loadRelatedShop: (id) => {
            dispatch(actions.loadRelatedShop(id))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetail)
