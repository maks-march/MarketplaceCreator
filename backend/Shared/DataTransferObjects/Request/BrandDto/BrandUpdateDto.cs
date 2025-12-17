using System.ComponentModel.DataAnnotations;

namespace Shared.DataTransferObjects;

public class BrandUpdateDto : BaseDto
{
    [StringLength(80, MinimumLength = 2, ErrorMessage = "Название бренда оn 2 до 80 символов")]
    public string? Name { get; set; } = null;
    
    [StringLength(2000, MinimumLength = 5, ErrorMessage = "Описание бренда оn 5 до 2000 символов")]
    public string? Description { get; set; } = null;
}