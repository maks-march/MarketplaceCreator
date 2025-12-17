using System.ComponentModel.DataAnnotations;

namespace Shared.DataTransferObjects;

public class UserCreateDto
{
    [Required(ErrorMessage = "Логин обязателен")]
    [StringLength(50, MinimumLength = 3, ErrorMessage = "Логин от 3 до 50 символов")]
    public required string Username { get; set; }
    
    [Required(ErrorMessage = "Email обязателен")]
    [EmailAddress(ErrorMessage = "Некорректный формат email")]
    public required string Email { get; set; }
    
    [Required(ErrorMessage = "Имя обязательно")]
    [StringLength(50, MinimumLength = 2, ErrorMessage = "Имя от 2 до 50 символов")]
    public required string Name { get; set; }
    
    [Required(ErrorMessage = "Фамилия обязательна")]
    [StringLength(50, MinimumLength = 2, ErrorMessage = "Фамилия от 2 до 50 символов")]
    public required string Surname { get; set; }
    
    [StringLength(50, ErrorMessage = "Отчество не больше 50 символов")]
    public string Patronymic { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Пароль обязателен")]
    [StringLength(100, MinimumLength = 6, ErrorMessage = "Пароль должен быть от 6 до 100 символов")]
    public required string Password { get; set; }
}