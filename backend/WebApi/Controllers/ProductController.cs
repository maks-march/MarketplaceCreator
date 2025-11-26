using BusinessLogic.Services;
using Shared.DataTransferObjects;
using Shared.DataTransferObjects.Response;

namespace WebApi.Controllers;

public class ProductController(IProductService productService, IUserService userService) : 
    BaseCrudController<ProductLinkedDto, ProductCreateDto, ProductUpdateDto>(productService, userService)
{ }