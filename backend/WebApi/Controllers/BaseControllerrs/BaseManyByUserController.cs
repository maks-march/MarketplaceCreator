using BusinessLogic.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shared.DataTransferObjects;

namespace WebApi.Controllers;

[ApiVersion("1.0")]
public class BaseManyByUserController<T,TDto,TSearchDto>(IManyService<T,TDto,TSearchDto> service) : 
    BaseManyController<T,TDto,TSearchDto>(service) where TSearchDto : SearchDto, new()
{
    [Authorize]
    [HttpGet("user")]
    [MapToApiVersion("1.0")]
    public virtual async Task<IActionResult> UserItemsSearchAsync(
        [FromQuery] string query = "",
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var searchDto = new TSearchDto()
        {
            Query = query,
            Page = page,
            PageSize = pageSize
        };
        var items = await GetUserItems(searchDto);
        return Ok(items);
    }

    protected virtual async Task<IEnumerable<TDto>> GetUserItems(TSearchDto searchDto)
    {
        return await service.GetFilteredAsync(
            searchDto, 
            null
        );
    }
}