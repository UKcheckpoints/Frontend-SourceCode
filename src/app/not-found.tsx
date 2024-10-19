import Link from 'next/link'
import { ArrowLeft, MapPin } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-sky-100 to-sky-200 p-4">
            <div className="text-center">
                <div className="mb-8">
                    <MapPin className="mx-auto h-20 w-20 text-sky-600" />
                </div>
                <h1 className="text-4xl font-bold text-sky-800 mb-4">404 - Page Not Found</h1>
                <p className="text-xl text-sky-600 mb-8">
                    Oops! It seems you&apos;ve taken a wrong turn on your route.
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors duration-200"
                >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Back to Dashboard
                </Link>
            </div>
            <div className="mt-12 text-sky-600 text-sm">
                <p>UKcheckpoints - Commercial Vehicle Checkpoint Management and Route Planning App</p>
            </div>
        </div>
    )
}