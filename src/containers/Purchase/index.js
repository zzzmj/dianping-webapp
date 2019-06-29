import React, { Component } from 'react'
import { connect } from 'react-redux'
import Header from '../../components/Header'
import PurchaseForm from './components/PurchaseForm'
import { actions as purchaseActions, getPurchaseQuantity, getTipStatus  } from '../../redux/modules/purchase'
import Tip from '../../components/Tip'
import { bindActionCreators } from 'C:/Users/1/AppData/Local/Microsoft/TypeScript/3.5/node_modules/redux';
import { getProduct } from '../../redux/modules/detail';
import './style.css'

class Purchase extends Component {
    render() {
        const {
            product: { currentPrice, product },
            quantity,
            showTip
        } = this.props
        return (
            <div>
                <Header title="下单" color={"#fff"} onBack={this.handleBack}></Header>
                <h3 className="purchase__header">{product}</h3>
                <PurchaseForm 
                    quantity={quantity}
                    price={currentPrice}
                    onChange={this.handleChange}
                    onIncrease={this.handleIncrease}
                    onDecrease={this.handleDecrease}
                    onSubmit={this.handleSubmit} />
                {showTip ? <Tip message="购买成功！" onClose={this.handleCloseTip} /> : null}
            </div>
        )
    }

    componentDidMount() {
        //组件加载完成后，通过地址栏参数的产品id去获取产品价格信息
        const id = this.props.match.params.id
        console.log(this.props)
        console.log('挂载完获取产品id：', id)
        // 发送请求
        console.log('prodcut: ', this.props.product)
    }

    componentWillUnmount() {
        // 组件删除时，保持状态为初始值：订单选择数量为1
        this.props.purchaseActions.setOrderQuantity(1)
    }

    handleChange = (quantity) => {
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
        console.log('提交id', productId)
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
        product: getProduct(state, productId),
        quantity: getPurchaseQuantity(state),
        showTip: getTipStatus(state),
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        purchaseActions: bindActionCreators(purchaseActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Purchase)