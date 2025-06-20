// src/App.tsx
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import UserForm from './modules/user/UserForm'
import ProductList from './modules/product/ProductList'
import OrderList from './modules/order/OrderList'
import { Button } from 'antd'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from 'react-router-dom'

function Home() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button
          onClick={() => setCount((c) => c + 1)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          count is {count}
        </button>
        <h1 className="text-3xl font-bold underline">Hello world!</h1>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
        <p className="font-bold text-3xl underline">Hello world</p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

function Contact() {
  return <h2>Contacto</h2>
}

export default function App() {
  return (
    <Router>
      <nav className="p-4 bg-gray-100 mb-6">
        <ul className="flex gap-4">
          <li>
            <Link to="/" className="text-blue-600 hover:underline">
              Inicio
            </Link>
          </li>
          <li>
            <Link to="/user" className="text-blue-600 hover:underline">
              User
            </Link>
          </li>
          <li>
            <Link to="/products" className="text-blue-600 hover:underline">
              Productos
            </Link>
          </li>
          <li>
            <Link to="/orders" className="text-blue-600 hover:underline">
              Órdenes
            </Link>
          </li>
          <li>
            <Link to="/contact" className="text-blue-600 hover:underline">
              Contacto
            </Link>
          </li>
        </ul>
      </nav>

      <main className="px-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user" element={<UserForm />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/orders" element={<OrderList />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
    </Router>
  )
}
