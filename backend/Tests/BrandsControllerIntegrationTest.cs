using FluentAssertions;
using System.Net;
using System.Net.Http.Json;
using DataAccess.Models;
using Shared.DataTransferObjects.Request.BrandDto;
using Shared.DataTransferObjects.Response;

namespace Tests;

[TestFixture]
public class BrandsControllerIntegrationTests : BaseIntegrationTest
{
    private const string ApiBaseUrl = "/api/v1.0/brands";
    
    protected override void SeedTestData()
    {
        // Добавляем тестовые данные
        DbContext.Brands.AddRange(
            new Brand { Id = 1, Name = "Brand 1", Description = "Description 1" },
            new Brand { Id = 2, Name = "Brand 2", Description = "Description 2" }
        );
        DbContext.SaveChanges();
    }

    [Test]
    public async Task GetAllBrands_ReturnsOkWithBrands()
    {
        // Act
        var response = await Client.GetAsync(ApiBaseUrl);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var brands = await response.Content.ReadFromJsonAsync<List<BrandDto>>();
        brands.Should().NotBeNull();
        brands.Should().HaveCount(2);
        brands[0].Name.Should().Be("Brand 1");
    }

    [Test]
    public async Task GetBrandById_WhenBrandExists_ReturnsBrand()
    {
        // Arrange
        var brandId = 1;

        // Act
        var response = await Client.GetAsync($"{ApiBaseUrl}/{brandId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var brand = await response.Content.ReadFromJsonAsync<BrandDto>();
        brand.Should().NotBeNull();
        brand.Id.Should().Be(brandId);
        brand.Name.Should().Be("Brand 1");
    }

    [Test]
    public async Task GetBrandById_WhenBrandDoesNotExist_ReturnsNotFound()
    {
        // Arrange
        var nonExistentId = 999;

        // Act
        var response = await Client.GetAsync($"{ApiBaseUrl}/{nonExistentId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Test]
    public async Task CreateBrand_WithValidData_ReturnsCreatedBrand()
    {
        // Arrange
        var newBrand = new BrandCreateDto
        {
            Name = "New Brand",
            Description = "New Description"
        };

        // Act
        var response = await Client.PostAsJsonAsync(ApiBaseUrl, newBrand);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var createdBrand = await response.Content.ReadFromJsonAsync<BrandDto>();
        createdBrand.Should().NotBeNull();
        createdBrand.Name.Should().Be("New Brand");

        // Проверяем, что бренд действительно создан в БД
        var brandInDb = await DbContext.Brands.FindAsync(createdBrand.Id);
        brandInDb.Should().NotBeNull();
        brandInDb.Name.Should().Be("New Brand");
    }

    [Test]
    public async Task CreateBrand_WithDuplicateName_ReturnsBadRequest()
    {
        // Arrange
        var duplicateBrand = new BrandCreateDto
        {
            Name = "Brand 1", // Уже существует
            Description = "Duplicate"
        };

        // Act
        var response = await Client.PostAsJsonAsync(ApiBaseUrl, duplicateBrand);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Test]
    public async Task UpdateBrand_WhenBrandExists_ReturnsNoContent()
    {
        // Arrange
        var brandId = 1;
        var updateDto = new BrandUpdateDto
        {
            Name = "Updated Brand Name",
            Description = "Updated Description"
        };

        // Act
        var response = await Client.PatchAsJsonAsync($"{ApiBaseUrl}/{brandId}", updateDto);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);

        // Проверяем обновление в БД
        var updatedBrand = await DbContext.Brands.FindAsync(brandId);
        updatedBrand.Name.Should().Be("Updated Brand Name");
    }

    [Test]
    public async Task UpdateBrand_WhenBrandDoesNotExist_ReturnsNotFound()
    {
        // Arrange
        var nonExistentId = 999;
        var updateDto = new BrandUpdateDto { Name = "Updated" };

        // Act
        var response = await Client.PatchAsJsonAsync($"{ApiBaseUrl}/{nonExistentId}", updateDto);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Test]
    public async Task DeleteBrand_WhenBrandExists_ReturnsNoContent()
    {
        // Arrange
        var brandId = 1;

        // Act
        var response = await Client.DeleteAsync($"{ApiBaseUrl}/{brandId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);

        // Проверяем удаление из БД
        var deletedBrand = await DbContext.Brands.FindAsync(brandId);
        deletedBrand.Should().BeNull();
    }

    [Test]
    public async Task DeleteBrand_WhenBrandDoesNotExist_ReturnsNotFound()
    {
        // Arrange
        var nonExistentId = 999;

        // Act
        var response = await Client.DeleteAsync($"{ApiBaseUrl}/{nonExistentId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}