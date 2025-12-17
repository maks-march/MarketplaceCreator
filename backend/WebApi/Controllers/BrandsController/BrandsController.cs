using BusinessLogic.Services;
using DataAccess.Models;
using Microsoft.AspNetCore.Mvc;
using Shared.DataTransferObjects;
using Shared.DataTransferObjects.Response;

namespace WebApi.Controllers;

[ApiController]
[Route("api/v{version:apiVersion}/brands")]
[ApiVersion("1.0")]
public class BrandsController(IBrandService brandService) : 
    BaseManyByUserController<Brand, BrandLinkedDto, BrandSearchDto>(brandService)
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