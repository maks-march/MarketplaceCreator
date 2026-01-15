using System.ComponentModel.DataAnnotations;

namespace Shared.DataTransferObjects.Request.NewsDto;

public class NewsUpdateDto : BaseDto
{
    [StringLength(500, MinimumLength = 3, ErrorMessage = "Заголовок от 3 до 500 символов")]
    public string? Title { get; set; } = null;
    
    public string? Description { get; set; } = null;
}