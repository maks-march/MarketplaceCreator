using DataAccess.Models;
using DataAccess.Repositories.CrudRepository;
using Shared.DataTransferObjects.Request.ProductDto;

namespace DataAccess.Repositories.ProductRepository;

public interface IProductRepository : ICrudRepository<Product, ProductUpdateDto>
{
}