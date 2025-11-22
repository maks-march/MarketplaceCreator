using DataAccess.Models;

namespace BusinessLogic.Services.UserBrandService;

public interface IUserBrandService
{
    Task<IEnumerable<Brand>> GetBrandsOfUserAsync(int userId);
    Task<IEnumerable<User>> GetUsersOfBrandAsync(int brandId);
}