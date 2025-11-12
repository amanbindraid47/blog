// App-level CSS removed (using Tailwind CDN + public/custom.css for global styles)
import { Route, Routes } from "react-router-dom";
import Header from './componets/Header';
import React, { useEffect } from 'react';
import Login from './componets/Login';
import Blogs from './componets/Blogs';
import UserBlogs from './componets/UserBlogs'
import AddBlogs from './componets/AddBlogs'
import BlogDetail from './componets/BlogDetail'
import BlogView from './componets/BlogView'
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from './store';



function App() {
  const dispatch = useDispatch();

  useEffect(()=>{
    const userId = localStorage.getItem("userId");
    if(userId){
      dispatch(authActions.login());
    }
  },[dispatch]);

  // Apply 'dark' class to the <html> element so Tailwind dark: variants and custom CSS take effect
  const isDark = useSelector((state) => state.theme.isDarkmode);
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);
  
  return <React.Fragment>
    <header>
      <Header/>
    </header>
    <main>
    <Routes>
      <Route path="/login" element={<Login/>}></Route>
      <Route path="/blogs" element={<Blogs/>}></Route>
      <Route path="/blogs/:id" element={<BlogView/>}></Route>
      <Route path="/myBlogs" element={<UserBlogs/>}></Route>
      <Route path="/myBlogs/:id" element={<BlogDetail/>}></Route>
      <Route path="/blogs/add" element={<AddBlogs />} />
    </Routes>
    </main>

  </React.Fragment>;
}

export default App;
