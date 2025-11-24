namespace Shared.DataTransferObjects.Response;

public class ProductDto
{
    public int Id { get; set; }
    
    public DateTime Created { get; set; }
    
    public DateTime Updated { get; set; }
    
    public string Title { get; set; }
    
    public string Description { get; set; } = string.Empty;
    
    public int BrandId { get; set; }
    
    public BrandDto Brand { get; set; }
}

public class ProductLinkedDto : ProductDto
{
    public BrandLinkedDto Brand { get; set; }
}