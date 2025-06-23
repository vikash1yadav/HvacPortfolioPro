import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-background shadow-lg border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-brand-blue">Arctic Air Solutions</h1>
            </div>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <button
                  onClick={() => scrollToSection('home')}
                  className="text-brand-gray hover:text-brand-blue px-3 py-2 text-sm font-medium transition-colors"
                >
                  Home
                </button>
                <button
                  onClick={() => scrollToSection('portfolio')}
                  className="text-brand-gray hover:text-brand-blue px-3 py-2 text-sm font-medium transition-colors"
                >
                  Portfolio
                </button>
                <button
                  onClick={() => scrollToSection('services')}
                  className="text-brand-gray hover:text-brand-blue px-3 py-2 text-sm font-medium transition-colors"
                >
                  Services
                </button>
                <button
                  onClick={() => scrollToSection('about')}
                  className="text-brand-gray hover:text-brand-blue px-3 py-2 text-sm font-medium transition-colors"
                >
                  About
                </button>
                <button
                  onClick={() => scrollToSection('blog')}
                  className="text-brand-gray hover:text-brand-blue px-3 py-2 text-sm font-medium transition-colors"
                >
                  Blog
                </button>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="text-brand-gray hover:text-brand-blue px-3 py-2 text-sm font-medium transition-colors"
                >
                  Contact
                </button>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <ThemeToggle />
            <a href="/admin/login">
              <Button className="bg-brand-blue hover:bg-blue-700">
                Admin Login
              </Button>
            </a>
          </div>
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-brand-gray hover:text-brand-blue p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <i className="fas fa-times text-xl"></i>
              ) : (
                <i className="fas fa-bars text-xl"></i>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-border shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button
              onClick={() => scrollToSection('home')}
              className="text-brand-gray hover:text-brand-blue hover:bg-accent block px-3 py-3 text-base font-medium w-full text-left rounded-md transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('portfolio')}
              className="text-brand-gray hover:text-brand-blue hover:bg-accent block px-3 py-3 text-base font-medium w-full text-left rounded-md transition-colors"
            >
              Portfolio
            </button>
            <button
              onClick={() => scrollToSection('services')}
              className="text-brand-gray hover:text-brand-blue hover:bg-accent block px-3 py-3 text-base font-medium w-full text-left rounded-md transition-colors"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-brand-gray hover:text-brand-blue hover:bg-accent block px-3 py-3 text-base font-medium w-full text-left rounded-md transition-colors"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('blog')}
              className="text-brand-gray hover:text-brand-blue hover:bg-accent block px-3 py-3 text-base font-medium w-full text-left rounded-md transition-colors"
            >
              Blog
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-brand-gray hover:text-brand-blue hover:bg-accent block px-3 py-3 text-base font-medium w-full text-left rounded-md transition-colors"
            >
              Contact
            </button>
            <div className="pt-3 border-t border-border mt-3">
              <a href="/admin/login" className="block">
                <Button className="w-full bg-brand-blue hover:bg-blue-700 text-white font-medium py-3">
                  Admin Login
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
