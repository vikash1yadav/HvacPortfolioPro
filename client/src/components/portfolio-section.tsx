import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { PortfolioProject } from "@shared/schema";

export default function PortfolioSection() {
  const [activeCategory, setActiveCategory] = useState("all");

  const { data: projects, isLoading } = useQuery<PortfolioProject[]>({
    queryKey: ["/api/portfolio", activeCategory],
    retry: false,
  });

  const defaultProjects = [
    {
      id: 1,
      title: "Downtown Office Complex",
      description: "Complete HVAC system installation for a 20-story office building with advanced climate control.",
      category: "commercial",
      imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
    },
    {
      id: 2,
      title: "Luxury Home HVAC",
      description: "Custom zoned heating and cooling system for a 5,000 sq ft luxury residence.",
      category: "residential",
      imageUrl: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
    },
    {
      id: 3,
      title: "Green Energy Integration",
      description: "Energy-efficient HVAC system with solar integration reducing energy costs by 40%.",
      category: "energy",
      imageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
    }
  ];

  const displayProjects = projects && projects.length > 0 ? projects : defaultProjects;
  const filteredProjects = activeCategory === "all" 
    ? displayProjects 
    : displayProjects.filter(project => project.category === activeCategory);

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case "commercial":
        return "bg-blue-100 text-brand-blue";
      case "residential":
        return "bg-green-100 text-green-700";
      case "energy":
        return "bg-yellow-100 text-brand-orange";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <section id="portfolio" className="py-12 sm:py-16 lg:py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">Our Portfolio</h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Showcasing our expertise in residential and commercial HVAC solutions.
          </p>
        </div>
        
        {/* Portfolio Filter Tabs */}
        <div className="flex justify-center mb-6 sm:mb-8 overflow-x-auto">
          <div className="bg-card rounded-lg p-1 shadow-md flex min-w-max border border-border">
            <Button
              variant={activeCategory === "all" ? "default" : "ghost"}
              onClick={() => setActiveCategory("all")}
              className="px-3 sm:px-6 py-2 text-xs sm:text-sm font-medium"
            >
              All Projects
            </Button>
            <Button
              variant={activeCategory === "residential" ? "default" : "ghost"}
              onClick={() => setActiveCategory("residential")}
              className="px-3 sm:px-6 py-2 text-xs sm:text-sm font-medium"
            >
              Residential
            </Button>
            <Button
              variant={activeCategory === "commercial" ? "default" : "ghost"}
              onClick={() => setActiveCategory("commercial")}
              className="px-3 sm:px-6 py-2 text-xs sm:text-sm font-medium"
            >
              Commercial
            </Button>
            <Button
              variant={activeCategory === "energy" ? "default" : "ghost"}
              onClick={() => setActiveCategory("energy")}
              className="px-3 sm:px-6 py-2 text-xs sm:text-sm font-medium"
            >
              Energy Efficiency
            </Button>
          </div>
        </div>
        
        {/* Portfolio Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-lg shadow-md overflow-hidden animate-pulse border border-border">
                <div className="w-full h-40 sm:h-48 bg-muted"></div>
                <div className="p-4 sm:p-6">
                  <div className="h-5 sm:h-6 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-5 sm:h-6 w-16 sm:w-20 bg-muted rounded-full"></div>
                    <div className="h-4 w-12 sm:w-16 bg-muted rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {filteredProjects.map((project) => (
              <div key={project.id} className="bg-card rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow border border-border">
                <img 
                  src={project.imageUrl || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"} 
                  alt={project.title}
                  className="w-full h-40 sm:h-48 object-cover"
                />
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-card-foreground mb-2">{project.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-4">{project.description}</p>
                  <div className="flex justify-between items-center">
                    <Badge className={getCategoryBadgeColor(project.category)}>
                      {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
                    </Badge>
                    <button className="text-brand-blue hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">View Details</button>
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
