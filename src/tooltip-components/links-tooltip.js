import React, {Component} from 'react'
import PropTypes from 'prop-types'

class LinkTip extends Component {
    /*  4 tipStates:
        'normal': component should just render base without tooltip
        'loading': component is loading the links for the tooltip
                   base should be a spinner and should be unclickable    
        'revealing': component should render the base and the tooltip
        'error': component failed to load linkis, component becomes dead
    */
    
    //state constants:
    tipStates = {
        normal: 0,
        loading: 1,
        revealing: 2,
        error: 3
    }

    state = {
        tipState: this.tipStates.normal,
        tipJSX: null
    }
    
    // Default tooltip container style
    ToolTipContainer = {
        position: 'relative',
        display: 'inline-block',
        maxWidth: '100%'
    }

    // Default tooltip base style
    ToolTipBase = {
        cursor: 'pointer',
        display: 'inline-bloxk'
    }

    //styles for the base when the tooltip fails to load
    ToolTipErrorBase = {
        color: 'red',
        display: 'inline-bloxk'
    }

    // Default tooltip style
    ToolTip = {
        display: 'inline-block',
        boxSizing: 'border-box',
        width: '250px',
        backgroundColor: '#b5dbd6',
        color: 'black',
        textAlign: 'center',
        padding: '3px',
        borderRadius: '6px',
        boxShadow: '5px 5px 5px grey',
    
        // positoin absolute, z-index 1
        position: 'absolute',
        zIndex: '1',
    }

    arrowJSX = null

    //before component first renders, handle innitial setup based on props
    componentWillMount() {
        //handle top, left, right, bottom props
        this.ToolTip.top = this.props.top || undefined
        this.ToolTip.left = this.props.left || undefined
        this.ToolTip.right = this.props.right || undefined
        this.ToolTip.bottom = this.props.bottom || undefined
        //handle arrow prop
        const propArrow = this.props.arrow
        if (propArrow) {
            //starting arrow stypes
            const borderWidth = 7
            const arrowStyles = {
                content: '',
                position: 'absolute',
                zIndex: '1',
                borderWidth: borderWidth + 'px',
                borderStyle: 'solid'
            }
            //positioned on correct side
            arrowStyles[propArrow.side] = (-2*borderWidth)+'px'
            //rotation
            const backgroundColor = this.ToolTip.backgroundColor || 'grey'
            arrowStyles.borderColor = [
                arrowStyles.bottom ? backgroundColor : 'transparent', //top border
                arrowStyles.left ? backgroundColor : 'transparent', //right border
                arrowStyles.top ? backgroundColor : 'transparent', //bottom border
                arrowStyles.right ? backgroundColor : 'transparent' //left border
            ].join(' ')
            //positioned correctly ON the side,
            //also, box shadow placement so shadow doesn't overlap with arrow
            if (arrowStyles.top || arrowStyles.bottom) {
                arrowStyles.left = propArrow.where
                if (arrowStyles.bottom) this.setTipBoxShadow(true, false, 5)
            } else { //left or right
                arrowStyles.top = propArrow.where
                if (arrowStyles.right) this.setTipBoxShadow(false, true, 5)
            }
            //set arrow JSX
            this.arrowJSX = <span style={arrowStyles}></span>
        }
    }

    //only update if tipState changes. tipJSX is only part of state to ensure
    //that it updates at the same time that tipState asynchronously updates
    shouldComponentUpdate(nextProps, nextState) {
        return nextState.tipState !== this.state.tipState
    }

    //upon update, if tipState is 'loading', compute the link info with the
    //passed function via props and form the appropriate JSX for the tooltip
    componentDidUpdate() {
        const tipStates = this.tipStates
        if (this.state.tipState === tipStates.loading) {
            this.props.getLinkInfo((data) => {
                const linkArray = []
                let index = -1
                for (let linkName in data) {
                    index++;
                    linkArray.push(<li
                        key={index}>
                            <a href={data[linkName]}>{linkName}</a>
                    </li>)
                }
                this.setState({
                    tipState: this.tipStates.revealing,
                    tipJSX: (
                    <React.Fragment>
                        <h3>Links</h3>
                        <ul style={{textAlign: 'left'}}>
                            {linkArray}
                        </ul>
                    </React.Fragment>
                    )
                })
            },
            (error) => {
                this.setState({tipState: tipStates.error})
                console.log(error.message)
            })
        }
    }

    //name self explanatory
    //first two parameters indicate whether to apply negetive vertical or
    //horizantal values to box shadow
    setTipBoxShadow = (negVert, negHor, size) => {
        this.ToolTip.boxShadow =
            `${negHor ? '-' : ''}${size}px ${negVert ? '-' : ''}${size}px ${size}px grey`
    }

    clickHandler = () => {
        const tipStates = this.tipStates
        if (this.state.tipState === tipStates.revealing)
            this.setState({tipState: tipStates.normal})
        else if (this.state.tipState === tipStates.normal)
            this.setState({tipState: tipStates.loading})
    }

    render() {
        let toolTip = null
        let base = null;
        const tipStates = this.tipStates
        switch (this.state.tipState) {
            case tipStates.loading: //no tooltip, show spinner as the base
                base = <span className="fa fa-circle-o-notch fa-spin"></span>;
                break;
            case tipStates.error: //no tooltip (it failed), show a redder base
                base = <span className="fa fa-info-circle" style={this.ToolTipErrorBase}></span>;
                break;
            case tipStates.revealing: //render base and tooltip
                toolTip = <span style={this.ToolTip}>
                            {this.state.tipJSX}{this.arrowJSX}
                          </span>;
                //no break on purpose
            default: //just render base
                base = <span className="fa fa-info-circle" style={this.ToolTipBase}></span>;
        }
        return (
            <span style={this.ToolTipContainer} onClick={this.clickHandler}>
                {base}
                {toolTip}
            </span>
        )
    }
}

LinkTip.propTypes = {
    //Optional
    top: PropTypes.string,
    left: PropTypes.string,
    bottom: PropTypes.string,
    right: PropTypes.string,
    arrow: PropTypes.shape({
        side: PropTypes.oneOf(['top','left','right','bottom']),
        where: PropTypes.string
    }),
    //Required
    getLinkInfo: PropTypes.func.isRequired
}

export default LinkTip