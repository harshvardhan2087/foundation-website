import { notFound } from 'next/navigation'
import { getMenuById, getTeamMembersByMenuId, getChildMenus, TeamMember } from '@/lib/teamService'

// Define the props interface
interface TeamPageProps {
  params: Promise<{ id: string }>
}

// SIMPLE Image component WITHOUT event handlers (for Server Component)
const FirebaseImage = ({ 
  src, 
  alt, 
  width, 
  height, 
  className = '' 
}: { 
  src: string; 
  alt: string; 
  width: number; 
  height: number; 
  className?: string 
}) => {
  if (!src || src === "/placeholder.png" || src === "") {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`} 
        style={{ width, height }}
      >
        <span className="text-gray-500 text-sm">No Image</span>
      </div>
    )
  }
  
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading="lazy"
    />
  )
}

// Generate metadata for the page
export async function generateMetadata({ params }: TeamPageProps) {
  const { id } = await params
  const menu = await getMenuById(id)
  
  return {
    title: menu?.title || 'Team Section',
    description: menu?.description || 'View our team members'
  }
}

// Main team page component
export default async function TeamPage({ params }: TeamPageProps) {
  // Unwrap params
  const { id } = await params
  
  if (!id) {
    notFound()
  }
  
  try {
    // Fetch all data
    const menu = await getMenuById(id)
    
    if (!menu) {
      notFound()
    }
    
    const [teamMembers, childMenus] = await Promise.all([
      getTeamMembersByMenuId(id),
      getChildMenus(id)
    ])

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {menu.title}
            </h1>
            
            {menu.description && (
              <p className="text-lg text-gray-600 max-w-3xl">
                {menu.description}
              </p>
            )}
            
            {menu.image && menu.image !== "/placeholder.png" && menu.image !== "" && (
              <div className="mt-6 max-w-4xl mx-auto">
                <FirebaseImage
                  src={menu.image}
                  alt={menu.title}
                  width={800}
                  height={400}
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Main Content HTML (if provided) */}
          {menu.content && (
            <div className="mb-10">
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: menu.content }}
              />
            </div>
          )}

          {/* Team Members Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {teamMembers.length > 0 ? `Team Members (${teamMembers.length})` : 'No Team Members'}
            </h2>
            
            {teamMembers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamMembers.map((member: TeamMember) => (
                  <div 
                    key={member.id} 
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col items-center text-center">
                      {/* Image Container */}
                      <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-white shadow-md">
                        {member.image ? (
                          <FirebaseImage
                            src={member.image}
                            alt={member.name}
                            width={128}
                            height={128}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <div className="text-center">
                              <div className="text-gray-500 text-2xl mb-1">👤</div>
                              <span className="text-xs text-gray-500">No Image</span>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {member.name}
                      </h3>
                      
                      {/* Designation */}
                      {(member.designation || member.position) && (
                        <p className="text-gray-600 mb-3 font-medium">
                          {member.designation || member.position}
                        </p>
                      )}
                      
                      {/* Location */}
                      {member.location && (
                        <p className="text-gray-500 mb-3 text-sm flex items-center justify-center gap-1">
                          <svg 
                            className="w-4 h-4" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {member.location}
                        </p>
                      )}
                      
                      {/* Bio */}
                      {member.bio && (
                        <p className="text-gray-700 mb-4 text-sm">
                          {member.bio}
                        </p>
                      )}
                      
                      {/* Contact Info */}
                      {(member.email || member.phone) && (
                        <div className="mt-3 space-y-1">
                          {member.email && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Email:</span> {member.email}
                            </p>
                          )}
                          {member.phone && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Phone:</span> {member.phone}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <div className="text-gray-400 text-4xl mb-4">👥</div>
                <p className="text-gray-500">
                  No team members have been added to this section yet.
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Please add team members through the admin dashboard.
                </p>
              </div>
            )}
          </section>

          {/* Sub-sections (Child Menus) */}
          {childMenus.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Related Sections ({childMenus.length})
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {childMenus.map((child: any) => (
                  <a
                    key={child.id}
                    href={`/team/${child.id}`}
                    className="group block bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                      {child.title}
                    </h3>
                    
                    {child.description && (
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {child.description}
                      </p>
                    )}
                    
                    {/* Child menu image */}
                    <div className="w-full h-48 rounded-md overflow-hidden mt-4 bg-gray-100">
                      {child.image && child.image !== "/placeholder.png" && child.image !== "" ? (
                        <FirebaseImage
                          src={child.image}
                          alt={child.title}
                          width={400}
                          height={192}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <div className="text-center">
                            <div className="text-3xl mb-2">🏢</div>
                            <span>No Image</span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 text-blue-600 font-medium flex items-center">
                      View Team
                      <svg 
                        className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    )
  } catch (error: any) {
    console.error('Error loading team page:', error)
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Page</h1>
            
            {/* Specific error message for Firestore index */}
            {error.message?.includes('index') || error.code === 'failed-precondition' ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-4">
                <p className="font-medium text-yellow-800 mb-2">Firestore Index Required</p>
                <p className="text-yellow-700 text-sm">
                  Please create a composite index in Firebase Console:
                  <br />
                  <strong>Collection:</strong> teamMembers
                  <br />
                  <strong>Fields:</strong> menuId (Ascending), order (Ascending)
                </p>
              </div>
            ) : (
              <p className="text-gray-600 mb-4">
                {error.message || 'Unknown error occurred'}
              </p>
            )}
            
            <div className="mt-6 space-y-3">
              <a 
                href="/"
                className="inline-block px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Go to Homepage
              </a>
              <button 
                onClick={() => window.location.reload()}
                className="block w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Retry Loading Page
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}