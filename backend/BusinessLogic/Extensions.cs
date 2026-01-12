using BusinessLogic.Services;
using BusinessLogic.Services.AuthService;
using BusinessLogic.Services.BrandService;
using BusinessLogic.Services.NewsService;
using BusinessLogic.Services.ProductService;
using BusinessLogic.Services.UserService;
using Microsoft.Extensions.DependencyInjection;
using WebApi.Controllers.CartsController;

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
        serviceCollection.AddScoped<ICartService, CartService>();
        return serviceCollection;
    }
}