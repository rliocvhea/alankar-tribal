import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=1600&h=900&fit=crop',
      title: 'Authentic Dhokra Art',
      subtitle: 'Handcrafted Tribal Masterpieces',
      cta: 'Explore Frames',
      link: '/products?category=Dhokra frame'
    },
    {
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1600&h=900&fit=crop',
      title: 'Traditional Tribal Jewellery',
      subtitle: 'Timeless Elegance in Every Piece',
      cta: 'Browse Collection',
      link: '/products?category=Jewellery'
    },
    {
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1600&h=900&fit=crop',
      title: 'Heritage Craftsmanship',
      subtitle: 'Preserving Ancient Traditions',
      cta: 'Shop Now',
      link: '/products'
    }
  ];

  useEffect(() => {
    if (user?.role === 'admin') {
      navigate('/admin');
    }
  }, [user, navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div>
      {/* Hero Carousel Section */}
      <section className="relative h-[600px] md:h-[700px] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0 bg-black/40 z-10"></div>
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <div className="text-center text-white px-4">
                <h1 className="text-4xl md:text-7xl font-bold mb-4 animate-fade-in">
                  {slide.title}
                </h1>
                <p className="text-xl md:text-3xl mb-8 text-amber-100 font-light">
                  {slide.subtitle}
                </p>
                <Link
                  to={slide.link}
                  className="bg-primary hover:bg-[#5D4037] text-white font-bold py-4 px-10 rounded-lg text-lg transition duration-300 inline-block shadow-2xl"
                >
                  {slide.cta}
                </Link>
              </div>
            </div>
          </div>
        ))}
        
        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() => goToSlide((currentSlide - 1 + slides.length) % slides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full backdrop-blur-sm transition duration-300"
          aria-label="Previous slide"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => goToSlide((currentSlide + 1) % slides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full backdrop-blur-sm transition duration-300"
          aria-label="Next slide"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </section>

      {/* Brand Story Section with Video/Image */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                Ancient Art, Timeless Beauty
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Dhokra is an ancient Indian art form dating back 4,000 years. Each piece is handcrafted 
                using the lost-wax casting technique, making every creation unique and irreplaceable.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our artisans from tribal communities preserve this heritage, transforming molten metal 
                into stunning frames and jewellery that tell stories of tradition and culture.
              </p>
              <Link 
                to="/products" 
                className="inline-flex items-center bg-primary hover:bg-[#5D4037] text-white font-semibold py-3 px-8 rounded-lg transition duration-300"
              >
                Discover Our Collection
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
            <div className="order-1 md:order-2">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&h=600&fit=crop" 
                  alt="Dhokra Craftsmanship"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-20 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-4">Featured Collections</h2>
          <p className="text-center text-gray-600 mb-12 text-lg">Handpicked by our curators</p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Link to="/products?category=Dhokra frame" className="group relative overflow-hidden rounded-2xl shadow-xl h-96">
              <img 
                src="https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=800&h=800&fit=crop"
                alt="Dhokra Frames"
                className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h3 className="text-3xl font-bold mb-2">Dhokra Frames</h3>
                <p className="text-amber-100 mb-4">Artistic wall decor that speaks volumes</p>
                <span className="inline-flex items-center text-white font-semibold">
                  Explore Collection
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>
            </Link>

            <Link to="/products?category=Jewellery" className="group relative overflow-hidden rounded-2xl shadow-xl h-96">
              <img 
                src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop"
                alt="Tribal Jewellery"
                className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h3 className="text-3xl font-bold mb-2">Tribal Jewellery</h3>
                <p className="text-amber-100 mb-4">Adorn yourself with tradition</p>
                <span className="inline-flex items-center text-white font-semibold">
                  Explore Collection
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-4">Why Alankara Tribal?</h2>
          <p className="text-center text-gray-600 mb-12 text-lg">Experience the difference</p>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center p-6 group hover:transform hover:scale-105 transition duration-300">
              <div className="text-6xl mb-4 group-hover:scale-110 transition duration-300">🎨</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Authentic Craft</h3>
              <p className="text-gray-600">100% handmade by tribal artisans</p>
            </div>
            <div className="text-center p-6 group hover:transform hover:scale-105 transition duration-300">
              <div className="text-6xl mb-4 group-hover:scale-110 transition duration-300">🌿</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Sustainable</h3>
              <p className="text-gray-600">Eco-friendly traditional methods</p>
            </div>
            <div className="text-center p-6 group hover:transform hover:scale-105 transition duration-300">
              <div className="text-6xl mb-4 group-hover:scale-110 transition duration-300">✨</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Unique Pieces</h3>
              <p className="text-gray-600">No two items are exactly alike</p>
            </div>
            <div className="text-center p-6 group hover:transform hover:scale-105 transition duration-300">
              <div className="text-6xl mb-4 group-hover:scale-110 transition duration-300">💼</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Bulk Pricing</h3>
              <p className="text-gray-600">Wholesale rates available</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials or Heritage Section */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">
            Preserving Heritage, Creating Futures
          </h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Every purchase directly supports tribal artisan communities, helping preserve 
            ancient craftsmanship while providing sustainable livelihoods. Our commitment 
            goes beyond commerce – it's about cultural conservation and empowerment.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <p className="text-gray-600">Artisans Supported</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-4xl font-bold text-primary mb-2">4000+</div>
              <p className="text-gray-600">Years of Tradition</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-4xl font-bold text-primary mb-2">10K+</div>
              <p className="text-gray-600">Happy Customers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section - Removed, replaced with Featured Collections */}

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1600&h=600&fit=crop" 
            alt="Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/90"></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Begin Your Journey with Tribal Art</h2>
          <p className="text-xl mb-10 text-amber-100">
            Join our community of art lovers and cultural enthusiasts. Discover pieces that connect you to ancient traditions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/products" 
              className="bg-white text-primary hover:bg-amber-50 font-bold py-4 px-10 rounded-lg text-lg transition duration-300 inline-block shadow-xl"
            >
              Shop Collection
            </Link>
            <Link 
              to="/register" 
              className="bg-transparent border-2 border-white hover:bg-white hover:text-primary text-white font-bold py-4 px-10 rounded-lg text-lg transition duration-300 inline-block"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
