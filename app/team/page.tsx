"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Users, MapPin, Briefcase, Mail, Phone, Star } from "lucide-react"
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, Key } from "react"

export default function Team() {
  const nationalTeam = [
    {
      name: "Sonu Giri",
      designation: "President",
      location: "National Head",
      image: "/images/sonu-giri.jpeg",
    },
    {
      name: "Poonam Giri",
      designation: "Vice President",
      location: "National Head",
      image: "/images/poonam-giri.jpeg",
    },
    {
      name: "Sachin Giri",
      designation: "Secretary",
      location: "National Head",
      image: "/images/sachin-giri.jpeg",
    },
    {
      name: "Parvinder Giri",
      designation: "Vice Secretary",
      location: "National Head",
      image: "/images/parvinder-giri.jpeg",
    },
    {
      name: "Radhika Giri",
      designation: "Manager",
      location: "National Head",
      image: "/images/radhika-giri.jpeg",
    },
  ]

  const stateTeam = [
    {
      level: "Tier 2 States",
      description: "Major operational states with established programs",
      states: [
        {
          image: "/images/rajesh-narwal.jpeg",
          coordinator: "Rajesh Narwal",
        },
        {
          image: "/images/nitish-chunkar.jpeg",
          coordinator: "Nitish Chunkar",
        },
        {
          image: "/images/suresh-kapoor.jpeg",
          coordinator: "Suresh Kapoor",
        },
        {

          image: "/images/yogi-sharma.jpeg",
          coordinator: "Yogi Sharma",
        },
        {

          image: "/images/lata.jpeg",
          coordinator: "lata",
        },
        {

          image: "/images/harshit-giri.jpeg",
          coordinator: "Harshit Giri",
        },{

          image: "/images/pooja.jpeg",
          coordinator: "Pooja",
        },
        {

          image: "/images/member1.jpeg",
        },
        {

          image: "/images/member2.jpeg",
        },
      ]
    },

    
   
  ]
  
  const districtTeams = {
    "Gautam Budh Nagar": [
      {
        name: "Yogi Sharma",
        designation: "President",
        location: "Gautam Budh Nagar",
      }
    ],
    "Jewar": [
      {
        name: "Sameer Khan",
        designation: "Member",
        location: "Jewar",
      },
      {
        name: "Nitish Chunkar",
        designation: "Member",
        location: "Jewar",
      }
    ],
    "Aligarh": [
      {
        name: "Babu Giri",
        designation: "President Aligarh",
        location: "Aligarh",
      },
      {
        name: "Rithik Giri",
        designation: "Member",
        location: "Aligarh",
      },
      {
        name: "Prabha Pachori",
        designation: "Member",
        location: "Aligarh",
      },
      {
        name: "Udayvir Singh",
        designation: "Member",
        location: "Aligarh",
      },
      {
        name: "Renu Giri",
        designation: "Member",
        location: "Aligarh",
      }
    ],
    "Other Districts": [
      {
        name: "Team Agra",
        designation: "Coming Soon",
        location: "Agra",
      },
      {
        name: "Team Mathura",
        designation: "Coming Soon",
        location: "Mathura",
      },
      {
        name: "Team Firozabad",
        designation: "Coming Soon",
        location: "Firozabad",
      },
    ]
  }
  

  const districtTeam = [
    {
      level: "Tier 2 Districts",
      description: "Major operational districts with active programs",
      districts: ["Aligarh", "Agra", "Mathura", "Firozabad", "Gautam Budh Nagar"],
    },
    {
      level: "Tier 3 Districts",
      description: "Developing districts with expanding outreach",
      districts: ["Meerut", "Hapur", "Ghaziabad", "Noida", "Bulandshahr", "Bijnor", "Muzaffarnagar"],
    },
  ]

  const TeamCard = ({ member }:any) => (
    <div className="group relative overflow-hidden border border-gray-300 bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="relative h-72 overflow-hidden bg-gray-100">
        <img
          src={member.image || "/placeholder.svg"}
          alt={member.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-gray-700">
            <Briefcase size={18} className="text-gray-600" />
            <span className="font-medium">{member.designation}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <MapPin size={18} className="text-gray-600" />
            <span>{member.location}</span>
          </div>
          {member.contact && (
            <div className="flex items-center gap-3 text-gray-700">
              <Mail size={18} className="text-gray-600" />
              <a href={`mailto:${member.contact}`} className="text-gray-900 hover:text-black font-medium text-sm">
                {member.contact}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const StateCard = ({ state }:any) => (
    <div className="group relative overflow-hidden border border-gray-300 bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={state.image || "/placeholder.svg"}
          alt={state.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <h3 className="text-2xl font-bold text-white">{state.name}</h3>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">State Coordinator</p>
              <p className="font-semibold text-gray-900">{state.coordinator}</p>
            </div>
           
          </div>
          <div className="pt-4 border-t border-gray-200">
           
          </div>
        </div>
      </div>
    </div>
  )

  const DistrictCard = ({ district, members }:any) => (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="bg-gray-900 text-white p-6">
        <h3 className="text-xl font-bold mb-2">{district}</h3>
        <div className="flex items-center gap-2">
          <Users size={18} />
          <span className="text-sm text-gray-300">{members.length} Member{members.length !== 1 ? 's' : ''}</span>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {members.map((member: { image: any; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; designation: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined }, idx: Key | null | undefined) => (
            <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                <img
                  src={member.image || "/placeholder.svg"}
                  alt="IMAGE NOT FOUND"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{member.name}</h4>
                <p className="text-sm text-gray-600">{member.designation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-gray-50 to-white py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight">
                Our <span className="text-black">Leadership</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Meet the dedicated professionals driving our mission of social impact and community development across India.
              </p>
              <div className="pt-8">
                <div className="inline-flex items-center gap-4 text-gray-700">
                  <div className="flex items-center gap-2">
                    <Users className="text-gray-600" />
                    <span>50+ Core Team Members</span>
                  </div>
                  <div className="h-4 w-px bg-gray-300"></div>
                  <div className="flex items-center gap-2">
                    <MapPin className="text-gray-600" />
                    <span>25+ States & Union Territories</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* National Leadership */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">National Leadership</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our core leadership team guiding the foundation's strategic vision and national operations.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
              {nationalTeam.map((member, index) => (
                <div 
                  key={index} 
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <TeamCard member={member} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* State Teams with Images */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">State Operations</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our state-level teams implementing programs and initiatives at the regional level.
              </p>
            </div>
            
            {stateTeam.map((tier, tierIndex) => (
              <div key={tierIndex} className="mb-20 last:mb-0">
                <div className="mb-10">
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">{tier.level}</h3>
                  <p className="text-gray-600">{tier.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {tier.states.map((state, stateIndex) => (
                    <StateCard key={stateIndex} state={state} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* District Teams */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 mb-4">
                <Users className="text-gray-700" size={32} />
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">District Teams</h2>
              </div>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our ground-level teams ensuring effective implementation in local communities
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {Object.entries(districtTeams).map(([district, members], index) => (
                <div key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                  <DistrictCard district={district} members={members} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Organizational Structure */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Structure</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                A well-organized hierarchy ensuring efficient operations at every level
              </p>
            </div>
            
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-300 hidden lg:block"></div>
              
              {/* Structure Levels */}
              <div className="space-y-12">
                {/* Level 1 - National */}
                <div className="relative flex flex-col lg:flex-row items-center justify-center gap-8">
                  <div className="lg:w-1/2 lg:text-right lg:pr-12">
                    <div className="inline-block bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">National Leadership</h3>
                      <p className="text-gray-600">5 Core Members</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {nationalTeam.slice(0, 3).map((member, idx) => (
                          <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                            {member.name.split(' ')[0]}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center z-10">
                    <Star className="text-white" size={24} />
                  </div>
                  <div className="lg:w-1/2 lg:pl-12">
                    <div className="h-12"></div>
                  </div>
                </div>

                {/* Level 2 - State */}
                <div className="relative flex flex-col lg:flex-row items-center justify-center gap-8">
                  <div className="lg:w-1/2 lg:text-right lg:pr-12">
                    <div className="h-12"></div>
                  </div>
                  <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center z-10">
                    <MapPin className="text-white" size={24} />
                  </div>
                  <div className="lg:w-1/2 lg:pl-12">
                    <div className="inline-block bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">State Team - Delhi</h3>
                      <p className="text-gray-600">18 Active Members</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          Rajesh Narwal
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          Varsha Mudgal
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          +16 more
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Level 3 - District */}
                <div className="relative flex flex-col lg:flex-row items-center justify-center gap-8">
                  <div className="lg:w-1/2 lg:text-right lg:pr-12">
                    <div className="inline-block bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">District Teams</h3>
                      <p className="text-gray-600">Multiple Districts</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          Gautam Budh Nagar
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          Aligarh
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          Jewar
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center z-10">
                    <Users className="text-white" size={24} />
                  </div>
                  <div className="lg:w-1/2 lg:pl-12">
                    <div className="h-12"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-black text-white rounded-2xl p-12 text-center">
              <h2 className="text-4xl font-bold mb-6">Join Our Mission</h2>
              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                We're looking for passionate individuals to join our team and help create lasting change in communities across India.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <a
                  href="mailto:careers@aapkasahyog.org"
                  className="px-8 py-4 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 inline-flex items-center gap-3"
                >
                  <Mail size={20} />
                  Contact Us
                </a>
                <a
                  href="/contact"
                  className="px-8 py-4 border-2 border-white rounded-lg font-semibold hover:bg-white/10 transition-all duration-300 inline-flex items-center gap-3"
                >
                  <Phone size={20} />
                  Schedule a Call
                </a>
              </div>
              <p className="text-sm text-gray-400 mt-8">
                Email: careers@aapkasahyog.org | Phone: +91-XXXXXXXXXX
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}