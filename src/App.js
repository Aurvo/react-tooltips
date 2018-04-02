import React, { Component } from 'react';
import ToolTip from './tooltip-components/standard-tooltip'
import LinkTip from './tooltip-components/links-tooltip'
import './App.css';

class App extends Component {
  render() {
    return (<div>
      <ToolTip        
        content={<p>I'm in a tooltip.</p>}
        display='block'
      >Hover for a tooltip.</ToolTip>
      <ToolTip
        content={<p>I'm in a second tooltip.</p>}
        containerStyles={{display: 'block', width: '200px'}}
        baseStyles={{color: 'red', textDecoration: 'underline'}}
        toolTipStyles={{backgroundColor: 'green', top: 'auto', bottom: '0%', left: '100%'}}
      >Hover for another tooltip.</ToolTip>
      <ToolTip
        content={this.getLinks()}
        display='block'
        toolTipStyles={{backgroundColor: '#cccc8f'}}
        click
      >Click to show links.</ToolTip>
      <LinkTip getLinkInfo={this.getLinkInfo} top="calc(100% + 8px)" left="0"
        arrow={{side:'top', where:'5%'}}/>
      </div>
    );
  }

  getLinks = () => (
    <ul>
      <li><a href="#">Link 1</a></li>
      <li><a href="#">Link 2</a></li>
      <li><a href="#">Link 3</a></li>
    </ul>    
  )

  getLinkInfo(resolve, reject) {
    setTimeout(() => {
      let data = null
      try {
        data = [
          {linkText: 'http://www.firstlink.com', href: '#', status: 'Active'},
          {linkText: 'http//beckonthesecond.net', href: '#', status: 'Pending'},
          {linkText: 'http://thirdsthecharm.org', href: '#', status: 'Active'}
        ]
      } catch(error) {
        reject(error)
        return
      }
      resolve(data)
    })
  }
}

export default App;
