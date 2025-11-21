using BusinessLogic.Services;
using Shared.DataTransferObjects;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[ApiVersion("1.0")]
public class ProductsController(IProductService productsService) : ControllerBase
{
    [HttpGet]
    [ResponseCache(Duration = 30)]
    [MapToApiVersion("1.0")]
    public async Task<IActionResult> GetAllAsync(
        [FromQuery] int page = 1, 
        [FromQuery] int pageSize = 20
    ) {
        var searchDto = new ProductSearchDTO() 
        { 
            Page = page, 
            PageSize = pageSize
        };
        var products = await productsService.GetAllAsync(searchDto);
        return Ok(products);
    }
    
    [HttpGet("search/{query}")]
    [MapToApiVersion("1.0")]
    public async Task<IActionResult> FindAsync(ProductSearchDTO query)
    {
        var products = await productsService.FindAsync(query);
        return Ok(products);
    }
}