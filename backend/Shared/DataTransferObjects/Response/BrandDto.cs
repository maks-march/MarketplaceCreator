namespace Shared.DataTransferObjects.Response;

public class BrandDto: BaseDto
{
    public string Name { get; set; }
    
    public string Description { get; set; }
    
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
    
    public ICollection<NewsDto>? News { get; set; } = new List<NewsDto>();
    
    public ICollection<ProductDto>? Products { get; set; } = new List<ProductDto>();
}