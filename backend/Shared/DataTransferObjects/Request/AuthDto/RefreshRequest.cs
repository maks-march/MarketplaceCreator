using System.ComponentModel.DataAnnotations;

namespace Shared.DataTransferObjects.Request.AuthDto;

public class RefreshRequest : BaseDto
{
    [Required(ErrorMessage = "Refresh токен обязателен")]
    public required string RefreshToken { get; set; }
}