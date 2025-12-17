using System.ComponentModel.DataAnnotations;

namespace Shared.DataTransferObjects;

public class NewsUpdateDto : BaseDto
{
    [StringLength(50, MinimumLength = 3, ErrorMessage = "Имя от 3 до 50 символов")]
    public string? Title { get; set; } = null;
    
    [StringLength(2000, ErrorMessage = "Описание до 2000 символов")]
    public string? Description { get; set; } = null;
}