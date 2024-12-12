"use client"
import React from 'react'
import ForgotPassword from '../../components/auth/forgotpassword'
import { Suspense } from 'react'

const Page = () => {
    return (
        <Suspense>
            <ForgotPassword />
        </Suspense>
    )
}

export default Page