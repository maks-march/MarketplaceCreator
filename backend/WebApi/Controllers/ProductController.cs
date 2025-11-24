using System.Security.Authentication;
using BusinessLogic.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shared.DataTransferObjects;

namespace WebApi.Controllers;

[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
public class ProductController(IProductService productService) : BaseController
{
    [HttpGet("{id:int}")]
    [ResponseCache(Duration = 30)]
    [MapToApiVersion("1.0")]
    public async Task<IActionResult> GetAsync([FromRoute]int id)
    { 
        this.EnsureValidateId(id);
            
        var result = await productService.GetByIdAsync(id);
            
        return Ok(result);
    }
    
    [Authorize]
    [HttpPost]
    [MapToApiVersion("1.0")]
    public async Task<IActionResult> CreateAsync([FromBody]ProductCreateDto productDto)
    {
        await productService.CreateAsync(productDto);
        return NoContent();
    }


    [Authorize]
    [HttpPut("{id:int}")]
    [MapToApiVersion("1.0")]
    public async Task<IActionResult> UpdateAsync(
        [FromRoute]int id, 
        [FromBody]ProductUpdateDto productDto)
    {
        this.EnsureValidateId(id);
        EnsureUserAuth(id);
        await productService.UpdateByIdAsync(id, productDto);
        return Ok();
    }
    
    [Authorize]
    [HttpDelete("{id:int}")]
    [MapToApiVersion("1.0")]
    public async Task<IActionResult> DeleteAsync([FromRoute]int id)
    {
        this.EnsureValidateId(id);
        EnsureUserAuth(id);
        await productService.DeleteByIdAsync(id);
        return Ok();
    }

    private async void EnsureUserAuth(int productId)
    {
        if (!await IsUserRedactor(productId))
            throw new AuthenticationException("Этот пользователь не может редактировать данный продукт");
    }
    
    private async Task<bool> IsUserRedactor(int productId)
    {
        var product =  await productService.GetByIdAsync(productId);
        var userId = GetCurrentUserId();
        var isRedactorOfBrand = product.Brand.Users.Any(u => u.Id == userId);
        return isRedactorOfBrand;
    }
}