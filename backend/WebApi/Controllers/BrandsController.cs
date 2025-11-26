using BusinessLogic.Services;
using DataAccess.Models;
using Shared.DataTransferObjects;
using Shared.DataTransferObjects.Response;

namespace WebApi.Controllers;

public class BrandsController(IBrandService brandService) : 
    BaseManyController<Brand, BrandLinkedDto, BrandSearchDto>(brandService)
{
    protected override async Task<IEnumerable<BrandLinkedDto>> GetUserItems(BrandSearchDto searchDto)
    {
        var userId = GetCurrentUserId();
        return await brandService.GetFilteredAsync(
            searchDto, 
            p => p.Users.Any(u => u.Id == userId)
        );
    }
}