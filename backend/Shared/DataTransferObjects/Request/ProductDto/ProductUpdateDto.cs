using System.ComponentModel.DataAnnotations;

namespace Shared.DataTransferObjects;

public class ProductUpdateDto : BaseDto
{
    [StringLength(50, MinimumLength = 3, ErrorMessage = "Имя от 3 до 50 символов")]
    public string? Title { get; set; } = null;
    
    [Range(0.01, double.MaxValue, ErrorMessage = "Цена должна быть больше 0")]
    public decimal? Price { get; set; }
    
    [StringLength(2000, ErrorMessage = "Описание до 2000 символов")]
    public string? Description { get; set; } = null;
}