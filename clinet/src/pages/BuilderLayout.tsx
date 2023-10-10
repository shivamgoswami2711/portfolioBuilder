import React from 'react'
import {Outlet} from 'react-router-dom'

function BuilderLayout() {
    return (
        <main>
            <div>
                <Outlet />
            </div>
        </main>
    )
}

export default BuilderLayout