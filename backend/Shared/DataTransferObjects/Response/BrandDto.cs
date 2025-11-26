namespace Shared.DataTransferObjects.Response;

public class BrandDto
{
    public int Id { get; set; }
    
    public DateTime Created { get; set; }
    
    public DateTime Updated { get; set; }
    
    public string Name { get; set; }
    
    public void CopyFrom(BrandDto other)
    {
        Id = other.Id;
        Created = other.Created;
        Updated = other.Updated;
        Name = other.Name;
    }
}

public class BrandLinkedDto : BrandDto
{
    public ICollection<UserDto> Users { get; set; } = new List<UserDto>();
    
    public ICollection<ProductDto>? Products { get; set; } = new List<ProductDto>();
}