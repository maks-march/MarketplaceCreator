using System.ComponentModel.DataAnnotations;
using Shared.DataTransferObjects;
using Shared.DataTransferObjects.Response;

namespace DataAccess.Models;

public class Brand : BaseModel
{
    [Required]
    public string Name { get; set; }
    
    public ICollection<User> Users { get; set; } = new List<User>();
    
    public ICollection<Product> Products { get; set; } = new List<Product>();

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
    
    
    
    public BrandDto GetDto()
    {
        return new BrandDto
        {
            Id = Id,
            Created = Created,
            Updated = Updated,
            Name = Name
        };
    }

    public BrandLinkedDto GetLinkedDto()
    {
        var dto = new BrandLinkedDto();
        dto.CopyFrom(GetDto());
        dto.Users = Users
            .Select(u => u.GetDto())
            .ToList();
        
        dto.Products = Products
            .Select(p => p.GetDto())
            .ToList();
        return dto;
    }
}