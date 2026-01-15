using BusinessLogic.Services.BrandService;
using DataAccess.Models;
using Microsoft.AspNetCore.Mvc;
using Shared.DataTransferObjects.Request.BrandDto;
using Shared.DataTransferObjects.Response;
using WebApi.Controllers.BaseControllers;

namespace WebApi.Controllers.BrandsController;

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