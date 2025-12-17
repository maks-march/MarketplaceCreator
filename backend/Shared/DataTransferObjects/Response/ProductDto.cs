namespace Shared.DataTransferObjects.Response;

public class ProductDto: BaseDto
{
    public string Title { get; set; }
    
    public decimal Price { get; set; }
    
    public string Description { get; set; } = string.Empty;
    
    public void CopyFrom(ProductDto other)
    {
        Id = other.Id;
        Created = other.Created;
        Updated = other.Updated;
        Title = other.Title;
        Price = other.Price;
        Description = other.Description;
    }
}

public class ProductLinkedDto : ProductDto
{
    public int BrandId { get; set; }
    public BrandDto Brand { get; set; }
}