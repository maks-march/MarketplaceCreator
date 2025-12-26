namespace Shared.DataTransferObjects;

public class EntityDto : BaseDto
{
    public int Id { get; set; }
    
    public DateTime Created { get; set; }
    
    public DateTime Updated { get; set; }
}