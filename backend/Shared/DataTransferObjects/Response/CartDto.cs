namespace Shared.DataTransferObjects.Response.CartDto;

public class CartDto : EntityDto
{
    public ICollection<ProductDto> Products { get; set; }
    
    public decimal Total { get; set; }
    
    public UserDto User { get; set; }
}

public class CartLinkedDto : EntityDto
{
    public ICollection<ProductLinkedDto> Products { get; set; }
    
    public decimal Total { get; set; }
    
    public UserLinkedDto User { get; set; }
}