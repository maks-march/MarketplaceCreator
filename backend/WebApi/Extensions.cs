using System.Text;
using BusinessLogic.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace WebApi;

public static class Extensions
{
    public static IServiceCollection AddJwtAuthentification(this IServiceCollection serviceCollection, string jwtKey)
    {
        
        serviceCollection.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = "MarketplaceBuilder",
                    ValidAudience = "users",
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(jwtKey))
                };
            });

        serviceCollection.AddAuthorization();

        return serviceCollection;
    }

    public static IServiceCollection AddWebApiVersioning(this IServiceCollection serviceCollection)
    {
        serviceCollection.AddApiVersioning(options =>
        {
            options.DefaultApiVersion = new ApiVersion(1, 0);
            options.AssumeDefaultVersionWhenUnspecified = true;
            options.ReportApiVersions = true;
        });


        serviceCollection.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1.0", new() { Title = "API v1", Version = "v1.0" });
            c.SwaggerDoc("v2.0", new() { Title = "API v2", Version = "v2.0" });
    
            c.DocInclusionPredicate((docName, apiDesc) =>
            {
                var versions = apiDesc.ActionDescriptor.EndpointMetadata
                    .OfType<MapToApiVersionAttribute>()
                    .SelectMany(attr => attr.Versions)
                    .Select(v => $"v{v}")
                    .ToList();
            
                return versions.Contains(docName);
            });
        });
        return serviceCollection;
    }
}
