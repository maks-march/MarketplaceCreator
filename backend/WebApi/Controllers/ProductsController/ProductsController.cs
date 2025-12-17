using BusinessLogic.Services;
using DataAccess.Models;
using Microsoft.AspNetCore.Mvc;
using Shared.DataTransferObjects;
using Shared.DataTransferObjects.Response;

namespace WebApi.Controllers;

[ApiController]
[Route("api/v{version:apiVersion}/products")]
[ApiVersion("1.0")]
public class ProductsController(IProductService productsService) : 
    BaseManyByUserController<Product, ProductLinkedDto, ProductSearchDto>(productsService)
{
    protected override async Task<IEnumerable<ProductLinkedDto>> GetUserItems(ProductSearchDto searchDto)
    {
        var userId = GetCurrentUserId();
        return await productsService.GetFilteredAsync(
            searchDto, 
            p => p.Brand.Users.Any(u => u.Id == userId)
        );
    }
}