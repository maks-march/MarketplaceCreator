using BusinessLogic.Services;
using DataAccess.Models;
using Shared.DataTransferObjects;
using Shared.DataTransferObjects.Response;

namespace WebApi.Controllers;

public class ProductsController(IProductService productsService) : 
    BaseManyController<Product, ProductLinkedDto, ProductSearchDto>(productsService)
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