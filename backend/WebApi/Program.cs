using BusinessLogic;
using DataAccess;
using Microsoft.EntityFrameworkCore;
using Shared.Exceptions;
using WebApi;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDataAccess(builder.Environment.IsDevelopment() || builder.Environment.IsEnvironment("Testing"));
builder.Services.AddBusinessLogic();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddControllers(options =>
{
    options.Filters.Add<CustomExceptionFilter>();
});

builder.Services.AddWebApiVersioning();

var jwtKey = builder.Configuration["Jwt:Key"] ?? "default-secret-key-min-32-chars-long-123456789";
builder.Services.AddJwtAuthentification(jwtKey);

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<DataAccess.AppContext>();
    
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

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();