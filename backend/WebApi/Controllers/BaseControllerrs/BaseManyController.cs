using BusinessLogic.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shared.DataTransferObjects;

namespace WebApi.Controllers;

[ApiVersion("1.0")]
public class BaseManyController<T,TDto,TSearchDto>(IManyService<T,TDto,TSearchDto> service) : BaseController where TSearchDto : SearchDto, new()
{
    [HttpGet]
    [ResponseCache(Duration = 30)]
    [MapToApiVersion("1.0")]
    public virtual async Task<IActionResult> FindAsync(
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
        var items = await service.GetFilteredAsync(searchDto);
        return Ok(items);
    }
}