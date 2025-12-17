using System.ComponentModel.DataAnnotations;
using Shared.DataTransferObjects;
using Shared.DataTransferObjects.Response;

namespace DataAccess.Models;

public sealed class Brand : 
    BaseModel, IBaseModel<Brand, BrandLinkedDto, BrandCreateDto, BrandUpdateDto>
{
    [Required]
    public string Name { get; set; }

    public string Description { get; set; } = string.Empty;
    
    public ICollection<User> Users { get; set; } = new List<User>();
    
    public ICollection<Product> Products { get; set; } = new List<Product>();
    
    public ICollection<News> News { get; set; } = new List<News>();

    public static Brand Create(BrandCreateDto dto)
    {
        if (dto == null || dto.Name == null)
            throw new ArgumentNullException(nameof(dto));
        var brand = new Brand()
        {
            Name = dto.Name,
            Description = dto.Description ?? string.Empty,
        };
        return brand;
    }
    
    public void Update(BrandUpdateDto dto)
    {
        Update((BaseDto)dto);
        Name = dto.Name ?? Name;
        Description = dto.Description ?? Description;
    }
    
    public BrandDto GetUnlinkedDto()
    {
        return new BrandDto
        {
            Id = Id,
            Created = Created,
            Updated = Updated,
            Description = Description,
            Name = Name
        };
    }

    public override BrandLinkedDto GetDto()
    {
        var dto = new BrandLinkedDto();
        dto.CopyFrom(GetUnlinkedDto());
        dto.Users = Users
            .Select(u => u.GetUnlinkedDto())
            .ToList();
        
        dto.Products = Products
            .Select(p => p.GetUnlinkedDto())
            .ToList();
        
        
        dto.News = News
            .Select(p => p.GetUnlinkedDto())
            .ToList();
        return dto;
    }
}