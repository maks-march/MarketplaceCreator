using BusinessLogic.Services;
using DataAccess.Models;
using Microsoft.AspNetCore.Authorization;
using Shared.DataTransferObjects;
using Microsoft.AspNetCore.Mvc;
using Shared.DataTransferObjects.Response;

namespace WebApi.Controllers;

[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[ApiVersion("1.0")]
public class ProductsController(IProductService productsService) : BaseController
{
    [HttpGet]
    [ResponseCache(Duration = 30)]
    [MapToApiVersion("1.0")]
    public async Task<IActionResult> GetAllAsync(
        [FromQuery] int page = 1, 
        [FromQuery] int pageSize = 20
    ) {
        var searchDto = new ProductSearchDto() 
        { 
            Page = page, 
            PageSize = pageSize
        };
        var products = await productsService.GetFilteredAsync(searchDto);
        return Ok(products);
    }
    
    [HttpGet("search/{query}")]
    [ResponseCache(Duration = 30)]
    [MapToApiVersion("1.0")]
    public async Task<IActionResult> FindAsync(
        [FromRoute] string query,
        [FromQuery] int page = 1, 
        [FromQuery] int pageSize = 20)
    {
        var searchDto = new ProductSearchDto()
        {
            Query = query,
            Page = page,
            PageSize = pageSize
        };
        var products = await productsService.GetFilteredAsync(searchDto);
        return Ok(products);
    }
    
    [Authorize]
    [HttpGet("user/")]
    [ResponseCache(Duration = 30)]
    [MapToApiVersion("1.0")]
    public async Task<IActionResult> UsersProductsAsync(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var searchDto = new ProductSearchDto()
        {
            Page = page,
            PageSize = pageSize
        };
        var products = await GetUserProducts(searchDto);
        return Ok(products);
    }
    
    [Authorize]
    [HttpGet("user/search/{query}")]
    [MapToApiVersion("1.0")]
    public async Task<IActionResult> UsersProductsAsync(
        [FromRoute] string query,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var searchDto = new ProductSearchDto()
        {
            Query = query,
            Page = page,
            PageSize = pageSize
        };
        var products = await GetUserProducts(searchDto);
        return Ok(products);
    }
    
    private async Task<IEnumerable<ProductLinkedDto>> GetUserProducts(ProductSearchDto searchDto)
    {
        var userId = GetCurrentUserId();
        return await productsService.GetFilteredAsync(
            searchDto, 
            p => p.Brand.Users.Any(u => u.Id == userId)
        );
    }
}