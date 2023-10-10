import React from 'react'
import {Outlet} from 'react-router-dom'

function AuthLayout() {
    return (
        <main>
            <div>
                <Outlet />
            </div>
        </main>
    )
}

export default AuthLayout