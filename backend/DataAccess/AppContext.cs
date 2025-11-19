using DataAccess.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccess;

public class AppContext(DbContextOptions<AppContext> options) : DbContext(options)
{
    public DbSet<Product> Products { get; set; }
    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Product>().HasKey(n => n.Id);
        modelBuilder.Entity<Product>().Property(n => n.Title).IsRequired();
        
        
        modelBuilder.Entity<User>().HasKey(n => n.Id);
        modelBuilder.Entity<User>().Property(n => n.Username).IsRequired();
        modelBuilder.Entity<User>().Property(n => n.PasswordHash).IsRequired();
        base.OnModelCreating(modelBuilder);
    }
}