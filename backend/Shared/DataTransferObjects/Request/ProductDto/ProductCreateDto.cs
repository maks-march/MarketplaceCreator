using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Shared.DataTransferObjects;

public class ProductCreateDto : BaseDto
{
    [Required(ErrorMessage = "Имя для продукта обязательно")]
    [StringLength(50, MinimumLength = 3, ErrorMessage = "Имя от 3 до 50 символов")]
    public string? Title { get; set; }
    
    [StringLength(2000, MinimumLength = 5, ErrorMessage = "Описание до 2000 символов")]
    public string Description { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Цена для продукта обязательна")]
    [Range(0.01, double.MaxValue, ErrorMessage = "Цена должна быть больше 0")]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Price { get; set; }
    
    [Required(ErrorMessage = "Указание бренда обязательно")]
    public int BrandId { get; set; }
}