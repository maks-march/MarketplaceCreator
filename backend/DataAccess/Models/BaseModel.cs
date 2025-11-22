using Shared.DataTransferObjects;

namespace DataAccess.Models;

public class BaseModel
{
    public int Id { get; set; }
    public DateTime Created { get; set; }
    public DateTime Updated { get; set; }

    public void Update(BaseDto dto)
    {
        if (dto == null)
            throw new ArgumentNullException(nameof(dto));
        TrackUpdate();
    }

    protected void TrackUpdate()
    {
        Updated = DateTime.UtcNow;
    }

    public BaseModel()
    {
        Created = DateTime.UtcNow;
        Updated = DateTime.UtcNow;
    }
}