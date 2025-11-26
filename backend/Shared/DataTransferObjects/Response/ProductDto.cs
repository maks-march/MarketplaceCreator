namespace Shared.DataTransferObjects.Response;

public class ProductDto
{
    public int Id { get; set; }
    
    public DateTime Created { get; set; }
    
    public DateTime Updated { get; set; }
    
    public string Title { get; set; }
    
    public string Description { get; set; } = string.Empty;
    
    public void CopyFrom(ProductDto other)
    {
        Id = other.Id;
        Created = other.Created;
        Updated = other.Updated;
        Title = other.Title;
        Description = other.Description;
    }
}

public class ProductLinkedDto : ProductDto
{
    public int BrandId { get; set; }
    public BrandLinkedDto Brand { get; set; }
}