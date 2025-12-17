using BusinessLogic.Services;
using Microsoft.AspNetCore.Mvc;
using Shared.DataTransferObjects;
using Shared.DataTransferObjects.Response;

namespace WebApi.Controllers;

[ApiController]
[Route("api/v{version:apiVersion}/products")]
[ApiVersion("1.0")]
public class ProductController(IProductService productService, IUserService userService) : 
    BaseCrudController<ProductLinkedDto, ProductCreateDto, ProductUpdateDto>(productService, userService)
{ }