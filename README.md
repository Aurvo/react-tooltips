The src/tooltip-components folder contains some react tooltip components I made.
The component in the link-tooltip.js file requires Font Awesome.

link-tooltip.js Usage:
Has a component that appears as an info icon. Clicking the icon will cause
a tooltip to appear containg links based on information that was dynamically loaded
via an asynchronous function passed in the props. Other props control the 
positioning of the tooltip as well as that of the tooltip arrow.

Props:

getLinkInfo (required): The only required prop. This is the asynchronous function
that gets the data for the links when the tooltip is loading. Must accept two parameters:
  resolve: the function to form the links that the component is to supply. Call this
           after your function gets the link data. One parameter:
           data: an object containing the link information. Each property should correspond
           to a link. The property's name should be the text that is seen on the webpage.
           The property's value should be the actual URI. Example:
            {
              'Click me to go somewhere': 'http://www.somewhere.com',
              'Another Link': 'http://anotherplace.com'
            }
  reject: The function that the component will supply for when the data fails to load. One
          parameter:
          error: a javaScript error object


top/left/bottom/right: all strings for the CSS styles of the tooltip having the same
names. Note that the tooltip is positioned absolutely within the component.

arrow: An object defining where the tooltip's arrow is. No arrow will be present if
this is omitted. Object properties:
  side: which side of the tooltip the arrow should be on.
        Possible values: 'top', 'left', 'bottom', 'right'
  where: A string representing how far along the side the arrow should be.
         Will be used to populate a CSS value, so example strings are those like
         '10px' or '50%'.
         The bigger the number, the further down or right the arrow will be depemding
         on which side it's on.

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).