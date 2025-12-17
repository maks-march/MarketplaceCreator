namespace Shared.DataTransferObjects.Response;

public class NewsDto: BaseDto
{
    
    public string Title { get; set; }
    
    public string Description { get; set; }
    
    public void CopyFrom(NewsDto other)
    {
        Id = other.Id;
        Created = other.Created;
        Updated = other.Updated;
        Title = other.Title;
        Description = other.Description;
    }
}

public class NewsLinkedDto : NewsDto
{
    public int BrandId { get; set; }
    public BrandDto Brand { get; set; }
}