using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;

namespace Tests;

[TestFixture]
public abstract class BaseIntegrationTest
{
    protected WebApplicationFactory<Program> Factory { get; private set; }
    protected HttpClient Client { get; private set; }
    protected DataAccess.AppContext DbContext { get; private set; }
    protected IServiceScope Scope { get; private set; }

    [OneTimeSetUp]
    public void OneTimeSetUp()
    {
        Factory = new WebApplicationFactory<Program>()
            .WithWebHostBuilder(builder =>
            {
                builder.ConfigureServices(services =>
                {
                    // Удаляем существующий DbContext
                    var descriptor = services.SingleOrDefault(
                        d => d.ServiceType == typeof(DbContextOptions<DataAccess.AppContext>));
                    
                    if (descriptor != null)
                        services.Remove(descriptor);

                    // Используем InMemory базу для тестов
                    services.AddDbContext<DataAccess.AppContext>(options =>
                    {
                        options.UseInMemoryDatabase("TestDatabase");
                    });

                    // Можно также использовать SQLite
                    // services.AddDbContext<AppDbContext>(options =>
                    //     options.UseSqlite("Data Source=test.db"));
                });
            });
    }

    [SetUp]
    public void SetUp()
    {
        Client = Factory.CreateClient();
        Scope = Factory.Services.CreateScope();
        DbContext = Scope.ServiceProvider.GetRequiredService<DataAccess.AppContext>();
        
        // Очищаем базу перед каждым тестом
        DbContext.Database.EnsureDeleted();
        DbContext.Database.EnsureCreated();
        SeedTestData();
    }

    [TearDown]
    public void TearDown()
    {
        Scope?.Dispose();
        Client?.Dispose();
    }

    [OneTimeTearDown]
    public void OneTimeTearDown()
    {
        Factory?.Dispose();
    }

    protected virtual void SeedTestData()
    {
        // Будет переопределено в конкретных тестах
    }
}