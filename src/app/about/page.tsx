import { Car, Shield, Users, Globe, Heart, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            About
            <span className="text-blue-600"> CarRental</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            We're building a community where car sharing is simple, safe, and sustainable. 
            Our mission is to make transportation accessible to everyone while helping car owners earn money.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                At CarRental, we believe that car sharing should be accessible to everyone. 
                We're creating a platform that connects car owners with people who need reliable 
                transportation, building trust and community along the way.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Our goal is to reduce the number of cars on the road while making car ownership 
                more affordable and sustainable for everyone involved.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Users className="h-6 w-6 text-blue-600 mr-2" />
                  <span className="text-gray-700 font-medium">10,000+ Users</span>
                </div>
                <div className="flex items-center">
                  <Car className="h-6 w-6 text-blue-600 mr-2" />
                  <span className="text-gray-700 font-medium">5,000+ Cars</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-blue-100 rounded-2xl p-8">
                <div className="text-center">
                  <Globe className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Global Community
                  </h3>
                  <p className="text-gray-600">
                    Join thousands of users worldwide who trust CarRental for their transportation needs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              These core values guide everything we do at CarRental.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Trust & Safety</h3>
              <p className="text-gray-600">
                We prioritize the safety and security of our community above all else. 
                Every user and vehicle is verified and insured.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community First</h3>
              <p className="text-gray-600">
                We believe in building strong relationships and fostering a supportive 
                community of car enthusiasts and travelers.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Excellence</h3>
              <p className="text-gray-600">
                We're committed to providing the best possible experience for our users 
                through continuous improvement and innovation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Story
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              CarRental was founded in 2024 with a simple idea: what if we could make 
              car sharing as easy as booking a hotel room?
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">The Beginning</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Our founders noticed that many people had cars sitting idle while others 
                struggled to find affordable transportation. They saw an opportunity to 
                create a platform that would benefit both groups.
              </p>
              <p className="text-gray-600 leading-relaxed">
                What started as a small project has grown into a thriving community of 
                car owners and renters who share our vision of accessible transportation.
              </p>
            </div>
            
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Looking Forward</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Today, we're expanding to new cities and developing new features to make 
                car sharing even more convenient and secure.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We're excited about the future of transportation and committed to making 
                CarRental the go-to platform for car sharing worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Get in Touch
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Have questions about CarRental? We'd love to hear from you and help you 
            get started with car sharing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
              Contact Us
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
              Join Our Team
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
