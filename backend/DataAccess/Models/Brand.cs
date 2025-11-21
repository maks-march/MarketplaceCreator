using System.ComponentModel.DataAnnotations;

namespace DataAccess.Models;

public class Brand
{
    public int Id { get; set; }
    
    [Required]
    public string Name { get; set; }
    
    public ICollection<UserBrand> UserBrand { get; set; } = new List<UserBrand>();
}