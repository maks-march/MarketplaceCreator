using System.Text;
using BusinessLogic.Services.ProductService;
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
    
    [Authorize]
    [MapToApiVersion("1.0")]
    [HttpPost("payment")]
    public async Task<IActionResult> Payment()
    {
        var cart = await cartService.GetByUserIdAsync(GetCurrentUserId());
        using var client = new HttpClient();
        client.BaseAddress = new Uri("https://api.yookassa.ru/v3/");
    
        var shopId = "1249161";
        var secretKey = "test_s8J-7PDyICgyGvtCG5CMzraLaA1k-SJ5Kp210ua4Fd4";
        var idempotenceKey = Guid.NewGuid().ToString();
    
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue(
            "Basic", 
            Convert.ToBase64String(Encoding.UTF8.GetBytes($"{shopId}:{secretKey}"))
        );
        client.DefaultRequestHeaders.Add("Idempotence-Key", idempotenceKey);
        
        var paymentData = new
        {
            amount = new { value = cart.Total, currency = "RUB" },
            capture = true,
            confirmation = new { type = "redirect", return_url = "http://localhost/" },
            description = "Оплата корзины"
        };
    
        var json = System.Text.Json.JsonSerializer.Serialize(paymentData);
        var content = new StringContent(json, Encoding.UTF8, "application/json");
    
        var response = await client.PostAsync("payments", content);
        var result = await response.Content.ReadAsStringAsync();
    
        return Ok(result);
    }
}