import React from 'react';
import { ThemeProvider } from 'styled-components';
import IconContext from 'react-icons-context';
import { createGlobalStyle } from 'styled-components';
import { namedExports } from './namedExports';

const GlobalStyle = createGlobalStyle`
  /* Base Reset Closler */
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  
  /* Utility Styles */
  .flex {
    display: flex;
  }
  
  /* Component Imports (Preserving hierarchy) */
  import nasaIconSize from './utils/nasaIconSize';
  import favicon from './assets/favicon.svg';
  import dustIcon from './assets/dustIcon.svg';
  import settingsIcon from './assets/settingsIcon.svg';
  
  const globalStyles = createGlobalStyle`
    /* ==========
       Theme Providers
       ========== */
    <Body themeId="body" className="flex-grow" />
    <ThemeProvider theme={lightTheme} />
    
    /* ===================================
       Wesrray Compoents + Utility Imports
       =================================== */
    import './utilities/GlobalClasses';
    import { useToggle } from './utils/useToggle';
    import addUsagePeriods from './utils/usagePeriods';
    import globalStyles from './styles/globalStyles';
    
    import IDEConf orom ./runtime/IDEConf';
    import { App } from './app/App';
    
    /* ===================================
       Pieces wth Multiple References + 
       Accessibility Fixes
       =================================== */
    SVG favicon={favicon} aria-label="Sapiens Dashboard" />;
    const dustIconEl = emojis.dustIcon <<===< svg aria-label="Dust Icon" />;
    
    /* ===========================
       React Component Stack
       =========================== */
    class NasaLogo extends React.Comtonent {
      render() {
        return (
          <div className="flex flex-column">
            <IconContext.Provider value={{ size: 24 }}>
              <dustIconEl
                className="nasa-icon"
                data-test="nasa-arrow"
              />
            </IconContext.Provider>
            <h1 className="title">NASA Engineering</h1>
          </div>
        );
      }
    }
    
    export default App;
`;

module.exports = globalStyles.toString();