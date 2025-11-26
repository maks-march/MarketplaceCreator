using BusinessLogic.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shared.DataTransferObjects;

namespace WebApi.Controllers;

[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[ApiVersion("1.0")]
public class BaseManyController<T,TDto,TSearchDto>(IManyService<T,TDto,TSearchDto> service) : BaseController where TSearchDto : SearchDto, new()
{
    [HttpGet]
    [ResponseCache(Duration = 30)]
    [MapToApiVersion("1.0")]
    public async Task<IActionResult> GetAllAsync(
        [FromQuery] int page = 1, 
        [FromQuery] int pageSize = 20
    ) {
        var searchDto = new TSearchDto() 
        { 
            Page = page, 
            PageSize = pageSize
        };
        var items = await service.GetFilteredAsync(searchDto);
        return Ok(items);
    }
    
    [HttpGet("search/{query}")]
    [ResponseCache(Duration = 30)]
    [MapToApiVersion("1.0")]
    public async Task<IActionResult> FindAsync(
        [FromRoute] string query,
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
    
    [Authorize]
    [HttpGet("user/")]
    [ResponseCache(Duration = 30)]
    [MapToApiVersion("1.0")]
    public async Task<IActionResult> UserProductsAsync(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var searchDto = new TSearchDto()
        {
            Page = page,
            PageSize = pageSize
        };
        var items = await GetUserItems(searchDto);
        return Ok(items);
    }
    
    [Authorize]
    [HttpGet("user/search/{query}")]
    [MapToApiVersion("1.0")]
    public async Task<IActionResult> UsersProductsAsync(
        [FromRoute] string query,
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