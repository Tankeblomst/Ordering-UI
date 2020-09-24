import React from 'react'
import ReactDOM from 'react-dom'
import { Router } from './template/router'
import { OrderingProvider } from 'ordering-components'

const configFile = {
  project: 'luisv4',
  api: {
    url: 'http://apiv4-features.ordering.co',
    language: 'en',
    version: 'v400'
  },
  socket: {
    url: 'https://socket-staging.ordering.co'
  }
}

const wrapper = document.getElementById('app')
ReactDOM.render(
  <OrderingProvider settings={configFile}>
    <Router />
  </OrderingProvider>
  , wrapper)
