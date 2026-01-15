using BusinessLogic.Services.ProductService;
using BusinessLogic.Services.UserService;
using DataAccess.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shared.DataTransferObjects.Request.ProductDto;
using Shared.DataTransferObjects.Response;
using WebApi.Controllers.BaseControllers;

namespace WebApi.Controllers.ProductsController;

[ApiController]
[Route("api/v{version:apiVersion}/products")]
[ApiVersion("1.0")]
public class ProductController(IProductService productService, IUserService userService) :
    BaseCrudController<Product, ProductLinkedDto, ProductCreateDto, ProductUpdateDto>(productService, userService)
{
    [Authorize]
    [MapToApiVersion("1.0")]
    [Consumes("multipart/form-data")]
    public override async Task<IActionResult> CreateAsync([FromForm]ProductCreateDto createDto)
    {
        var user = await GetCurrentUser();
        await productService.CreateAsync(createDto, user);
        return NoContent();
    }
}