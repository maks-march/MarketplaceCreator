using BusinessLogic.Services;
using BusinessLogic.Services.NewsService;
using Microsoft.Extensions.DependencyInjection;

namespace BusinessLogic;

public static class Extensions
{
    public static IServiceCollection AddBusinessLogic(this IServiceCollection serviceCollection)
    {
        serviceCollection.AddScoped<IProductService, ProductService>();
        serviceCollection.AddScoped<IAuthService, AuthService>();
        serviceCollection.AddScoped<IUserService, UserService>();
        serviceCollection.AddScoped<IBrandService, BrandService>();
        serviceCollection.AddScoped<INewsService, NewsService>();
        return serviceCollection;
    }
}