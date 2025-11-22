using DataAccess.Models;
using DataAccess.Repositories.UserBrandRepository;

namespace BusinessLogic.Services.UserBrandService;

public class UserBrandService(IUserBrandRepository userBrandRepository) : IUserBrandService
{
    public async Task<IEnumerable<Brand>> GetBrandsOfUserAsync(int userId)
    {
        return await userBrandRepository.GetBrandsOfUserAsync(userId);
    }

    public async Task<IEnumerable<User>> GetUsersOfBrandAsync(int brandId)
    {
        return await userBrandRepository.GetUsersOfBrandAsync(brandId);
    }
}