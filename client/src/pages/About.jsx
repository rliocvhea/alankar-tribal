import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-br from-primary to-amber-700 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=1600&h=600&fit=crop" 
            alt="Tribal Art"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">About Alankara Tribal</h1>
            <p className="text-xl md:text-2xl text-amber-100">
              Preserving Ancient Traditions, Empowering Artisan Communities
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">Our Story</h2>
          <div className="prose prose-lg text-gray-600 space-y-6">
            <p>
              Alankara Tribal was founded with a singular vision: to preserve and promote the ancient art of 
              Dhokra metalwork while providing sustainable livelihoods to tribal artisan communities across India.
            </p>
            <p>
              For over 4,000 years, tribal communities have practiced the Dhokra art form, creating intricate 
              pieces using the lost-wax casting technique. Each piece is handcrafted with dedication, skill, 
              and an artistic heritage passed down through generations.
            </p>
            <p>
              We work directly with over 500 artisans from various tribal communities, ensuring fair compensation 
              and preserving their cultural legacy. Every purchase you make directly supports these artisans and 
              helps keep this ancient craft alive for future generations.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-900">Our Mission & Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="text-5xl mb-4">🎨</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Authentic Craft</h3>
              <p className="text-gray-600">
                We are committed to preserving the authenticity of Dhokra art. Every piece is 100% handmade 
                using traditional techniques, ensuring genuine cultural heritage in each creation.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Fair Trade</h3>
              <p className="text-gray-600">
                We believe in ethical business practices. Our artisans receive fair compensation for their 
                work, and we maintain transparent relationships built on mutual respect and trust.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="text-5xl mb-4">🌿</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Sustainability</h3>
              <p className="text-gray-600">
                Traditional Dhokra techniques are inherently eco-friendly. We promote sustainable practices 
                that honor the earth while creating timeless pieces of art.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Dhokra Process */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-900">The Dhokra Process</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=600&h=600&fit=crop" 
                alt="Dhokra Craftsmanship"
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">Clay Core Creation</h3>
                  <p className="text-gray-600">
                    The artisan creates a clay core in the desired shape, forming the foundation of the piece.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">Wax Coating</h3>
                  <p className="text-gray-600">
                    The core is coated with beeswax, where intricate designs and patterns are carved by hand.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">Clay Coating</h3>
                  <p className="text-gray-600">
                    Another layer of clay is applied over the wax, creating a mold for the final casting.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">Metal Casting</h3>
                  <p className="text-gray-600">
                    Molten metal is poured into the mold, melting the wax and creating the final bronze piece.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                  5
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">Finishing</h3>
                  <p className="text-gray-600">
                    The outer clay is removed, and the piece is polished and finished, revealing unique artwork.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-12 text-center">Our Impact</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">500+</div>
              <p className="text-amber-100">Artisans Supported</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">50+</div>
              <p className="text-amber-100">Tribal Villages</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">10,000+</div>
              <p className="text-amber-100">Happy Customers</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">4,000</div>
              <p className="text-amber-100">Years of Tradition</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">Join Our Journey</h2>
          <p className="text-xl text-gray-600 mb-8">
            Every purchase supports artisan communities and helps preserve ancient cultural heritage. 
            Discover our collection and become part of this meaningful story.
          </p>
          <Link 
            to="/products" 
            className="inline-block bg-primary hover:bg-[#5D4037] text-white font-bold py-4 px-10 rounded-lg text-lg transition duration-300"
          >
            Explore Our Collection
          </Link>
        </div>
      </section>
    </div>
  );
}
