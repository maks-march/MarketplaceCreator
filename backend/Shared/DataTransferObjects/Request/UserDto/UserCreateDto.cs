using System.ComponentModel.DataAnnotations;

namespace Shared.DataTransferObjects;

public class UserCreateDto : BaseDto
{
    [Required(ErrorMessage = "Логин обязателен")]
    [StringLength(50, MinimumLength = 3)]
    public required string Username { get; set; }
    
    [Required(ErrorMessage = "Email обязателен")]
    [EmailAddress(ErrorMessage = "Некорректный формат email")]
    public required string Email { get; set; }
    
    [Required(ErrorMessage = "Имя обязательно")]
    [StringLength(50, MinimumLength = 2)]
    public required string Name { get; set; }
    
    [Required(ErrorMessage = "Фамилия обязательна")]
    [StringLength(50, MinimumLength = 2)]
    public required string Surname { get; set; }
    
    [StringLength(50)]
    public string Patronymic { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Пароль обязателен")]
    [StringLength(100, MinimumLength = 6, ErrorMessage = "Пароль должен быть от 6 до 100 символов")]
    public required string Password { get; set; }
}