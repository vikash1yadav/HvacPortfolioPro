import { useQuery } from "@tanstack/react-query";
import type { Testimonial } from "@shared/schema";

export default function TestimonialsSection() {
  const { data: testimonials, isLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
    retry: false,
  });

  const defaultTestimonials = [
    {
      id: 1,
      customerName: "Emily Rodriguez",
      customerTitle: "Business Owner",
      customerImageUrl: "https://images.unsplash.com/photo-1494790108755-2616b332e234?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100",
      content: "Excellent service from start to finish. The team was professional, efficient, and the new HVAC system works perfectly. Highly recommended!",
      rating: 5
    },
    {
      id: 2,
      customerName: "David Park",
      customerTitle: "Homeowner",
      customerImageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100",
      content: "Arctic Air Solutions saved us thousands with their energy-efficient system. Our utility bills have dropped significantly!",
      rating: 5
    },
    {
      id: 3,
      customerName: "Lisa Johnson",
      customerTitle: "Property Manager",
      customerImageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100",
      content: "Quick response time and professional service. They fixed our emergency heating issue on the same day we called.",
      rating: 5
    }
  ];

  const displayTestimonials = testimonials && testimonials.length > 0 ? testimonials : defaultTestimonials;

  const renderStars = (rating: number) => {
    return (
      <div className="flex text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <i key={i} className={`fas fa-star ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}></i>
        ))}
      </div>
    );
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">What Our Customers Say</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Read testimonials from satisfied customers who trust Arctic Air Solutions.
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-lg shadow-md p-6 animate-pulse border border-border">
                <div className="flex space-x-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div key={star} className="w-4 h-4 bg-muted rounded"></div>
                  ))}
                </div>
                <div className="h-20 bg-muted rounded mb-4"></div>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-muted rounded-full mr-4"></div>
                  <div>
                    <div className="h-4 w-24 bg-muted rounded mb-1"></div>
                    <div className="h-3 w-16 bg-muted rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-card rounded-lg shadow-md p-6 border border-border">
                <div className="flex items-center mb-4">
                  {renderStars(testimonial.rating || 5)}
                </div>
                <blockquote className="text-card-foreground mb-4">"{testimonial.content}"</blockquote>
                <div className="flex items-center">
                  <img 
                    src={testimonial.customerImageUrl || "https://images.unsplash.com/photo-1494790108755-2616b332e234?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100"} 
                    alt={testimonial.customerName}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <p className="font-semibold text-card-foreground">{testimonial.customerName}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.customerTitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
