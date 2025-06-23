import { useQuery } from "@tanstack/react-query";
import type { TeamMember } from "@shared/schema";

export default function TeamSection() {
  const { data: teamMembers, isLoading } = useQuery<TeamMember[]>({
    queryKey: ["/api/team"],
    retry: false,
  });

  const defaultTeam = [
    {
      id: 1,
      name: "John Martinez",
      position: "Senior HVAC Technician",
      bio: "15+ years of experience in commercial and residential HVAC systems.",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400"
    },
    {
      id: 2,
      name: "Sarah Chen",
      position: "HVAC Engineer",
      bio: "Specialist in energy-efficient system design and implementation.",
      imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400"
    },
    {
      id: 3,
      name: "Mike Thompson",
      position: "Service Manager",
      bio: "Ensures quality service delivery and customer satisfaction.",
      imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400"
    }
  ];

  const displayTeam = teamMembers && teamMembers.length > 0 ? teamMembers : defaultTeam;

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Expert Team</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Meet the certified professionals who deliver exceptional HVAC services.
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-lg shadow-md overflow-hidden animate-pulse border border-border">
                <div className="w-full h-64 bg-muted"></div>
                <div className="p-6">
                  <div className="h-6 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded mb-3"></div>
                  <div className="h-4 bg-muted rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayTeam.map((member) => (
              <div key={member.id} className="bg-card rounded-lg shadow-md overflow-hidden text-center border border-border">
                <img 
                  src={member.imageUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400"} 
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-card-foreground mb-1">{member.name}</h3>
                  <p className="text-brand-blue mb-3">{member.position}</p>
                  <p className="text-muted-foreground text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
