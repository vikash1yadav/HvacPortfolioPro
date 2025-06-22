import { useQuery } from "@tanstack/react-query";
import type { Service } from "@shared/schema";

export default function ServicesSection() {
  const { data: services, isLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
    retry: false,
  });

  const defaultServices = [
    {
      id: 1,
      title: "Air Conditioning",
      description: "Professional AC installation, repair, and maintenance services for optimal cooling performance.",
      icon: "fas fa-snowflake"
    },
    {
      id: 2,
      title: "Heating Systems", 
      description: "Expert heating system installation and repair to keep your space warm and comfortable.",
      icon: "fas fa-fire"
    },
    {
      id: 3,
      title: "Ventilation",
      description: "Indoor air quality solutions and ventilation systems for healthy breathing environments.",
      icon: "fas fa-wind"
    }
  ];

  const displayServices = services && services.length > 0 ? services : defaultServices;

  return (
    <section id="services" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our HVAC Services</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Complete heating, ventilation, and air conditioning solutions for all your comfort needs.
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-6 animate-pulse">
                <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <div className="h-6 bg-gray-300 rounded mb-3"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayServices.map((service, index) => (
              <div key={service.id} className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="text-center">
                  <div className={`w-16 h-16 ${index === 0 ? 'bg-brand-blue' : index === 1 ? 'bg-brand-orange' : 'bg-green-600'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <i className={`${service.icon || 'fas fa-cog'} text-white text-2xl`}></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
