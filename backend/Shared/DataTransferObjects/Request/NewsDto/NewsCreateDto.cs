using System.ComponentModel.DataAnnotations;

namespace Shared.DataTransferObjects;

public class NewsCreateDto : BaseDto
{
    [Required(ErrorMessage = "Имя для продукта обязательно")]
    [StringLength(50, MinimumLength = 3, ErrorMessage = "Имя от 3 до 50 символов")]
    public string? Title { get; set; }
    
    [StringLength(2000, MinimumLength = 5, ErrorMessage = "Описание до 2000 символов")]
    public string Description { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Указание бренда обязательно")]
    public int BrandId { get; set; }
}