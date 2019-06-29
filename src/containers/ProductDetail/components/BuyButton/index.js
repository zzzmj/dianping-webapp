import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './style.css'

class BuyButton extends Component {
    render() {
        const { id } = this.props
        return (
            <div className="buyButton">
                {/* TODO: 填写对应产品ID */}
                <Link className="buyButton__btn" to={`/purchase/${id}`}>APP下单返积分抵现金</Link>
            </div>
        )
    }
}

export default BuyButton