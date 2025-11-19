using BusinessLogic;
using DataAccess;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDataAccess();
builder.Services.AddBusinessLogic();

builder.Services.AddControllers();
builder.Services.AddApiVersioning(options =>
{
    options.DefaultApiVersion = new ApiVersion(1, 0);
    options.AssumeDefaultVersionWhenUnspecified = true;
    options.ReportApiVersions = true;
});

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(c =>
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

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<DataAccess.AppContext>();
    
    // Ждем PostgreSQL
    for (int i = 0; i < 10; i++)
    {
        try
        {
            Console.WriteLine($"Migration attempt {i + 1}/10");
            
            if (db.Database.CanConnect())
            {
                db.Database.Migrate();
                Console.WriteLine("Migrations applied successfully");
                break;
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Attempt {i + 1} failed: {ex.Message}");
            if (i == 9) throw;
            Thread.Sleep(5000);
        }
    }
}

app.UseRouting();

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1.0/swagger.json", "v1");
    c.SwaggerEndpoint("/swagger/v2.0/swagger.json", "v2");
});

app.MapControllers();

app.Run();