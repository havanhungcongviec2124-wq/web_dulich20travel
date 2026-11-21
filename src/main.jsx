import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import router from './routers/router'
import store from './redux/store'
import { fetchCategories, fetchServices, fetchLocations } from './redux/slices/catalogSlice'
import { fetchConsultants } from './redux/slices/consultantSlice'
import { fetchContent } from './redux/slices/contentSlice'
import { fetchMe } from './redux/slices/authSlice'
import { getToken } from './redux/Api/http'

// Prevent pinch/double-tap zoom on mobile/tablet (especially iOS Safari).
if (typeof document !== 'undefined') {
  document.addEventListener('gesturestart', (e) => e.preventDefault(), { passive: false })
  document.addEventListener('gesturechange', (e) => e.preventDefault(), { passive: false })
  document.addEventListener('gestureend', (e) => e.preventDefault(), { passive: false })
  document.addEventListener(
    'touchmove',
    (e) => {
      if (e.touches && e.touches.length > 1) e.preventDefault()
    },
    { passive: false }
  )
}

const Bootstrap = ({ children }) => {
  useEffect(() => {
    store.dispatch(fetchCategories())
    store.dispatch(fetchServices({ limit: 500 }))
    store.dispatch(fetchLocations())
    store.dispatch(fetchConsultants())
    store.dispatch(fetchContent())
    if (getToken()) {
      store.dispatch(fetchMe())
    }
  }, [])

  return children
}

const root = createRoot(document.getElementById('root'))
root.render(
  <StrictMode>
    <Provider store={store}>
      <Bootstrap>
        <RouterProvider router={router} />
      </Bootstrap>
    </Provider>
  </StrictMode>
)
