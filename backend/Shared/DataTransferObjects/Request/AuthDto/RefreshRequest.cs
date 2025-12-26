using System.ComponentModel.DataAnnotations;
using Shared.DataTransferObjects;

namespace DataAccess.Models;

public class RefreshRequest : BaseDto
{
    [Required(ErrorMessage = "Refresh токен обязателен")]
    public required string RefreshToken { get; set; }
}