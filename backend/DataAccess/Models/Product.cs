using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Shared.DataTransferObjects;
using Shared.DataTransferObjects.Response;

namespace DataAccess.Models;

public sealed class Product : 
    BaseModel,
    IBaseModel<Product, ProductLinkedDto, ProductCreateDto, ProductUpdateDto>
{
    [Required]
    public int BrandId { get; set; }
    
    [Required]
    public string Title { get; set; }
    
    public string Description { get; set; } = string.Empty;
    
    public string[] ImageLinks { get; set; }
    
    [Required(ErrorMessage = "Цена для продукта обязательна")]
    [Range(0.01, double.MaxValue, ErrorMessage = "Цена должна быть больше 0")]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Price { get; set; }
    
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
            Price = dto.Price,
            ImageLinks = dto.ImageLinks,
            BrandId = dto.BrandId
        };
        return product;
    }
    
    public void Update(ProductUpdateDto dto)
    {
        Update((BaseDto)dto);
        Title = dto.Title ?? Title;
        Description = dto.Description ?? Description;
        Price = dto.Price ?? Price;
    }

    public ProductDto GetUnlinkedDto()
    {
        return new ProductDto
        {
            Id = Id,
            Created = Created,
            Updated = Updated,
            Title = Title,
            Description = Description,
            Price = Price,
            ImageLinks = ImageLinks,
        };
    }

    public override ProductLinkedDto GetDto()
    {
        var dto = new ProductLinkedDto();
        dto.CopyFrom(GetUnlinkedDto());
        dto.BrandId = BrandId;
        dto.Brand = Brand.GetDto();
        return dto;
    }
}

