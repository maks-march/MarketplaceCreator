namespace Shared.DataTransferObjects.Response;

public class CartDto : EntityDto
{
    public ICollection<ProductDto> Items { get; set; }
    
    public decimal Total { get; set; }
    
    public UserDto User { get; set; }
}

public class CartLinkedDto : EntityDto
{
    public ICollection<ProductLinkedDto> Items { get; set; }
    
    public decimal Total { get; set; }
    
    public UserLinkedDto User { get; set; }
}