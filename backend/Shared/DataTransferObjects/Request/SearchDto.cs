using System.ComponentModel.DataAnnotations;

namespace Shared.DataTransferObjects;

public class SearchDto : BaseDto
{
    [Required(ErrorMessage = "Поисковый запрос обязателен")]
    [StringLength(150, ErrorMessage = "Запрос не должен превышать 150 символов")]
    public string Query { get; set; } = string.Empty;

    [Range(1, int.MaxValue, ErrorMessage = "Номер страницы должен быть положительным числом")]
    public int Page { get; set; } = 1;

    [Range(1, 50, ErrorMessage = "Размер страницы должен быть от 1 до 50")]
    public int PageSize { get; set; } = 20;
}