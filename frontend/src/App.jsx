import React from 'react';
import {BrowserRouter as Router,Routes,Route,Navigate} from 'react-router-dom';
import {AuthProvider,useAuth} from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login'; import Dashboard from './pages/Dashboard'; import Sales from './pages/Sales';
import QuickSale from './pages/QuickSale'; import Production from './pages/Production'; import Stock from './pages/Stock';
import Products from './pages/Products'; import Financial from './pages/Financial'; import Backup from './pages/Backup';
function Protected({children}){const {isAuthenticated,loading}=useAuth(); if(loading)return <div className="p-8">Carregando...</div>; return isAuthenticated?children:<Navigate to="/login"/>}
export default function App(){return <AuthProvider><Router><Routes><Route path="/login" element={<Login/>}/><Route path="/" element={<Protected><Layout/></Protected>}><Route index element={<Dashboard/>}/><Route path="vendas" element={<Sales/>}/><Route path="venda-rapida" element={<QuickSale/>}/><Route path="producao" element={<Production/>}/><Route path="estoque" element={<Stock/>}/><Route path="produtos" element={<Products/>}/><Route path="financeiro" element={<Financial/>}/><Route path="backup" element={<Backup/>}/></Route></Routes></Router></AuthProvider>}