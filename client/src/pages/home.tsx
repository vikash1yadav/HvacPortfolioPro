import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-brand-blue">Arctic Air Solutions</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.firstName || user?.email}</span>
              <Link href="/admin">
                <Button>Admin Dashboard</Button>
              </Link>
              <a href="/api/logout">
                <Button variant="outline">Logout</Button>
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Arctic Air Solutions</h2>
          <p className="text-lg text-gray-600 mb-8">You are now logged in and can access the admin dashboard to manage your HVAC company website.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="w-16 h-16 bg-brand-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-cog text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Manage Content</h3>
              <p className="text-gray-600 mb-4">Update company information, services, and website content through the admin dashboard.</p>
              <Link href="/admin">
                <Button className="w-full">Go to Admin Dashboard</Button>
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="w-16 h-16 bg-brand-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-eye text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">View Public Site</h3>
              <p className="text-gray-600 mb-4">See how your website looks to visitors and customers.</p>
              <a href="/api/logout">
                <Button variant="outline" className="w-full">View Public Site</Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
