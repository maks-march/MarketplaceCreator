using DataAccess.Models;
using Shared.DataTransferObjects;
using Shared.DataTransferObjects.Response;

namespace DataAccess.Repositories;

public interface IProductRepository : ICrudRepository<Product, ProductUpdateDto>
{
}