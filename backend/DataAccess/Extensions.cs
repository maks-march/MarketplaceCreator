using DataAccess.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace DataAccess;

public static class Extensions
{
    public static IServiceCollection AddDataAccess(this IServiceCollection serviceCollection)
    {
        serviceCollection.AddScoped<IProductRepository, ProductRepository>();
        serviceCollection.AddScoped<IUserRepository, UserRepository>();
        serviceCollection.AddDbContext<AppContext>(x =>
        {
            // для локального пользования
            // x.UseNpgsql("Host=localhost;Port=5432;Database=MainDB;Username=postgres;Password=123456;");
            // для docker
            x.UseNpgsql("Host=postgres;Port=5432;Database=MainDB;Username=postgres;Password=123456;");
        });
        return serviceCollection;
    }
}