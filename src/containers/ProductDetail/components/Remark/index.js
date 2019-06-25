import React, { Component } from 'react'
import './style.css'

class Remark extends Component {
    render() {
        return (
            <div className="remark">
                <div className="remark__header">
                    购买须知
                    <i className="remark__icon" />
                </div>
                <div className="remark__list">
                    <dl className="remark__item">
                        <dt className="remark__itemTitle">有效期</dt>
                        <dd className="remark__itemDesc">
                            2018-10-20至2019-09-15
                        </dd>
                    </dl>
                    <dl className="remark__item">
                        <dt className="remark__itemTitle">除外日期</dt>
                        <dd className="remark__itemDesc">
                            有效期内周末、法定节假日可用
                        </dd>
                    </dl>
                    <dl className="remark__item">
                        <dt className="remark__itemTitle">使用时间</dt>
                        <dd className="remark__itemDesc">
                            团购券使用时间：11:00-22:00
                        </dd>
                    </dl>
                    <dl className="remark__item">
                        <dt className="remark__itemTitle">预约提醒</dt>
                        <dd className="remark__itemDesc">
                            无需预约，消费高峰时可能需要等位
                        </dd>
                    </dl>
                    <dl className="remark__item">
                        <dt className="remark__itemTitle">规则提醒</dt>
                        <dd className="remark__itemDesc">
                            每张团购券建议2人使用
                        </dd>
                    </dl>
                </div>
            </div>
        )
    }
}

export default Remark
