using BusinessLogic;
using Microsoft.AspNetCore.Mvc;
using Shared.DataTransferObjects;
using Shared.Exceptions;

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
        try
        {
            if (id < 1)
                throw new ArgumentException("Id cant be less than 1");
            
            var result = await productService.GetByIdAsync(id);
            
            if (result == null)
                return NotFound($"Product with id {id} not found");
            
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost]
    [MapToApiVersion("1.0")]
    public async Task<IActionResult> CreateAsync([FromBody]ProductCreateDTO productDto)
    {
        try
        {
            await productService.CreateAsync(productDto);
            return NoContent();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Internal server error"); // 500
        }
    }
    
    [HttpPut("{id:int}")]
    [MapToApiVersion("1.0")]
    public async Task<IActionResult> UpdateAsync(
        [FromRoute]int id, 
        [FromBody]ProductUpdateDTO productDto)
    {
        try
        {
            await productService.UpdateByIdAsync(id, productDto);
            return Ok();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (NotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Internal server error");
        }
    }
    
    [HttpDelete("{id:int}")]
    [MapToApiVersion("1.0")]
    public async Task<IActionResult> DeleteAsync([FromRoute]int id)
    {
        try
        {
            await productService.DeleteByIdAsync(id);
            return Ok();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Internal server error");
        }
    }
}