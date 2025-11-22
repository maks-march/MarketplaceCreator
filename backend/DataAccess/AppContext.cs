using DataAccess.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccess;

public class AppContext(DbContextOptions<AppContext> options) : DbContext(options)
{
    public DbSet<Product> Products { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Brand> Brands { get; set; }
    public DbSet<UserBrand> UserBrand { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Product>().HasKey(n => n.Id);
        modelBuilder.Entity<Product>().Property(n => n.Title).IsRequired();
        // modelBuilder.Entity<Product>()
        //     .HasOne(p => p.BrandId)
        //     .WithMany()
        //     .HasForeignKey(p => p.BrandId)
        //     .OnDelete(DeleteBehavior.Restrict); 
        
        modelBuilder.Entity<User>().HasKey(n => n.Id);
        modelBuilder.Entity<User>().Property(n => n.Username).IsRequired();
        modelBuilder.Entity<User>().Property(n => n.PasswordHash).IsRequired();
        modelBuilder.Entity<User>()
            .HasMany(u => u.UserBrand)
            .WithOne(ub => ub.User)
            .HasForeignKey(ub => ub.UserId)
            .OnDelete(DeleteBehavior.Cascade);
        
        modelBuilder.Entity<Brand>().HasKey(n => n.Id);
        modelBuilder.Entity<Brand>().Property(n => n.Name).IsRequired();
        modelBuilder.Entity<Brand>()
            .HasMany(u => u.UserBrand)
            .WithOne(ub => ub.Brand)
            .HasForeignKey(ub => ub.BrandId);
        
        modelBuilder.Entity<UserBrand>()
            .HasKey(up => new { up.UserId, up.BrandId });
        
        base.OnModelCreating(modelBuilder);
    }
}