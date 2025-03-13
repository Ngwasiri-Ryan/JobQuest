import React from 'react'
import Navigator from './src/frontend/navigator'
import { ProgressProvider } from './src/frontend/context/ProgressContext'
import { UserProvider } from './src/frontend/hooks/UserContext'

const App = () => {
    return (
      <UserProvider>
        <ProgressProvider>
          <Navigator />
        </ProgressProvider>
      </UserProvider>
    );
}

export default App