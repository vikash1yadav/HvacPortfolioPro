import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import type { CompanyContent } from "@shared/schema";

export default function HeroSection() {
  const { data: heroContent } = useQuery<CompanyContent>({
    queryKey: ["/api/company-content/hero"],
    retry: false,
  });

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToPortfolio = () => {
    const element = document.getElementById('portfolio');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="home" 
      className="relative bg-gradient-to-r from-brand-blue to-blue-700 text-white"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {heroContent?.title || "Professional HVAC Solutions"}
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            {heroContent?.description || "Expert heating, ventilation, and air conditioning services for residential and commercial properties. Energy-efficient solutions you can trust."}
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button 
              onClick={scrollToContact}
              className="bg-brand-orange hover:bg-yellow-600 text-white font-semibold py-3 px-8"
            >
              Get Free Estimate
            </Button>
            <Button 
              onClick={scrollToPortfolio}
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-brand-blue font-semibold py-3 px-8"
            >
              View Our Work
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
