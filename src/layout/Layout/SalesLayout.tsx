import { SalesNavbar } from '@/components/Navbar'
import { Outlet } from 'react-router-dom'

export default function SalesLayout() {
    return (
        <div className="min-h-screen bg-background">
            <SalesNavbar />
            <main className="py-6 max-w-7xl mx-auto">
                <Outlet />
            </main>
        </div>
    )
}
