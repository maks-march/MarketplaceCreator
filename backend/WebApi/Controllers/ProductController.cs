using System.Security.Authentication;
using System.Security.Claims;
using BusinessLogic.Services;
using Microsoft.AspNetCore.Authorization;
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
        if (id < 1)
            throw new ArgumentException("Id cant be less than 1");
            
        var result = await productService.GetByIdAsync(id);
            
        if (result == null)
            return NotFound($"Product with id {id} not found");
            
        return Ok(result);
    }
    
    [Authorize]
    [HttpPost]
    [MapToApiVersion("1.0")]
    public async Task<IActionResult> CreateAsync([FromBody]ProductCreateDTO productDto)
    {
        await productService.CreateAsync(productDto, GetUserId());
        return NoContent();
    }


    [Authorize]
    [HttpPut("{id:int}")]
    [MapToApiVersion("1.0")]
    public async Task<IActionResult> UpdateAsync(
        [FromRoute]int id, 
        [FromBody]ProductUpdateDTO productDto)
    {
        await productService.UpdateByIdAsync(id, productDto, GetUserId());
        return Ok();
    }
    
    [Authorize]
    [HttpDelete("{id:int}")]
    [MapToApiVersion("1.0")]
    public async Task<IActionResult> DeleteAsync([FromRoute]int id)
    {
        await productService.DeleteByIdAsync(id, GetUserId());
        return Ok();
    }
    
    private int GetUserId()
    {
        if (User.Identity?.IsAuthenticated != null && User.Identity.IsAuthenticated)
            throw new AuthenticationException("Вы не авторизованы");
        return int.Parse(
            User.FindFirst(ClaimTypes.NameIdentifier)!.Value
        );
    }
}