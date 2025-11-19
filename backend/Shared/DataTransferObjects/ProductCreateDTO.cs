using System.ComponentModel.DataAnnotations;

namespace Shared.DataTransferObjects;

public class ProductCreateDTO
{
    [Required(ErrorMessage = "Product name is required")]
    public string? Title { get; set; }
    public string? Description { get; set; } = null;
}