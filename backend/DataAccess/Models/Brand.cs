using System.ComponentModel.DataAnnotations;
using Shared.DataTransferObjects;

namespace DataAccess.Models;

public class Brand : BaseModel
{
    [Required]
    public string Name { get; set; }
    
    public ICollection<UserBrand> UserBrand { get; set; } = new List<UserBrand>();
    
    public static Brand Create(BrandCreateDto dto)
    {
        if (dto == null || dto.Name == null)
            throw new ArgumentNullException(nameof(dto));
        var brand = new Brand()
        {
            Name = dto.Name,
        };
        return brand;
    }

    public void Update(BrandUpdateDto dto)
    {
        Update((BaseDto)dto);
        Name = dto.Name ?? Name;
    }
}