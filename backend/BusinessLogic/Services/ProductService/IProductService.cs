using DataAccess.Models;
using Shared.DataTransferObjects.Request.ProductDto;
using Shared.DataTransferObjects.Response;

namespace BusinessLogic.Services.ProductService;

public interface IProductService : 
    ICrudService<Product, ProductLinkedDto, ProductCreateDto, ProductUpdateDto>,
    IManyService<Product, ProductLinkedDto, ProductSearchDto>
{ }