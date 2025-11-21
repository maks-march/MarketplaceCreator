using System.ComponentModel.DataAnnotations;

namespace Shared.DataTransferObjects;

public class ProductCreateDTO
{
    [Required(ErrorMessage = "Product name is required")]
    public string? Title { get; set; }
    public string Description { get; set; } = string.Empty;
    [Required(ErrorMessage = "Brand name is required")]
    public string BrandName { get; set; } = string.Empty;
}