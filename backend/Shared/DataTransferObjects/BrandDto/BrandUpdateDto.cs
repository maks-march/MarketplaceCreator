using System.ComponentModel.DataAnnotations;

namespace Shared.DataTransferObjects;

public class BrandUpdateDto : BaseDto
{
    [StringLength(80, MinimumLength = 2)]
    public string? Name { get; set; } = null;
}