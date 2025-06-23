import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@shared/schema";

export default function BlogSection() {
  const { data: blogPosts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog/posts"],
    retry: false,
  });

  const defaultPosts = [
    {
      id: 1,
      title: "Energy Efficient HVAC Systems: A Complete Guide",
      excerpt: "Learn how modern HVAC systems can reduce your energy bills while maintaining optimal comfort.",
      imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
      publishedAt: "2024-03-15T00:00:00Z",
      slug: "energy-efficient-hvac-systems"
    },
    {
      id: 2,
      title: "Spring HVAC Maintenance Checklist",
      excerpt: "Essential maintenance tasks to prepare your HVAC system for the warmer months ahead.",
      imageUrl: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
      publishedAt: "2024-03-10T00:00:00Z",
      slug: "spring-hvac-maintenance-checklist"
    },
    {
      id: 3,
      title: "Smart Thermostats: Worth the Investment?",
      excerpt: "Discover how smart thermostats can optimize your home's comfort and energy efficiency.",
      imageUrl: "https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
      publishedAt: "2024-03-05T00:00:00Z",
      slug: "smart-thermostats-worth-investment"
    }
  ];

  const displayPosts = blogPosts && blogPosts.length > 0 ? blogPosts : defaultPosts;

  const formatDate = (dateString: string | Date | null) => {
    if (!dateString) return 'Recent';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <section id="blog" className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Latest Blog Posts</h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Stay updated with HVAC tips, energy efficiency guides, and industry news.
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="w-full h-40 sm:h-48 bg-gray-300"></div>
                <div className="p-4 sm:p-6">
                  <div className="flex space-x-2 mb-3">
                    <div className="h-5 sm:h-6 w-12 sm:w-16 bg-gray-300 rounded-full"></div>
                    <div className="h-5 sm:h-6 w-16 sm:w-20 bg-gray-300 rounded-full"></div>
                  </div>
                  <div className="h-5 sm:h-6 bg-gray-300 rounded mb-3"></div>
                  <div className="h-4 bg-gray-300 rounded mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-4 w-20 sm:w-24 bg-gray-300 rounded"></div>
                    <div className="h-4 w-12 sm:w-16 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {displayPosts.slice(0, 3).map((post, index) => (
              <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                <img 
                  src={post.imageUrl || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400"} 
                  alt={post.title}
                  className="w-full h-40 sm:h-48 object-cover"
                />
                <div className="p-4 sm:p-6">
                  <div className="flex space-x-2 mb-3">
                    {index === 0 && (
                      <>
                        <Badge className="bg-blue-100 text-brand-blue">HVAC</Badge>
                        <Badge className="bg-green-100 text-green-700">Energy Efficiency</Badge>
                      </>
                    )}
                    {index === 1 && (
                      <Badge className="bg-orange-100 text-brand-orange">Maintenance</Badge>
                    )}
                    {index === 2 && (
                      <Badge className="bg-purple-100 text-purple-700">Smart Home</Badge>
                    )}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">{post.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4">{post.excerpt}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-gray-500">
                      {formatDate(post.publishedAt)}
                    </span>
                    <button className="text-sm sm:text-base text-brand-blue hover:text-blue-700 font-medium">Read More</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
