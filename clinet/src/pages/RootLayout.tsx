import React from 'react'
import {Outlet} from 'react-router-dom'
import Header from '../components/Header'

function RootLayout() {
    return (
        <main>
            <Header />
            <div>
                <Outlet />
            </div>
        </main>
    )
}

export default RootLayout