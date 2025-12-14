using System.ComponentModel.DataAnnotations;

namespace Shared.DataTransferObjects;

public class BrandUpdateDto : BaseDto
{
    [StringLength(80, MinimumLength = 2)]
    public string? Name { get; set; } = null;
    
    [StringLength(2000, MinimumLength = 5)]
    public string? Description { get; set; } = null;
}