using DataAccess.Repositories;
using DataAccess.Repositories.BrandRepository;
using DataAccess.Repositories.CartRepository;
using DataAccess.Repositories.NewsRepository;
using DataAccess.Repositories.ProductRepository;
using DataAccess.Repositories.RefreshtokenRepository;
using DataAccess.Repositories.UserRepository;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using WebApi.Controllers.CartsController;

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
        serviceCollection.AddScoped<ICartRepository, CartRepository>();
        
        serviceCollection.AddDbContext<AppContext>(x =>
        {
            x.UseNpgsql("Host=localhost;Port=5432;Database=MainDB;Username=postgres;Password=123456;");
        });
        
        return serviceCollection;
    }
}