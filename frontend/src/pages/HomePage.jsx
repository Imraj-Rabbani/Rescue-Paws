import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div>
      <Navbar/>
      <header
        className="relative bg-cover bg-center h-[80vh] flex items-center justify-center text-white text-center"
        style={{ backgroundImage: "url('/puppy-banner.jpg')" }}
      >
        <div className="bg-black bg-opacity-50 p-6 rounded">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">Help Animals in Need</h1>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Join our STRAY PAWS community of volunteers and donors working together to rescue and care for animals in need. Your contribution, whether time or resources, makes a real difference.
          </p>
          <button className="bg-white text-black px-6 py-2 rounded-md hover:bg-gray-200">Get Started</button>
        </div>
      </header>

      <section className="py-20 px-6 text-center bg-white">
        <h2 className="text-sm font-semibold text-gray-500 tracking-widest mb-2">FEATURES</h2>
        <h3 className="text-3xl font-bold mb-6">Everything you need to make a difference</h3>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12">
          STRAY PAWS gives you a complete ecosystem to rescue, support, and track progress for animals in need. Whether you're donating, fostering, or leading rescue teams—we make it seamless.
        </p>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto text-left">
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h4 className="text-xl font-semibold mb-2">🐾 Animal Rescue</h4>
            <p className="text-gray-600">
              Connect with our nationwide rescue network. View rescue missions, join efforts, and report stray sightings directly.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h4 className="text-xl font-semibold mb-2">🤝 Team Collaboration</h4>
            <p className="text-gray-600">
              Coordinate locally with other volunteers. Chat, assign roles, and manage tasks—all within our integrated system.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h4 className="text-xl font-semibold mb-2">🛒 Supply Marketplace</h4>
            <p className="text-gray-600">
              Use donation credits to purchase food, medical kits, and shelter supplies. Everything you need in one place.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h4 className="text-xl font-semibold mb-2">📊 Real-Time Analytics</h4>
            <p className="text-gray-600">
              Get insights into rescue impact, volunteer stats, and donation distribution with beautiful dashboards.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h4 className="text-xl font-semibold mb-2">📍 Geo Tracking</h4>
            <p className="text-gray-600">
              Locate animals in distress using our GPS-enabled report system. Help is always close.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h4 className="text-xl font-semibold mb-2">❤️ Donor Transparency</h4>
            <p className="text-gray-600">
              See exactly where your money goes—from food to medical bills—with full transaction history.
            </p>
          </div>
        </div>
      </section>

      {/* CTA SECTION (Same layout, new style) */}
      <section className="bg-gray-100 py-16 text-center">
        <h3 className="text-2xl font-extrabold mb-4">Ready to make a difference?<br />Join STRAY PAWS today.</h3>
        <div className="flex justify-center gap-4">
          <button className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800">Join</button>
          <button className="bg-white border border-gray-400 px-6 py-2 rounded-md hover:bg-gray-200">Learn more</button>
        </div>
      </section>
      <Footer/>
    </div>
    
  )
}

export default Home