using BusinessLogic;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
public class ProductController(IProductService productService) : ControllerBase
{
    [HttpGet("{id:int}")]
    [ResponseCache(Duration = 30)]
    [MapToApiVersion("1.0")]
    public async Task<IActionResult> GetAsync([FromRoute]int id)
    {
        var result = await productService.GetByIdAsync(id);
        return Ok(result);
    }

    [HttpPost]
    [MapToApiVersion("1.0")]
    public async Task<IActionResult> CreateAsync(string text)
    {
        await productService.CreateAsync(text);
        return NoContent();
    }
    
    [HttpPut("{id:int}")]
    [MapToApiVersion("1.0")]
    public async Task<IActionResult> UpdateAsync(
        [FromRoute]int id, 
        [FromBody]string title
    ) {
        await productService.UpdateByIdAsync(id, title);
        return Ok();
    }
    
    [HttpDelete("{id:int}")]
    [MapToApiVersion("1.0")]
    public async Task<IActionResult> DeleteAsync([FromRoute]int id)
    {
        await productService.DeleteByIdAsync(id);
        return Ok();
    }
}