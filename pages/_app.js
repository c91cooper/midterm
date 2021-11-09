import React from 'react'
import '../styles/globals.css'
import initAuth from '../utils/initAuth'
import { ChakraProvider } from "@chakra-ui/react"

initAuth()

function MyApp({ Component, pageProps }) {
  
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp
