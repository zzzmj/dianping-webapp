import React, { Component } from 'react'
import './style.css'

class Confirm extends Component {
    render() {
        const {
            content,
            cancelText,
            confirmText,
            onCancel,
            onConfirm
        } = this.props
        return (
            <div className="confirm">
                <div className="confirm__alert">
                    <div className="confirm__content">{content}</div>
                    <div className="confirm__btns">
                        <button className="confirm__btn confirm__btn--cancel" onClick={onCancel}>
                            {cancelText}
                        </button>
                        <button className="confirm__btn confirm__btn--confirm" onClick={onConfirm}>
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Confirm
