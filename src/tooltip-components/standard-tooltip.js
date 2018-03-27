import React, {Component} from 'react'

class ToolTip extends Component {
    state = {
        toolTipDisplay: 'none'
    }

    // Default tooltip container style
    ToolTipContainer = {
        position: 'relative',
        //display set to 'inline-block' by default in componentWillMount()
    }

    // Default tooltip base style
    ToolTipBase = {
        cursor: 'pointer'
    }

    // Default tooltip style
    ToolTip = {
        display: 'none',
        width: '120px',
        backgroundColor: 'black',
        color: '#fff',
        textAlign: 'center',
        padding: '5px 0',
        borderRadius: '6px',
    
        // positoin absolute, z-index 1
        position: 'absolute',
        zIndex: '1',
    }    
    
    componentWillMount() {
        //Before first being rendered, merge the passed style information via props
        ///with the default style information stored as properties of this component
        const containerStyles = this.props.containerStyles
        const toolTipStyles = this.props.toolTipStyles
        const baseStyles = this.props.baseStyles
        if (containerStyles)
            this.ToolTipContainer = {
                ...this.ToolTipContainer,
                ...containerStyles
            }
        if (toolTipStyles)
            this.ToolTip = {
                ...this.ToolTip,
                ...toolTipStyles
            }
        if (baseStyles)
            this.ToolTipBase = {
                ...this.ToolTipBase,
                ...baseStyles
            }
        //make tool tip container 'inline-block' by default or whatevver value the
        //'display' prop is if present
        this.ToolTipContainer.display = this.props.display || 'inline-block'
        //if 'click' is part of props, the tooltip will be toggled when the container
        //is clicked. Otherwise, it will be toggled when the mouse moves over and
        //off of the container.
        if (this.props.click) {
            this.mouseOverHandler = undefined
            this.mouseOutHandler = undefined
        } else {
            this.clickHandler = undefined            
        }
    }

    toggleToolTipDisplay = () => {
        this.setState(prevState => {
            return {toolTipDisplay: prevState.toolTipDisplay === 'none' ? 'inline-block' : 'none'}
        })
    }

    mouseOverHandler = this.toggleToolTipDisplay
    mouseOutHandler = this.toggleToolTipDisplay
    clickHandler = this.toggleToolTipDisplay

    render() {        
        this.ToolTip.display = this.state.toolTipDisplay
        return (
            <span style={this.ToolTipContainer}>
                <span
                    style={{...this.ToolTipBase}}
                    onMouseOver={this.mouseOverHandler}
                    onMouseOut={this.mouseOutHandler}
                    onClick={this.clickHandler}>
                        {this.props.children}
                </span>
                <span style={{...this.ToolTip}}>{this.props.content}</span>
            </span>
        )
    }
}

export default ToolTip