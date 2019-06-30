import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Header from '../../components/Header'
import PurchaseForm from './components/PurchaseForm'
import {
    actions as purchaseActions,
    getPurchaseQuantity,
    getTipStatus,
    getProduct
} from '../../redux/modules/purchase'
import { actions as detailActions } from '../../redux/modules/detail'
import Tip from '../../components/Tip'

import './style.css'

class Purchase extends Component {
    render() {
        const {
            productDetail,
            quantity,
            showTip
        } = this.props
        if (!productDetail) return null
        const { product, currentPrice } = productDetail
        return (
            <div>
                <Header title="下单" color={'#fff'} onBack={this.handleBack} />
                <h3 className="purchase__header">{product}</h3>
                <PurchaseForm
                    quantity={quantity}
                    price={currentPrice}
                    onChange={this.handleChange}
                    onIncrease={this.handleIncrease}
                    onDecrease={this.handleDecrease}
                    onSubmit={this.handleSubmit}
                />
                {showTip ? (
                    <Tip message="购买成功！" onClose={this.handleCloseTip} />
                ) : null}
            </div>
        )
    }

    componentDidMount() {
        //组件加载完成后，通过地址栏参数的产品id去获取产品价格信息
        const id = this.props.match.params.id
        // 使用detail下的action发送请求产品数据
        this.props.detailActions.loadProductDetail(id)
    }

    componentWillUnmount() {
        // 组件删除时，保持状态为初始值：订单选择数量为1
        this.props.purchaseActions.setOrderQuantity(1)
    }

    handleChange = quantity => {
        this.props.purchaseActions.setOrderQuantity(parseInt(quantity))
    }

    handleIncrease = () => {
        const { quantity } = this.props
        this.props.purchaseActions.setOrderQuantity(quantity + 1)
    }

    handleDecrease = () => {
        const { quantity } = this.props
        const res = quantity - 1
        this.props.purchaseActions.setOrderQuantity(res <= 1 ? 1 : res)
    }

    handleSubmit = () => {
        const productId = this.props.match.params.id
        this.props.purchaseActions.submitOrder(productId)
    }

    handleCloseTip = () => {
        this.props.purchaseActions.closeTip()
    }

    handleBack = () => {
        this.props.history.goBack()
    }
}

const mapStateToProps = (state, props) => {
    const productId = props.match.params.id
    return {
        productDetail: getProduct(state, productId),
        quantity: getPurchaseQuantity(state),
        showTip: getTipStatus(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        purchaseActions: bindActionCreators(purchaseActions, dispatch),
        detailActions: bindActionCreators(detailActions, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Purchase)
