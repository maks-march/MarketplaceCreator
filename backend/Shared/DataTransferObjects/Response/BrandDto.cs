namespace Shared.DataTransferObjects.Response;

public class BrandDto
{
    public int Id { get; set; }
    
    public DateTime Created { get; set; }
    
    public DateTime Updated { get; set; }
    
    public string Name { get; set; }
}

public class BrandLinkedDto : BrandDto
{
    public ICollection<UserDto> Users { get; set; } = new List<UserDto>();
    
    public ICollection<ProductDto>? Products { get; set; } = new List<ProductDto>();
}