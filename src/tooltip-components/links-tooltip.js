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
        fontSize: '12px',
        backgroundColor: '#d8dfd0',
        color: 'black',
        textAlign: 'center',
        padding: '3px',
        borderRadius: '6px',
        boxShadow: '0 0 3px black',
    
        // positoin absolute
        position: 'absolute',
    }

    arrowStyleTagJSX = null

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
            const arrowStyles = [
                'content: ""',
                'position: absolute',
                'border-width: ' + borderWidth + 'px',
                'border-style: solid',
                'transform-origin: center',
                'transform: rotate(45deg)'
            ]
            const beforeStyles = [
                'content: ""',
                'position: absolute',
                'z-index: -1',
                'border: ' + borderWidth + 'px solid transparent',
                'transform: rotate(45deg)',
                'box-shadow: 0 0 3px black'
            ]
            //positioned on correct side
            const sideWithArrow = propArrow.side
            arrowStyles.push(`${sideWithArrow}: ${-0.9*borderWidth}px`)
            beforeStyles.push(`${sideWithArrow}: ${-0.9*borderWidth}px`)
            //rotation (the arrow isn't actually rotated here, the border colors
            //are just set to a color or transparent depending on where the arrow
            //should be)
            const backgroundColor = this.ToolTip.backgroundColor || 'grey'
            arrowStyles.push([
                'border-color:',
                sideWithArrow === 'top' || sideWithArrow === 'right' ? backgroundColor : 'transparent', //top border
                sideWithArrow === 'right' || sideWithArrow === 'bottom' ? backgroundColor : 'transparent', //right border
                sideWithArrow === 'bottom' || sideWithArrow === 'left' ? backgroundColor : 'transparent', //bottom border
                sideWithArrow === 'left' || sideWithArrow === 'top' ? backgroundColor : 'transparent' //left border
            ].join(' '))
            //positioned correctly ON the side,
            if (sideWithArrow === 'top' || sideWithArrow === 'bottom') {
                arrowStyles.push('left: ' + propArrow.where)
                beforeStyles.push('left: ' + propArrow.where)
            } else { //left or right
                arrowStyles.push('top: ' + propArrow.where)
                beforeStyles.push('top: ' + propArrow.where)
            }
            //set arrow JSX
            this.arrowStyleTagJSX = <style>{`.q07-link-tip::before { ${beforeStyles.join('; ')} } .q07-link-tip::after { ${arrowStyles.join('; ')} }`}</style>
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
                const linkArray = data.map((el, index) => (
                    <li key={index}>
                        <a href={el.href}>{el.linkText}</a> - {el.status}
                    </li>
                ))
                this.setState({
                    tipState: this.tipStates.revealing,
                    tipJSX: (
                    <React.Fragment>
                        <h4>Competetor Links</h4>
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
            case tipStates.loading: //no tooltip, show text + spinner as the base
                base = (<span style={this.ToolTipBase}>{this.props.text + ' '}
                    <span className="fa fa-circle-o-notch fa-spin"></span>
                </span>);
                break;
            case tipStates.error: //no tooltip (it failed), show a redder base
                base = (<span style={this.ToolTipErrorBase}>{this.props.text + ' '}
                    <span className="fa fa-info-circle"></span>
                </span>);
                break;
            case tipStates.revealing: //render base and tooltip
                toolTip = <span className="q07-link-tip" style={this.ToolTip}>
                            {this.state.tipJSX}
                          </span>;
                //no break on purpose
            default: //just render base
                base = (<span style={this.ToolTipBase}>{this.props.text + ' '}
                    <span className="fa fa-info-circle"></span>
                </span>);
        }
        return (
            <span style={this.ToolTipContainer} onClick={this.clickHandler}>
                {this.arrowStyleTagJSX /*null if no arrow*/ }
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
    text: PropTypes.string,
    arrow: PropTypes.shape({
        side: PropTypes.oneOf(['top','left','right','bottom']),
        where: PropTypes.string
    }),
    //Required
    getLinkInfo: PropTypes.func.isRequired
}

export default LinkTip