using DataAccess.Repositories;
using DataAccess.Repositories.UserBrandRepository;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace DataAccess;

public static class Extensions
{
    public static IServiceCollection AddDataAccess(this IServiceCollection serviceCollection, bool isDevelopment)
    {
        serviceCollection.AddScoped<IProductRepository, ProductRepository>();
        serviceCollection.AddScoped<IUserRepository, UserRepository>();
        serviceCollection.AddScoped<IUserBrandRepository, UserBrandRepository>();
        serviceCollection.AddScoped<IBrandRepository, BrandRepository>();
        if (isDevelopment)
        {
            // Используем InMemory для тестов
            serviceCollection.AddDbContext<ApplicationDbContext>(options =>
                options.UseInMemoryDatabase("TestDatabase"));
        }
        else
        {
            serviceCollection.AddDbContext<AppContext>(x =>
            {
                // для локального пользования
                // x.UseNpgsql("Host=localhost;Port=5432;Database=MainDB;Username=postgres;Password=123456;");
                // для docker
                x.UseNpgsql("Host=postgres;Port=5432;Database=MainDB;Username=postgres;Password=123456;");
            });
        }
        
        return serviceCollection;
    }
}