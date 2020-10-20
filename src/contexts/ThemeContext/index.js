import React, { createContext, useContext, useEffect } from 'react'
import { createGlobalStyle, ThemeProvider as ThemeProviderStyled } from 'styled-components'

/**
 * Create ThemeContext
 * Context to use theme on the app
 */
export const ThemeContext = createContext()

/**
 * Api provider to manage theme
 * @param {props} props
 */
export const ThemeProvider = ({ theme, children }) => {
  const GlobalStyle = createGlobalStyle`
    /** Mozilla scrollbar*/
    * {
      scrollbar-color: #CCC !important;
      scrollbar-width: thin !important;
    }

    /** Scrollbar for browser based on webkit */
    ::-webkit-scrollbar {
      width: 6px;
      height: 0px;
    }
    ::-webkit-scrollbar-thumb {
      background: #CCCCCC;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #AFAFAF;
    }
    ::-webkit-scrollbar-thumb:active {
      background: #6b6b6b;
    }
    ::-webkit-scrollbar-track {
      background: rgba(204, 204, 204, 0.3);
    }

    body {
      font-family: '${theme.fonts.primary?.name || 'Helvetica'}', sans-serif;
      margin: 0;
      background-color: #F8F8F8;
      color: #333;
    }

    input, textarea, button {
      font-family: inherit;
    }

    .popup-backdrop {
      background-color: rgba(0, 0, 0, 0.4);
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 2000;
    }

    .popup-component {
      background-color: rgba(0, 0, 0, 0.3);
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `

  useEffect(() => {
    const fonts = Object.entries(theme.fonts || {})
    fonts.forEach(([name, fontFamily]) => {
      if (!window.document.getElementById(`${name}-font-styles`)) {
        const font = window.document.createElement('link')
        font.id = `${name}-font-styles`
        font.rel = 'stylesheet'
        font.async = true
        font.defer = true
        font.href = `https://fonts.googleapis.com/css2?family=${fontFamily.name}:wght@${fontFamily.weights.join(';')}&display=swap`

        window.document.body.appendChild(font)
      }
    })
  }, [])

  return (
    <ThemeContext.Provider value={[theme]}>
      <ThemeProviderStyled theme={theme}>
        <GlobalStyle />
        {children}
      </ThemeProviderStyled>
    </ThemeContext.Provider>
  )
}

/**
 * Hook to get theme state
 */
export const useTheme = () => {
  const themeManager = useContext(ThemeContext)
  return themeManager || [{}]
}