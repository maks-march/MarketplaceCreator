using BusinessLogic;
using Microsoft.AspNetCore.Mvc;

namespace WebApi;

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
    public async Task<IActionResult> GetAsync([FromRoute]int id)
    {
        var result = await productService.GetByIdAsync(id);
        return Ok(result);
    }
    
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateAsync([FromRoute]int id, [FromBody]string title)
    {
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