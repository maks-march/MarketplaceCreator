using System.ComponentModel.DataAnnotations;

namespace Shared.DataTransferObjects.Response;

public class RefreshResponse
{
    [Required(ErrorMessage = "Новый токен обязателен")]
    public required string AccessToken { get; set; }
    public string? RefreshToken { get; set; }
}