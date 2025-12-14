using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using Shared.DataTransferObjects;
using Shared.DataTransferObjects.Response;

namespace DataAccess.Models;

public class Product : BaseModel
{
    [Required]
    public int BrandId { get; set; }
    [Required]
    public string Title { get; set; }
    public string Description { get; set; } = string.Empty;
    public Brand Brand { get; set; }
    
    public ProductCategory ProductCategory { get; set; }   

    public static Product Create(ProductCreateDto dto)
    {
        if (dto == null || dto.Title == null)
            throw new ArgumentNullException(nameof(dto));
        var product = new Product()
        {
            Title = dto.Title,
            Description = dto.Description,
            BrandId = dto.BrandId
        };
        return product;
    }
    
    public void Update(ProductUpdateDto dto)
    {
        Update((BaseDto)dto);
        Title = dto.Title ?? Title;
        Description = dto.Description ?? Description;
    }

    
    
    public ProductDto GetDto()
    {
        return new ProductDto
        {
            Id = Id,
            Created = Created,
            Updated = Updated,
            Title = Title,
            Description = Description
        };
    }
    
    public ProductLinkedDto GetLinkedDto()
    {
        var dto = new ProductLinkedDto();
        dto.CopyFrom(GetDto());
        dto.BrandId = BrandId;
        dto.Brand = Brand.GetDto();
        return dto;
    }
}

