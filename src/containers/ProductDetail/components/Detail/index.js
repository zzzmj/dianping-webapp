import React, { Component } from 'react'
import './style.css'

class Detail extends Component {
    render() {
        return (
            <div className="detail">
                <div className="detail__header">
                    <span>团购详情</span>
                    <i className="detail__headerIcon" />
                </div>
                <table
                    cellPadding="0"
                    cellSpacing="0"
                    className="detail__table"
                >
                    <tbody>
                        <tr className="detail__row">
                            <th colSpan="3" className="detail__category">
                                饮品
                            </th>
                        </tr>
                        <tr className="detail__row">
                            <td>白果香（冷饮）</td>
                            <td className="detail__td--alignRight">1扎</td>
                            <td className="detail__td--alignRight">48元</td>
                        </tr>
                        <tr className="detail__row">
                            <td />
                            <td className="detail__td--price">
                                最高价值
                                <br />
                                <strong className="detail__td--priceNew">
                                    团购价
                                </strong>
                            </td>
                            <td className="detail__td--price">
                                48元
                                <br />
                                <strong className="detail__td--priceNew">
                                    19.9元
                                </strong>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="detail__remark">免费提供餐巾纸</div>
                <div className="detail__more">
                    <span>更多图文详情</span>
                    <span className="detail__notice">
                        (建议Wifi环境下打卡，土豪请随意)
                    </span>
                    <i className="detail__arrow" />
                </div>
            </div>
        )
    }
}

export default Detail
