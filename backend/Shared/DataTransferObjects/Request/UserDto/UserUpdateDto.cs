using System.ComponentModel.DataAnnotations;

namespace Shared.DataTransferObjects;

public class UserUpdateDto : BaseDto
{
    [StringLength(50, MinimumLength = 3)]
    public string? Username { get; set; } = null;
    
    [EmailAddress(ErrorMessage = "Некорректный формат email")]
    public string? Email { get; set; } = null;
    
    [StringLength(50, MinimumLength = 2)]
    public string? Name { get; set; } = null;
    
    [StringLength(50, MinimumLength = 2)]
    public string? Surname { get; set; } = null;
    
    [StringLength(50)]
    public string? Patronymic { get; set; } = null;
}