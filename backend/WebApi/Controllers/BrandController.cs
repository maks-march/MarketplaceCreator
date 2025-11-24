using System.Security.Authentication;
using System.Security.Claims;
using BusinessLogic.Services;
using DataAccess.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shared.DataTransferObjects;

namespace WebApi.Controllers;

[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
public class BrandController(IBrandService brandService, IUserService userService) : NeedAuthController(userService)
{
    [HttpGet("{id:int}")]
    [ResponseCache(Duration = 30)]
    [MapToApiVersion("1.0")]
    public async Task<IActionResult> GetAsync([FromRoute]int id)
    {
        this.EnsureValidateId(id);
            
        var result = await brandService.GetByIdAsync(id);
        
        return Ok(result);
    }
    
    [Authorize]
    [HttpPost]
    [MapToApiVersion("1.0")]
    public async Task<IActionResult> CreateAsync([FromBody]BrandCreateDto brandCreateDto)
    {
        var user = await GetCurrentUser();
        await brandService.CreateAsync(brandCreateDto, user);
        return NoContent();
    }
    
    [Authorize]
    [HttpPut("{id:int}")]
    [MapToApiVersion("1.0")]
    public async Task<IActionResult> UpdateAsync(
        [FromRoute]int id,
        [FromBody]BrandUpdateDto brandUpdateDto)
    {
        var userId = GetCurrentUserId();
        await brandService.UpdateByIdAsync(id, brandUpdateDto, userId);
        return NoContent();
    }
    
    [Authorize]
    [HttpDelete("{id:int}")]
    [MapToApiVersion("1.0")]
    public async Task<IActionResult> DeleteAsync([FromRoute]int id)
    {
        this.EnsureValidateId(id);
        var userId = GetCurrentUserId();
        await brandService.DeleteByIdAsync(id, userId);
        return Ok();
    }
}