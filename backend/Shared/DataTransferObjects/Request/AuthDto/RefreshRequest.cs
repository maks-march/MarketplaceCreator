using System.ComponentModel.DataAnnotations;

namespace DataAccess.Models;

public class RefreshRequest
{
    [Required(ErrorMessage = "Refresh токен обязателен")]
    public required string RefreshToken { get; set; }
}