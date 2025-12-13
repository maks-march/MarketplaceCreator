using System.ComponentModel.DataAnnotations;

namespace DataAccess.Models;

public class RefreshResponse
{
    [Required(ErrorMessage = "Новый токен обязателен")]
    public required string AccessToken { get; set; }
    public string? RefreshToken { get; set; }
}