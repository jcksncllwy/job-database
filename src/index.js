/* global window, document */
import React from 'react'
import { render } from 'react-dom'
import App from 'app.js'

console.log(document.getElementById('react-root'))

render(<App />, document.getElementById('react-root'))

