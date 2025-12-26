using BusinessLogic.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shared.DataTransferObjects;
using Shared.DataTransferObjects.Response;

namespace WebApi.Controllers;

[ApiController]
[Route("api/v{version:apiVersion}/products")]
[ApiVersion("1.0")]
public class ProductController(IProductService productService, IUserService userService) :
    BaseCrudController<ProductLinkedDto, ProductCreateDto, ProductUpdateDto>(productService, userService)
{
    [Authorize]
    [HttpPost("withImage")]
    [MapToApiVersion("1.0")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> CreateAsync([FromForm]ProductCreateFormDto createDto)
    {
        var user = await GetCurrentUser();
        var imageUrls = new List<string>();
        foreach (var image in createDto.ImageFiles)
        {
            string imageUrl = "";
            if (image != null)
            {
                imageUrl = await SaveImageAsync(image);
            }
            imageUrls.Add(imageUrl);
        }
        
        var dto = new ProductCreateDto
        {
            Title = createDto.Title,
            Description = createDto.Description,
            Price = createDto.Price,
            BrandId = createDto.BrandId,
            ImageLinks = imageUrls.ToArray()
        };
        
        await productService.CreateAsync(dto, user);
        return NoContent();
    }
    
    private async Task<string> SaveImageAsync(IFormFile file)
    {
        var fileExtension = Path.GetExtension(file.FileName);
        var fileName = $"{Guid.NewGuid()}_{GetCurrentUserId()}{fileExtension}";
    
        var uploadsPath = Path.Combine("/staticfiles", "uploads");
    
        // ЕСЛИ НЕТ ПАПКИ - СОЗДАЕМ
        if (!Directory.Exists(uploadsPath))
            Directory.CreateDirectory(uploadsPath);
    
        var fullPath = Path.Combine(uploadsPath, fileName);
    
        // СОХРАНЯЕМ НА ДИСК
        using (var stream = new FileStream(fullPath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }
    
        // ВОЗВРАЩАЕМ ОТНОСИТЕЛЬНЫЙ ПУТЬ
        return $"/uploads/{fileName}";
    }
}