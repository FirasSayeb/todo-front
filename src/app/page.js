"use client"

import Link from 'next/link';
import { useEffect, useState } from 'react';

const App = () => {
    const [theme, setTheme] = useState(''); 

    useEffect(() => {
        
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, []);

    useEffect(() => {
        
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = (e) => {
        setTheme(e.target.value);
    };

    return (

        <div className={theme === 'dark' ? 'theme-dark' : 'theme-light'}>
          <header className='navbar-expand-md'>
            <div className='collapse navbar-collapse'>
              <div className='navbar'> 
                <div className='container-xl'>
                  <div className='row flex-fill align-items-center'>
                    <div className='col'>
                      <ul className='navbar-nav'>
                        
           
            <li className='nav-item'><span className='nav-link'><span className='nav-link-title'>Welcome to the TODO App</span></span></li>
                <li className='nav-item'><Link className='nav-link' href="/auth/login"><span className='nav-link-title'>Login</span></Link></li>
                <li className='nav-item'><Link className='nav-link' href="/auth/signup"><span className='nav-link-title'>Sign Up</span></Link></li>
                <li className='nav-item dropdown'> <select className='nav-link dropdown-toggle' value={theme} onChange={toggleTheme}>
                <option value="light">Light Mode</option>
                <option value="dark">Dark Mode</option>
            </select> </li>
                </ul>
                </div>
                </div>
                </div>
                </div>
            </div>
            </header>
        </div>
    );
};

export default App;
