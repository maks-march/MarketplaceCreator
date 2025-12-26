using System.ComponentModel.DataAnnotations;
using Shared.DataTransferObjects;

namespace DataAccess.Models;

public class LoginRequest : BaseDto
{
    [Required(ErrorMessage = "Логин обязателен")]
    [StringLength(50, MinimumLength = 2, ErrorMessage = "Логин от 2 до 50 символов")]
    public string EmailOrUsername { get; set; }
    
    [Required(ErrorMessage = "Пароль обязателен")]
    [StringLength(100, MinimumLength = 6, ErrorMessage = "Пароль должен быть от 6 до 100 символов")]
    public string Password { get; set; }
}