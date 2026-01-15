using System.ComponentModel.DataAnnotations;

namespace Shared.DataTransferObjects.Request.BrandDto;

public class BrandCreateDto : BaseDto
{
    [Required(ErrorMessage = "Название бренда обязательно")]
    [StringLength(800, MinimumLength = 2, ErrorMessage = "Название бренда оn 2 до 80 символов")]
    public required string Name { get; set; }

    [StringLength(200000, ErrorMessage = "Описание бренда оn 5 до 2000 символов")]
    public string Description { get; set; } = string.Empty;
}