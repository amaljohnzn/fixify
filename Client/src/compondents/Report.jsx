import React from 'react'

export default function Report() {
  return (
    <div>
      
    {/* Hero Section */}
    <section className="relative h-[500px] overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
        alt="Hero"
        className="w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-6">Welcome to Service Management</h1>
          <p className="text-xl mb-8">Add, update, or remove services from your platform</p>
        </div>
      </div>
    </section>
    </div>
  )
}
