namespace Shared.DataTransferObjects;

public class ProductSearchDTO
{
    public string Query { get; set; } = "";
    // public string Category { get; set; }
    // public decimal? MinPrice { get; set; }
    // public decimal? MaxPrice { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}