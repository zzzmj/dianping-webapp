import React, { Component } from 'react'
import './style.css'

class Header extends Component {
    render() {
        const { color, title, onBack } = this.props
        return (
            <header className="header" style={{ backgroundColor: color }}>
                <div className="header__back" onClick={onBack}> 
                    返回
                </div>
                <div className="header__title">{title}</div>
            </header>
        )
    }
}

export default Header