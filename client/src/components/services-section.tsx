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
    <section id="services" className="py-12 sm:py-16 lg:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">Our HVAC Services</h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Complete heating, ventilation, and air conditioning solutions for all your comfort needs.
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-lg p-4 sm:p-6 animate-pulse">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-muted rounded-full mx-auto mb-4"></div>
                <div className="h-5 sm:h-6 bg-muted rounded mb-3"></div>
                <div className="h-4 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {displayServices.map((service, index) => (
              <div key={service.id} className="bg-card rounded-lg p-4 sm:p-6 hover:shadow-lg transition-shadow border border-border">
                <div className="text-center">
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 ${index === 0 ? 'bg-brand-blue' : index === 1 ? 'bg-brand-orange' : 'bg-green-600'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <i className={`${service.icon || 'fas fa-cog'} text-white text-xl sm:text-2xl`}></i>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-card-foreground mb-2 sm:mb-3">{service.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
