using DataAccess.Repositories;
using DataAccess.Repositories.NewsRepository;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace DataAccess;

public static class Extensions
{
    public static IServiceCollection AddDataAccess(this IServiceCollection serviceCollection)
    {
        serviceCollection.AddScoped<IProductRepository, ProductRepository>();
        serviceCollection.AddScoped<IUserRepository, UserRepository>();
        serviceCollection.AddScoped<IBrandRepository, BrandRepository>();
        serviceCollection.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
        serviceCollection.AddScoped<INewsRepository, NewsRepository>();
        
        serviceCollection.AddDbContext<AppContext>(x =>
        {
            x.UseNpgsql("Host=postgres;Port=5432;Database=MainDB;Username=postgres;Password=123456;");
        });
        
        return serviceCollection;
    }
}