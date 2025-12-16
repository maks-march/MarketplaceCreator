using BusinessLogic.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

[ApiVersion("1.0")]
public class BaseCrudController<TDto, TCreateDto, TUpdateDto>(
        ICrudService<TDto, TCreateDto, TUpdateDto> service, 
        IUserService userService) : 
    NeedAuthController(userService)
{
    [HttpGet("{id:int}")]
    [ResponseCache(Duration = 30)]
    [MapToApiVersion("1.0")]
    public virtual async Task<IActionResult> GetAsync([FromRoute]int id)
    {
        this.EnsureValidateId(id);
            
        var result = await service.GetByIdAsync(id);
        
        return Ok(result);
    }
    
    [Authorize]
    [HttpPost]
    [MapToApiVersion("1.0")]
    public virtual async Task<IActionResult> CreateAsync([FromBody]TCreateDto createDto)
    {
        var user = await GetCurrentUser();
        await service.CreateAsync(createDto, user);
        return NoContent();
    }
    
    [Authorize]
    [HttpPatch("{id:int}")]
    [MapToApiVersion("1.0")]
    public virtual async Task<IActionResult> UpdateAsync(
        [FromRoute]int id,
        [FromBody]TUpdateDto updateDto)
    {
        this.EnsureValidateId(id);
        var user = await GetCurrentUser();
        await service.UpdateByIdAsync(id, updateDto, user);
        return NoContent();
    }
    
    [Authorize]
    [HttpDelete("{id:int}")]
    [MapToApiVersion("1.0")]
    public virtual async Task<IActionResult> DeleteAsync([FromRoute]int id)
    {
        this.EnsureValidateId(id);
        var userId = GetCurrentUserId();
        await service.DeleteByIdAsync(id, userId);
        return Ok();
    }
}