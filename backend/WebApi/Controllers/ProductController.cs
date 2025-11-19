using BusinessLogic;
using Microsoft.AspNetCore.Mvc;
using Shared.DataTransferObjects;

namespace WebApi.Controllers;

[ApiController]
[Route("api/products")]
public class ProductsController(IProductService productsService) : ControllerBase
{
    [HttpGet]
    [ResponseCache(Duration = 30)]
    public async Task<IActionResult> GetAllAsync(
        [FromQuery] int page = 1, 
        [FromQuery] int pageSize = 20)
    {
        var searchDto = new ProductSearchDTO() 
        { 
            Page = page, 
            PageSize = pageSize
        };
        var products = await productsService.GetAllAsync(searchDto);
        return Ok(products);
    }
    
    [HttpGet("search/{query}")]
    public async Task<IActionResult> FindAsync(ProductSearchDTO query)
    {
        var products = await productsService.FindAsync(query);
        return Ok(products);
    }
}

[ApiController]
[Route("product")]
public class ProductController(IProductService productService) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> CreateAsync(string text)
    {
        await productService.CreateAsync(text);
        return NoContent();
    }
    
    [HttpGet("{id:int}")]
    [ResponseCache(Duration = 30)]
    public async Task<IActionResult> GetAsync([FromRoute]int id)
    {
        var result = await productService.GetByIdAsync(id);
        return Ok(result);
    }
    
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateAsync(
        [FromRoute]int id, 
        [FromBody]string title
    ) {
        await productService.UpdateByIdAsync(id, title);
        return Ok();
    }
    
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteAsync([FromRoute]int id)
    {
        await productService.DeleteByIdAsync(id);
        return Ok();
    }
}