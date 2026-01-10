namespace Shared.DataTransferObjects.Response;

public class NewsDto: EntityDto
{
    public string Title { get; set; }
    
    public string Description { get; set; }
    
    public string[] ImageLinks { get; set; }
    
    public void CopyFrom(NewsDto other)
    {
        Id = other.Id;
        Created = other.Created;
        Updated = other.Updated;
        Title = other.Title;
        Description = other.Description;
        ImageLinks = other.ImageLinks;
    }
}

public class NewsLinkedDto : NewsDto
{
    public int BrandId { get; set; }
    public BrandDto Brand { get; set; }
}