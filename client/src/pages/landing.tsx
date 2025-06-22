import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import ServicesSection from "@/components/services-section";
import PortfolioSection from "@/components/portfolio-section";
import AboutSection from "@/components/about-section";
import TeamSection from "@/components/team-section";
import BlogSection from "@/components/blog-section";
import TestimonialsSection from "@/components/testimonials-section";
import ContactSection from "@/components/contact-section";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main>
        <HeroSection />
        <ServicesSection />
        <PortfolioSection />
        <AboutSection />
        <TeamSection />
        <BlogSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      
      {/* Footer */}
      <footer className="bg-brand-gray text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Arctic Air Solutions</h3>
              <p className="text-gray-300 mb-4">Professional HVAC services for residential and commercial properties. Your comfort is our priority.</p>
              <div className="flex space-x-4">
                <button className="text-gray-300 hover:text-white transition-colors">
                  <i className="fab fa-facebook-f"></i>
                </button>
                <button className="text-gray-300 hover:text-white transition-colors">
                  <i className="fab fa-twitter"></i>
                </button>
                <button className="text-gray-300 hover:text-white transition-colors">
                  <i className="fab fa-linkedin-in"></i>
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">AC Installation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Heating Repair</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Ventilation Systems</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Energy Audits</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#portfolio" className="hover:text-white transition-colors">Portfolio</a></li>
                <li><a href="#blog" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <div className="space-y-2 text-gray-300">
                <p><i className="fas fa-phone mr-2"></i>(555) 123-4567</p>
                <p><i className="fas fa-envelope mr-2"></i>info@arcticsolutions.com</p>
                <p><i className="fas fa-map-marker-alt mr-2"></i>123 Industrial Blvd<br />Tech City, TC 12345</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-600 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 Arctic Air Solutions. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
