namespace DataAccess.Models;

public class UserBrand
{
    public int UserId { get; set; }
    public User User { get; set; }
    public int BrandId { get; set; }
    public Brand Brand { get; set; }
    
    public static UserBrand Create(User user, Brand brand)
    {
        var userBrand = new UserBrand()
        {
            User = user,
            Brand = brand,
            UserId = user.Id,
            BrandId = brand.Id
        };
        return userBrand;
    }
}