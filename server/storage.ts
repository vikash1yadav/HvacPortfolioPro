import {
  users,
  adminUsers,
  companyContent,
  services,
  portfolioProjects,
  teamMembers,
  blogCategories,
  blogTags,
  blogPosts,
  blogPostTags,
  testimonials,
  contactSubmissions,
  type User,
  type UpsertUser,
  type AdminUser,
  type InsertAdminUser,
  type CompanyContent,
  type InsertCompanyContent,
  type Service,
  type InsertService,
  type PortfolioProject,
  type InsertPortfolioProject,
  type TeamMember,
  type InsertTeamMember,
  type BlogCategory,
  type InsertBlogCategory,
  type BlogTag,
  type InsertBlogTag,
  type BlogPost,
  type InsertBlogPost,
  type Testimonial,
  type InsertTestimonial,
  type ContactSubmission,
  type InsertContactSubmission,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, like, inArray } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Admin user operations
  getAdminUserByUsername(username: string): Promise<AdminUser | undefined>;
  createAdminUser(user: InsertAdminUser): Promise<AdminUser>;
  updateAdminUserLastLogin(id: number): Promise<void>;

  // Company content operations
  getCompanyContent(): Promise<CompanyContent[]>;
  getCompanyContentBySection(section: string): Promise<CompanyContent | undefined>;
  upsertCompanyContent(content: InsertCompanyContent): Promise<CompanyContent>;
  updateCompanyContent(id: number, content: Partial<InsertCompanyContent>): Promise<CompanyContent>;

  // Service operations
  getServices(): Promise<Service[]>;
  getActiveServices(): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, service: Partial<InsertService>): Promise<Service>;
  deleteService(id: number): Promise<void>;

  // Portfolio operations
  getPortfolioProjects(): Promise<PortfolioProject[]>;
  getPublishedPortfolioProjects(): Promise<PortfolioProject[]>;
  getPortfolioProjectsByCategory(category: string): Promise<PortfolioProject[]>;
  createPortfolioProject(project: InsertPortfolioProject): Promise<PortfolioProject>;
  updatePortfolioProject(id: number, project: Partial<InsertPortfolioProject>): Promise<PortfolioProject>;
  deletePortfolioProject(id: number): Promise<void>;

  // Team operations
  getTeamMembers(): Promise<TeamMember[]>;
  getActiveTeamMembers(): Promise<TeamMember[]>;
  createTeamMember(member: InsertTeamMember): Promise<TeamMember>;
  updateTeamMember(id: number, member: Partial<InsertTeamMember>): Promise<TeamMember>;
  deleteTeamMember(id: number): Promise<void>;

  // Blog operations
  getBlogCategories(): Promise<BlogCategory[]>;
  createBlogCategory(category: InsertBlogCategory): Promise<BlogCategory>;
  getBlogTags(): Promise<BlogTag[]>;
  createBlogTag(tag: InsertBlogTag): Promise<BlogTag>;
  getBlogPosts(): Promise<BlogPost[]>;
  getPublishedBlogPosts(): Promise<BlogPost[]>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost>;
  deleteBlogPost(id: number): Promise<void>;
  addTagToPost(postId: number, tagId: number): Promise<void>;
  removeTagFromPost(postId: number, tagId: number): Promise<void>;

  // Testimonial operations
  getTestimonials(): Promise<Testimonial[]>;
  getPublishedTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  updateTestimonial(id: number, testimonial: Partial<InsertTestimonial>): Promise<Testimonial>;
  deleteTestimonial(id: number): Promise<void>;

  // Contact operations
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  getContactSubmissions(): Promise<ContactSubmission[]>;
  markContactSubmissionAsRead(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Admin user operations
  async getAdminUserByUsername(username: string): Promise<AdminUser | undefined> {
    const [user] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.username, username));
    return user;
  }

  async createAdminUser(userData: InsertAdminUser): Promise<AdminUser> {
    const [user] = await db
      .insert(adminUsers)
      .values(userData)
      .returning();
    return user;
  }

  async updateAdminUserLastLogin(id: number): Promise<void> {
    await db
      .update(adminUsers)
      .set({ lastLogin: new Date() })
      .where(eq(adminUsers.id, id));
  }

  // Company content operations
  async getCompanyContent(): Promise<CompanyContent[]> {
    return await db.select().from(companyContent).orderBy(companyContent.section);
  }

  async getCompanyContentBySection(section: string): Promise<CompanyContent | undefined> {
    const [content] = await db
      .select()
      .from(companyContent)
      .where(eq(companyContent.section, section));
    return content;
  }

  async upsertCompanyContent(content: InsertCompanyContent): Promise<CompanyContent> {
    const existing = await this.getCompanyContentBySection(content.section);
    
    if (existing) {
      const [updated] = await db
        .update(companyContent)
        .set({ ...content, updatedAt: new Date() })
        .where(eq(companyContent.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(companyContent)
        .values(content)
        .returning();
      return created;
    }
  }

  async updateCompanyContent(id: number, content: Partial<InsertCompanyContent>): Promise<CompanyContent> {
    const [updated] = await db
      .update(companyContent)
      .set({ ...content, updatedAt: new Date() })
      .where(eq(companyContent.id, id))
      .returning();
    return updated;
  }

  // Service operations
  async getServices(): Promise<Service[]> {
    return await db.select().from(services).orderBy(services.sortOrder);
  }

  async getActiveServices(): Promise<Service[]> {
    return await db
      .select()
      .from(services)
      .where(eq(services.isActive, true))
      .orderBy(services.sortOrder);
  }

  async createService(service: InsertService): Promise<Service> {
    const [created] = await db.insert(services).values(service).returning();
    return created;
  }

  async updateService(id: number, service: Partial<InsertService>): Promise<Service> {
    const [updated] = await db
      .update(services)
      .set({ ...service, updatedAt: new Date() })
      .where(eq(services.id, id))
      .returning();
    return updated;
  }

  async deleteService(id: number): Promise<void> {
    await db.delete(services).where(eq(services.id, id));
  }

  // Portfolio operations
  async getPortfolioProjects(): Promise<PortfolioProject[]> {
    return await db.select().from(portfolioProjects).orderBy(portfolioProjects.sortOrder);
  }

  async getPublishedPortfolioProjects(): Promise<PortfolioProject[]> {
    return await db
      .select()
      .from(portfolioProjects)
      .where(eq(portfolioProjects.isPublished, true))
      .orderBy(portfolioProjects.sortOrder);
  }

  async getPortfolioProjectsByCategory(category: string): Promise<PortfolioProject[]> {
    return await db
      .select()
      .from(portfolioProjects)
      .where(and(
        eq(portfolioProjects.category, category),
        eq(portfolioProjects.isPublished, true)
      ))
      .orderBy(portfolioProjects.sortOrder);
  }

  async createPortfolioProject(project: InsertPortfolioProject): Promise<PortfolioProject> {
    const [created] = await db.insert(portfolioProjects).values(project).returning();
    return created;
  }

  async updatePortfolioProject(id: number, project: Partial<InsertPortfolioProject>): Promise<PortfolioProject> {
    const [updated] = await db
      .update(portfolioProjects)
      .set({ ...project, updatedAt: new Date() })
      .where(eq(portfolioProjects.id, id))
      .returning();
    return updated;
  }

  async deletePortfolioProject(id: number): Promise<void> {
    await db.delete(portfolioProjects).where(eq(portfolioProjects.id, id));
  }

  // Team operations
  async getTeamMembers(): Promise<TeamMember[]> {
    return await db.select().from(teamMembers).orderBy(teamMembers.sortOrder);
  }

  async getActiveTeamMembers(): Promise<TeamMember[]> {
    return await db
      .select()
      .from(teamMembers)
      .where(eq(teamMembers.isActive, true))
      .orderBy(teamMembers.sortOrder);
  }

  async createTeamMember(member: InsertTeamMember): Promise<TeamMember> {
    const [created] = await db.insert(teamMembers).values(member).returning();
    return created;
  }

  async updateTeamMember(id: number, member: Partial<InsertTeamMember>): Promise<TeamMember> {
    const [updated] = await db
      .update(teamMembers)
      .set({ ...member, updatedAt: new Date() })
      .where(eq(teamMembers.id, id))
      .returning();
    return updated;
  }

  async deleteTeamMember(id: number): Promise<void> {
    await db.delete(teamMembers).where(eq(teamMembers.id, id));
  }

  // Blog operations
  async getBlogCategories(): Promise<BlogCategory[]> {
    return await db.select().from(blogCategories).orderBy(blogCategories.name);
  }

  async createBlogCategory(category: InsertBlogCategory): Promise<BlogCategory> {
    const [created] = await db.insert(blogCategories).values(category).returning();
    return created;
  }

  async getBlogTags(): Promise<BlogTag[]> {
    return await db.select().from(blogTags).orderBy(blogTags.name);
  }

  async createBlogTag(tag: InsertBlogTag): Promise<BlogTag> {
    const [created] = await db.insert(blogTags).values(tag).returning();
    return created;
  }

  async getBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  }

  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    return await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.isPublished, true))
      .orderBy(desc(blogPosts.publishedAt));
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug));
    return post;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [created] = await db.insert(blogPosts).values(post).returning();
    return created;
  }

  async updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost> {
    const [updated] = await db
      .update(blogPosts)
      .set({ ...post, updatedAt: new Date() })
      .where(eq(blogPosts.id, id))
      .returning();
    return updated;
  }

  async deleteBlogPost(id: number): Promise<void> {
    // Delete associated tags first
    await db.delete(blogPostTags).where(eq(blogPostTags.postId, id));
    // Delete the post
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  }

  async addTagToPost(postId: number, tagId: number): Promise<void> {
    await db.insert(blogPostTags).values({ postId, tagId });
  }

  async removeTagFromPost(postId: number, tagId: number): Promise<void> {
    await db
      .delete(blogPostTags)
      .where(and(
        eq(blogPostTags.postId, postId),
        eq(blogPostTags.tagId, tagId)
      ));
  }

  // Testimonial operations
  async getTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials).orderBy(testimonials.sortOrder);
  }

  async getPublishedTestimonials(): Promise<Testimonial[]> {
    return await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.isPublished, true))
      .orderBy(testimonials.sortOrder);
  }

  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const [created] = await db.insert(testimonials).values(testimonial).returning();
    return created;
  }

  async updateTestimonial(id: number, testimonial: Partial<InsertTestimonial>): Promise<Testimonial> {
    const [updated] = await db
      .update(testimonials)
      .set({ ...testimonial, updatedAt: new Date() })
      .where(eq(testimonials.id, id))
      .returning();
    return updated;
  }

  async deleteTestimonial(id: number): Promise<void> {
    await db.delete(testimonials).where(eq(testimonials.id, id));
  }

  // Contact operations
  async createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission> {
    const [created] = await db.insert(contactSubmissions).values(submission).returning();
    return created;
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return await db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt));
  }

  async markContactSubmissionAsRead(id: number): Promise<void> {
    await db
      .update(contactSubmissions)
      .set({ isRead: true })
      .where(eq(contactSubmissions.id, id));
  }
}

export const storage = new DatabaseStorage();
