using System.ComponentModel.DataAnnotations;

namespace Shared.DataTransferObjects;

public class BrandCreateDto : BaseDto
{
    [Required(ErrorMessage = "Brand name is required")]
    [StringLength(80, MinimumLength = 2)]
    public required string Name { get; set; }
}