using BusinessLogic.Services.BrandService;
using BusinessLogic.Services.UserService;
using DataAccess.Models;
using Microsoft.AspNetCore.Mvc;
using Shared.DataTransferObjects.Request.BrandDto;
using Shared.DataTransferObjects.Response;
using WebApi.Controllers.BaseControllerrs;

namespace WebApi.Controllers.BrandsController;

[ApiController]
[Route("api/v{version:apiVersion}/brands")]
[ApiVersion("1.0")]
public class BrandController(IBrandService brandService, IUserService userService) : 
    BaseCrudController<Brand, BrandLinkedDto, BrandCreateDto, BrandUpdateDto>(brandService, userService)
{ }