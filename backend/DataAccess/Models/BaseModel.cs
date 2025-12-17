using Shared.DataTransferObjects;

namespace DataAccess.Models;

public class BaseModel: IBaseModel<BaseModel, BaseDto, BaseDto, BaseDto>
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

    public virtual BaseDto GetDto()
    {
        return new BaseDto
        {
            Id = Id,
            Created = Created,
            Updated = Updated
        };
    }

    protected void TrackUpdate()
    {
        Updated = DateTime.UtcNow;
    }
    
    public static BaseModel Create(BaseDto dto)
    {
        return new BaseModel();
    }
}