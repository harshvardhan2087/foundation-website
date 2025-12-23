import Link from 'next/link'
import { getAllMainMenus } from '@/lib/teamService'

export default async function TeamPage() {
  const mainMenus = await getAllMainMenus()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Meet Our Team
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Dedicated professionals working together to make a difference
          </p>
        </div>
      </div>

      {/* Team Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {mainMenus.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mainMenus.map((menu) => (
              <Link
                key={menu.id}
                href={`/team/${menu.id}`}
                className="group bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {menu.image && (
                  <div className="h-64 overflow-hidden">
                    <img
                      src={menu.image}
                      alt={menu.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600">
                    {menu.title}
                  </h2>
                  {menu.description && (
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {menu.description}
                    </p>
                  )}
                  <div className="flex items-center text-blue-600 font-medium">
                    View Team
                    <svg 
                      className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No team categories available yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}