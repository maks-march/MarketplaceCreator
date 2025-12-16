using BusinessLogic.Services;
using Microsoft.AspNetCore.Mvc;
using Shared.DataTransferObjects;
using Shared.DataTransferObjects.Response;

namespace WebApi.Controllers;

[ApiController]
[Route("api/v{version:apiVersion}/brands")]
[ApiVersion("1.0")]
public class BrandController(IBrandService brandService, IUserService userService) : 
    BaseCrudController<BrandLinkedDto, BrandCreateDto, BrandUpdateDto>(brandService, userService)
{ }