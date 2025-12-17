using System.ComponentModel.DataAnnotations;

namespace Shared.DataTransferObjects;

public class NewsSearchDto : SearchDto
{
    // public string Category { get; set; }

    [Range(0, double.MaxValue, ErrorMessage = "Минимальная цена не может быть отрицательной")]
    public decimal? MinPrice { get; set; } = null;

    [Range(0, double.MaxValue, ErrorMessage = "Максимальная цена не может быть отрицательной")]
    public decimal? MaxPrice { get; set; } = null;
}