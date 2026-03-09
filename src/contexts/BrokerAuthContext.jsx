import { createContext, useContext, useState, useEffect } from 'react'

const BrokerAuthContext = createContext(null)

export function BrokerAuthProvider({ children }) {
  const [broker, setBroker] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('broker_token')
    const savedBroker = localStorage.getItem('broker_data')
    if (saved && savedBroker) {
      setToken(saved)
      try { setBroker(JSON.parse(savedBroker)) } catch { /* ignore */ }
    }
    setLoading(false)
  }, [])

  const login = (tokenVal, brokerData) => {
    setToken(tokenVal)
    setBroker(brokerData)
    localStorage.setItem('broker_token', tokenVal)
    localStorage.setItem('broker_data', JSON.stringify(brokerData))
  }

  const logout = () => {
    setToken(null)
    setBroker(null)
    localStorage.removeItem('broker_token')
    localStorage.removeItem('broker_data')
  }

  return (
    <BrokerAuthContext.Provider value={{ broker, token, loading, login, logout }}>
      {children}
    </BrokerAuthContext.Provider>
  )
}

export function useBrokerAuth() {
  return useContext(BrokerAuthContext)
}
