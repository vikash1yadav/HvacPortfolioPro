import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { loginAdmin, requireAdminAuth, getCurrentAdmin } from "./adminAuth";
import { z } from "zod";
import {
  insertCompanyContentSchema,
  insertServiceSchema,
  insertPortfolioProjectSchema,
  insertTeamMemberSchema,
  insertBlogPostSchema,
  insertBlogCategorySchema,
  insertBlogTagSchema,
  insertTestimonialSchema,
  insertContactSubmissionSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Admin Authentication Routes
  const loginSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
  });

  app.post('/api/admin/login', async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      const user = await loginAdmin(username, password);
      
      if (user) {
        const sessionUser = {
          id: user.id,
          username: user.username,
          email: user.email || undefined
        };
        req.session.adminUser = sessionUser;
        res.json({ message: "Login successful", user: sessionUser });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (error) {
      console.error("Login error:", error);
      res.status(400).json({ message: "Invalid request" });
    }
  });

  app.post('/api/admin/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Could not log out" });
      }
      res.json({ message: "Logout successful" });
    });
  });

  app.get('/api/admin/user', requireAdminAuth, (req, res) => {
    const adminUser = getCurrentAdmin(req);
    res.json(adminUser);
  });

  // Public API routes (no auth required)
  
  // Company content
  app.get('/api/company-content', async (req, res) => {
    try {
      const content = await storage.getCompanyContent();
      res.json(content);
    } catch (error) {
      console.error("Error fetching company content:", error);
      res.status(500).json({ message: "Failed to fetch company content" });
    }
  });

  app.get('/api/company-content/:section', async (req, res) => {
    try {
      const { section } = req.params;
      const content = await storage.getCompanyContentBySection(section);
      
      if (!content) {
        // Return default content for hero section
        if (section === 'hero') {
          return res.json({
            section: 'hero',
            title: 'Arctic Air Solutions',
            description: 'Professional HVAC services for residential and commercial properties. Expert installation, maintenance, and repair services.',
            content: null
          });
        }
        // Return default content for about section
        if (section === 'about') {
          return res.json({
            section: 'about',
            title: 'About Arctic Air Solutions',
            description: 'With over 15 years of experience in the HVAC industry, Arctic Air Solutions has been serving the community with reliable heating, ventilation, and air conditioning services.',
            content: 'Our team of certified technicians is committed to providing exceptional service and ensuring your comfort year-round. We specialize in energy-efficient solutions that save you money while keeping your space comfortable.'
          });
        }
        return res.status(404).json({ message: "Content not found" });
      }
      
      res.json(content);
    } catch (error) {
      console.error("Error fetching company content:", error);
      res.status(500).json({ message: "Failed to fetch company content" });
    }
  });

  // Services
  app.get('/api/services', async (req, res) => {
    try {
      const services = await storage.getActiveServices();
      res.json(services);
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  // Portfolio
  app.get('/api/portfolio', async (req, res) => {
    try {
      const { category } = req.query;
      let projects;
      if (category && typeof category === 'string') {
        projects = await storage.getPortfolioProjectsByCategory(category);
      } else {
        projects = await storage.getPublishedPortfolioProjects();
      }
      res.json(projects);
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      res.status(500).json({ message: "Failed to fetch portfolio" });
    }
  });

  // Team
  app.get('/api/team', async (req, res) => {
    try {
      const team = await storage.getActiveTeamMembers();
      res.json(team);
    } catch (error) {
      console.error("Error fetching team:", error);
      res.status(500).json({ message: "Failed to fetch team" });
    }
  });

  // Blog
  app.get('/api/blog/posts', async (req, res) => {
    try {
      const posts = await storage.getPublishedBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get('/api/blog/posts/:slug', async (req, res) => {
    try {
      const { slug } = req.params;
      const post = await storage.getBlogPostBySlug(slug);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  // Testimonials
  app.get('/api/testimonials', async (req, res) => {
    try {
      const testimonials = await storage.getPublishedTestimonials();
      res.json(testimonials);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  // Contact
  app.post('/api/contact', async (req, res) => {
    try {
      const validatedData = insertContactSubmissionSchema.parse(req.body);
      const submission = await storage.createContactSubmission(validatedData);
      res.status(201).json({ message: "Contact submission received", id: submission.id });
    } catch (error) {
      console.error("Error creating contact submission:", error);
      res.status(400).json({ message: "Failed to submit contact form" });
    }
  });

  // Placeholder image endpoint
  app.get('/api/placeholder/:width/:height', (req, res) => {
    const { width, height } = req.params;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="#9ca3af" text-anchor="middle" dy="0.3em">${width}×${height}</text>
    </svg>`;
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(svg);
  });

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Admin content management
  app.put('/api/admin/company-content/:id', requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertCompanyContentSchema.partial().parse(req.body);
      const content = await storage.updateCompanyContent(id, validatedData);
      res.json(content);
    } catch (error) {
      console.error("Error updating company content:", error);
      res.status(400).json({ message: "Failed to update company content" });
    }
  });

  // Admin services
  app.get('/api/admin/services', requireAdminAuth, async (req, res) => {
    try {
      const services = await storage.getServices();
      res.json(services);
    } catch (error) {
      console.error("Error fetching admin services:", error);
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  app.post('/api/admin/services', requireAdminAuth, async (req, res) => {
    try {
      const validatedData = insertServiceSchema.parse(req.body);
      const service = await storage.createService(validatedData);
      res.status(201).json(service);
    } catch (error) {
      console.error("Error creating service:", error);
      res.status(400).json({ message: "Failed to create service" });
    }
  });

  app.put('/api/admin/services/:id', requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertServiceSchema.partial().parse(req.body);
      const service = await storage.updateService(id, validatedData);
      res.json(service);
    } catch (error) {
      console.error("Error updating service:", error);
      res.status(400).json({ message: "Failed to update service" });
    }
  });

  app.delete('/api/admin/services/:id', requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteService(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting service:", error);
      res.status(500).json({ message: "Failed to delete service" });
    }
  });

  // Admin portfolio
  app.get('/api/admin/portfolio', requireAdminAuth, async (req, res) => {
    try {
      const projects = await storage.getPortfolioProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching admin portfolio:", error);
      res.status(500).json({ message: "Failed to fetch portfolio" });
    }
  });

  app.post('/api/admin/portfolio', requireAdminAuth, async (req, res) => {
    try {
      const validatedData = insertPortfolioProjectSchema.parse(req.body);
      const project = await storage.createPortfolioProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      console.error("Error creating portfolio project:", error);
      res.status(400).json({ message: "Failed to create portfolio project" });
    }
  });

  app.put('/api/admin/portfolio/:id', requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertPortfolioProjectSchema.partial().parse(req.body);
      const project = await storage.updatePortfolioProject(id, validatedData);
      res.json(project);
    } catch (error) {
      console.error("Error updating portfolio project:", error);
      res.status(400).json({ message: "Failed to update portfolio project" });
    }
  });

  app.delete('/api/admin/portfolio/:id', requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deletePortfolioProject(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting portfolio project:", error);
      res.status(500).json({ message: "Failed to delete portfolio project" });
    }
  });

  // Admin team
  app.get('/api/admin/team', requireAdminAuth, async (req, res) => {
    try {
      const team = await storage.getTeamMembers();
      res.json(team);
    } catch (error) {
      console.error("Error fetching admin team:", error);
      res.status(500).json({ message: "Failed to fetch team" });
    }
  });

  app.post('/api/admin/team', requireAdminAuth, async (req, res) => {
    try {
      const validatedData = insertTeamMemberSchema.parse(req.body);
      const member = await storage.createTeamMember(validatedData);
      res.status(201).json(member);
    } catch (error) {
      console.error("Error creating team member:", error);
      res.status(400).json({ message: "Failed to create team member" });
    }
  });

  app.put('/api/admin/team/:id', requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertTeamMemberSchema.partial().parse(req.body);
      const member = await storage.updateTeamMember(id, validatedData);
      res.json(member);
    } catch (error) {
      console.error("Error updating team member:", error);
      res.status(400).json({ message: "Failed to update team member" });
    }
  });

  app.delete('/api/admin/team/:id', requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteTeamMember(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting team member:", error);
      res.status(500).json({ message: "Failed to delete team member" });
    }
  });

  // Admin blog
  app.get('/api/admin/blog/posts', requireAdminAuth, async (req, res) => {
    try {
      const posts = await storage.getBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching admin blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.post('/api/admin/blog/posts', requireAdminAuth, async (req, res) => {
    try {
      const validatedData = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      console.error("Error creating blog post:", error);
      res.status(400).json({ message: "Failed to create blog post" });
    }
  });

  app.put('/api/admin/blog/posts/:id', requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertBlogPostSchema.partial().parse(req.body);
      const post = await storage.updateBlogPost(id, validatedData);
      res.json(post);
    } catch (error) {
      console.error("Error updating blog post:", error);
      res.status(400).json({ message: "Failed to update blog post" });
    }
  });

  app.delete('/api/admin/blog/posts/:id', requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteBlogPost(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting blog post:", error);
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });

  app.post('/api/admin/blog/categories', requireAdminAuth, async (req, res) => {
    try {
      const validatedData = insertBlogCategorySchema.parse(req.body);
      const category = await storage.createBlogCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      console.error("Error creating blog category:", error);
      res.status(400).json({ message: "Failed to create blog category" });
    }
  });

  app.post('/api/admin/blog/tags', requireAdminAuth, async (req, res) => {
    try {
      const validatedData = insertBlogTagSchema.parse(req.body);
      const tag = await storage.createBlogTag(validatedData);
      res.status(201).json(tag);
    } catch (error) {
      console.error("Error creating blog tag:", error);
      res.status(400).json({ message: "Failed to create blog tag" });
    }
  });

  // Admin testimonials
  app.get('/api/admin/testimonials', requireAdminAuth, async (req, res) => {
    try {
      const testimonials = await storage.getTestimonials();
      res.json(testimonials);
    } catch (error) {
      console.error("Error fetching admin testimonials:", error);
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  app.post('/api/admin/testimonials', requireAdminAuth, async (req, res) => {
    try {
      const validatedData = insertTestimonialSchema.parse(req.body);
      const testimonial = await storage.createTestimonial(validatedData);
      res.status(201).json(testimonial);
    } catch (error) {
      console.error("Error creating testimonial:", error);
      res.status(400).json({ message: "Failed to create testimonial" });
    }
  });

  app.put('/api/admin/testimonials/:id', requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertTestimonialSchema.partial().parse(req.body);
      const testimonial = await storage.updateTestimonial(id, validatedData);
      res.json(testimonial);
    } catch (error) {
      console.error("Error updating testimonial:", error);
      res.status(400).json({ message: "Failed to update testimonial" });
    }
  });

  app.delete('/api/admin/testimonials/:id', requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteTestimonial(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      res.status(500).json({ message: "Failed to delete testimonial" });
    }
  });

  // Admin contact submissions
  app.get('/api/admin/contact-submissions', requireAdminAuth, async (req, res) => {
    try {
      const submissions = await storage.getContactSubmissions();
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching contact submissions:", error);
      res.status(500).json({ message: "Failed to fetch contact submissions" });
    }
  });

  app.put('/api/admin/contact-submissions/:id/read', requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.markContactSubmissionAsRead(id);
      res.json({ message: "Marked as read" });
    } catch (error) {
      console.error("Error marking submission as read:", error);
      res.status(500).json({ message: "Failed to mark as read" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}