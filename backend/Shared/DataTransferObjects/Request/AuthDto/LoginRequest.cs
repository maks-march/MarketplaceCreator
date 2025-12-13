using System.ComponentModel.DataAnnotations;
using Shared.DataTransferObjects;

namespace DataAccess.Models;

public class LoginRequest : BaseDto
{
    [Required(ErrorMessage = "Логин обязателен")]
    public string EmailOrUsername { get; set; }
    
    [Required(ErrorMessage = "Пароль обязателен")]
    public string Password { get; set; }
}