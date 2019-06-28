import React, { Component } from 'react'
import './style.css'

class OrderItem extends Component {
    render() {
        const {
            data: { title, statusText, orderPicUrl, channel, text, type }
        } = this.props
        return (
            <div className="orderItem">
                <div className="orderItem__title">
                    <span>{title}</span>
                </div>
                <div className="orderItem__main">
                    <div className="orderItem__imgWrapper">
                        <div className="orderItem__tag">{statusText}</div>
                        <img
                            alt=""
                            className="orderItem__img"
                            src={orderPicUrl}
                        />
                    </div>
                    <div className="orderItem__content">
                        <div className="orderItem__line">{text[0]}</div>
                        <div className="orderItem__line">{text[1]}</div>
                    </div>
                </div>
                <div className="orderItem__bottom">
                    <div className="orderItem__type">{channel}</div>
                    <div>
                        {type === 1 ? (
                            <div className="orderItem__btn">评价</div>
                        ) : null}
                        <div className="orderItem__btn" onClick={this.handleRemove}>删除</div>
                    </div>
                </div>
                {this.renderEditArea()}
            </div>
        )
    }

    // 渲染订单评价区域
    renderEditArea = () => {
        return (
            <div className="orderItem__commentContainer">
                <textarea
                className="orderItem__comment"
                onChange={this.handleCommentChange}
                value={""}
                />
                {this.renderStars()}
                <button 
                    className="orderItem__commentBtn"
                    onClick={null}
                    >提交</button>
                <button className="orderItem__commentBtn"
                    onClick={null}
                    >取消</button>
            </div>
        )
    }

    // 渲染五角星
    renderStars() {
        return (
          <div>
            {[1, 2, 3, 4, 5].map((item, index) => {
              const lightClass = 3 >= item ? "orderItem__star--light" : "";
              return (
                <span
                  className={"orderItem__star " + lightClass}
                  key={index}
                  onClick={null}
                >
                  ★
                </span>
              );
            })}
          </div>
        );
      }

    handleRemove = () => {
        this.props.onRemove()
    }
}

export default OrderItem
