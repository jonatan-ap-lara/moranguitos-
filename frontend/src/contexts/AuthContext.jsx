import React,{createContext,useContext,useState} from 'react';
import {api} from '../services/api';
const C=createContext(null);
export function AuthProvider({children}){
 const [user,setUser]=useState(()=>JSON.parse(localStorage.getItem('user')||'null'));
 const [loading]=useState(false);
 const login=async(email,password)=>{const r=await api.post('/auth/login',{email,password});localStorage.setItem('token',r.data.token);localStorage.setItem('user',JSON.stringify(r.data.user));setUser(r.data.user);};
 const register=async(name,email,password)=>{const r=await api.post('/auth/register',{name,email,password});localStorage.setItem('token',r.data.token);localStorage.setItem('user',JSON.stringify(r.data.user));setUser(r.data.user);};
 const logout=()=>{localStorage.removeItem('token');localStorage.removeItem('user');setUser(null)};
 return <C.Provider value={{user,isAuthenticated:!!user,loading,login,register,logout}}>{children}</C.Provider>;
}
export const useAuth=()=>useContext(C);