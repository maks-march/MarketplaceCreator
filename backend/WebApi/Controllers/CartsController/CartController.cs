using BusinessLogic.Services.ProductService;
using BusinessLogic.Services.UserService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shared.DataTransferObjects.Request.CartDto;
using WebApi.Controllers.BaseControllerrs;

namespace WebApi.Controllers.CartsController;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/carts")]
public class CartController(ICartService cartService, IProductService productService) : BaseController
{
    [Authorize]
    [MapToApiVersion("1.0")]
    [HttpPatch("{id:int}/add/{productId:int}")]
    public async Task<IActionResult> UpdateAddAsync([FromRoute] int id, [FromRoute] int productId)
    {
        var updateDto = new CartUpdateDto()
        {
            IsAdding = true,
            Product = await productService.GetByIdModelAsync(productId)
        };
        await cartService.UpdateAsync(id, updateDto, GetCurrentUserId());
        return NoContent();
    }
    
    [Authorize]
    [MapToApiVersion("1.0")]
    [HttpPatch("{id:int}/remove/{productId:int}")]
    public async Task<IActionResult> UpdateDeleteAsync([FromRoute] int id, [FromRoute] int productId)
    {
        var updateDto = new CartUpdateDto()
        {
            IsAdding = false,
            Product = await productService.GetByIdModelAsync(productId)
        };
        await cartService.UpdateAsync(id, updateDto, GetCurrentUserId());
        return NoContent();
    }
    
    [Authorize]
    [MapToApiVersion("1.0")]
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetByIdAsync([FromRoute] int id)
    {
        var cart = await cartService.GetByIdAsync(id);
        return Ok(cart);
    }
}