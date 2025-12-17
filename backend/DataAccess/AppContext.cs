using DataAccess.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccess;

public class AppContext(DbContextOptions<AppContext> options) : DbContext(options)
{
    public DbSet<Product> Products { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Brand> Brands { get; set; }
    public DbSet<News> News { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Продукт
        modelBuilder.Entity<Product>().HasKey(n => n.Id);
        modelBuilder.Entity<Product>().Property(n => n.Title).IsRequired();
        modelBuilder.Entity<Product>()
            .Property(n => n.ProductCategory)
            .HasConversion(new EnumDescriptionConverter<ProductCategory>());
        
        modelBuilder.Entity<Product>()
            .HasOne(p => p.Brand)
            .WithMany(b => b.Products)
            .HasForeignKey(p => p.BrandId)
            .OnDelete(DeleteBehavior.Restrict);
        
        // Новость
        modelBuilder.Entity<News>().HasKey(n => n.Id);
        modelBuilder.Entity<News>().Property(n => n.Title).IsRequired();
        
        modelBuilder.Entity<News>()
            .HasOne(p => p.Brand)
            .WithMany(b => b.News)
            .HasForeignKey(p => p.BrandId)
            .OnDelete(DeleteBehavior.Restrict);
        
        // Токен
        modelBuilder.Entity<RefreshToken>().HasKey(n => n.Id);
        modelBuilder.Entity<RefreshToken>().Property(n => n.Token).IsRequired();
        
        modelBuilder.Entity<RefreshToken>()
            .HasOne(rt => rt.User)
            .WithOne(u => u.RefreshToken)
            .HasForeignKey<User>(u => u.RefreshTokenId)
            .OnDelete(DeleteBehavior.Cascade);
        
        // Пользователь
        modelBuilder.Entity<User>().HasKey(n => n.Id);
        modelBuilder.Entity<User>().Property(n => n.Username).IsRequired();
        modelBuilder.Entity<User>().Property(n => n.PasswordHash).IsRequired();
        
        modelBuilder.Entity<Brand>().HasKey(n => n.Id);
        modelBuilder.Entity<Brand>().Property(n => n.Name).IsRequired();
        
        modelBuilder.Entity<User>()
            .HasMany(u => u.Brands)
            .WithMany(b => b.Users)
            .UsingEntity(j => j.ToTable("UserBrands"));
        
        base.OnModelCreating(modelBuilder);
    }
}