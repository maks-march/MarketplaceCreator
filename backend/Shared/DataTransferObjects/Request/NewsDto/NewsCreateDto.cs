using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace Shared.DataTransferObjects.Request.NewsDto;

public class NewsCreateDto : BaseDto
{
    [Required(ErrorMessage = "Имя для продукта обязательно")]
    [StringLength(500, MinimumLength = 3, ErrorMessage = "Имя от 3 до 50 символов")]
    public string? Title { get; set; }
    
    public string Description { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Указание бренда обязательно")]
    public int BrandId { get; set; }
    
    public IFormFile[] ImageFiles { get; set; }
}