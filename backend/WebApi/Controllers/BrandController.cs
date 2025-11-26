using BusinessLogic.Services;
using Shared.DataTransferObjects;
using Shared.DataTransferObjects.Response;

namespace WebApi.Controllers;

public class BrandController(IBrandService brandService, IUserService userService) : 
    BaseCrudController<BrandLinkedDto, BrandCreateDto, BrandUpdateDto>(brandService, userService)
{ }