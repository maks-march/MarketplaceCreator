using BusinessLogic.Services.ProductService;
using DataAccess.Models;
using Microsoft.AspNetCore.Mvc;
using Shared.DataTransferObjects.Request.ProductDto;
using Shared.DataTransferObjects.Response;
using WebApi.Controllers.BaseControllers;

namespace WebApi.Controllers.ProductsController;

[ApiController]
[Route("api/v{version:apiVersion}/products")]
[ApiVersion("1.0")]
public class ProductsController(IProductService productsService) : 
    BaseManyByUserController<Product, ProductLinkedDto, ProductSearchDto>(productsService)
{
    [HttpGet("withFilters")]
    [ResponseCache(Duration = 30)]
    [MapToApiVersion("1.0")]
    public async Task<IActionResult> FindWithFiltersAsync(
        [FromQuery] string query = "",
        [FromQuery] int page = 1, 
        [FromQuery] int pageSize = 20, 
        [FromQuery] string color = "", 
        [FromQuery] string category = "")
    {
        var searchDto = new ProductSearchDto()
        {
            Query = query,
            Page = page,
            PageSize = pageSize,
            ColorScheme = color,
            Category = category
        };
        var items = await productsService.GetFilteredAsync(searchDto);
        return Ok(items);
    }
    
    protected override async Task<IEnumerable<ProductLinkedDto>> GetUserItems(ProductSearchDto searchDto)
    {
        var userId = GetCurrentUserId();
        return await productsService.GetFilteredAsync(
            searchDto, 
            p => p.Brand.Users.Any(u => u.Id == userId)
        );
    }
}