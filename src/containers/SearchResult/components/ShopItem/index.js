import React, { Component } from 'react'
import './style.css'

class ShopItem extends Component {
    render() {
        const {
            url,
            pic,
            shop,
            star,
            price,
            quantity,
            region,
            category
        } = this.props.data
        return (
            <a className="shopItem" href={url}>
                <div
                    className="shopItem__pic"
                    style={{ backgroundImage: 'url(' + pic + ')' }}
                />
                <div className="shopItem__content">
                    <div className="shopItem__title">{shop}</div>
                    <div className="shopItem__comment">
                        <span
                            className={'shopItem__star shopItem__star--' + star}
                        />
                        <span className="shopItem__quantity">{quantity}</span>
                        <span className="shopItem__price">{price}/人</span>
                    </div>
                    <div className="shopItem__info">
                        <span className="shopItem__region">{region}</span>
                        <span className="shopItem__category">{category}</span>
                    </div>
                </div>
            </a>
        )
    }
}

export default ShopItem
