using System.ComponentModel.DataAnnotations;

namespace Shared.DataTransferObjects;

public class UserUpdateDto : BaseDto
{
    [StringLength(50, MinimumLength = 3, ErrorMessage = "Логин от 3 до 50 символов")]
    public string? Username { get; set; } = null;
    
    [EmailAddress(ErrorMessage = "Некорректный формат email")]
    public string? Email { get; set; } = null;
    
    [StringLength(50, MinimumLength = 2, ErrorMessage = "Имя от 2 до 50 символов")]
    public string? Name { get; set; } = null;
    
    [StringLength(50, MinimumLength = 2, ErrorMessage = "Фамилия от 2 до 50 символов")]
    public string? Surname { get; set; } = null;
    
    [StringLength(50, ErrorMessage = "Отчество не длиннее 50 символов")]
    public string? Patronymic { get; set; } = null;
}