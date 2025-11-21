namespace DataAccess.Models;

public class UserBrand
{
    public int UserId { get; set; }
    public User User { get; set; }
    
    public int BrandId { get; set; }
    public Brand Brand { get; set; }
}