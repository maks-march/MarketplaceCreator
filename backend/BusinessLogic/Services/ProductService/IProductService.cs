using DataAccess.Models;
using Shared.DataTransferObjects;
using Shared.DataTransferObjects.Response;

namespace BusinessLogic.Services;

public interface IProductService : 
    ICrudService<ProductLinkedDto, ProductCreateDto, ProductUpdateDto>,
    IManyService<Product, ProductLinkedDto, ProductSearchDto>
{ }