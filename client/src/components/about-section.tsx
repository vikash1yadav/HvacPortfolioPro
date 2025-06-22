import { useQuery } from "@tanstack/react-query";
import type { CompanyContent } from "@shared/schema";

export default function AboutSection() {
  const { data: aboutContent } = useQuery<CompanyContent>({
    queryKey: ["/api/company-content/about"],
    retry: false,
  });

  return (
    <section id="about" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {aboutContent?.title || "About Arctic Air Solutions"}
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              {aboutContent?.description || "With over 15 years of experience in the HVAC industry, Arctic Air Solutions has built a reputation for exceptional service, reliable installations, and energy-efficient solutions."}
            </p>
            <div className="space-y-4">
              <div className="flex items-center">
                <i className="fas fa-check-circle text-green-600 mr-3"></i>
                <span className="text-gray-700">Licensed and insured professionals</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-check-circle text-green-600 mr-3"></i>
                <span className="text-gray-700">24/7 emergency service available</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-check-circle text-green-600 mr-3"></i>
                <span className="text-gray-700">Energy-efficient solutions</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-check-circle text-green-600 mr-3"></i>
                <span className="text-gray-700">Satisfaction guarantee</span>
              </div>
            </div>
          </div>
          <div>
            <img 
              src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt="Professional HVAC technicians at work"
              className="rounded-lg shadow-lg w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
