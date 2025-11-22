using System.ComponentModel.DataAnnotations;

namespace Shared.DataTransferObjects;

public class ProductCreateDto : BaseDto
{
    [Required(ErrorMessage = "Product name is required")]
    [StringLength(50, MinimumLength = 3)]
    public string? Title { get; set; }
    
    public string Description { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Brand id is required")]
    public int BrandId { get; set; }
}