using Shared.DataTransferObjects;

namespace DataAccess.Models;

public class BaseModel: IBaseModel<BaseModel, EntityDto, EntityDto, BaseDto>
{
    public int Id { get; set; }
    public DateTime Created { get; set; } = DateTime.UtcNow;
    public DateTime Updated { get; set; } = DateTime.UtcNow;

    public void Update(BaseDto dto)
    {
        if (dto == null)
            throw new ArgumentNullException(nameof(dto));
        TrackUpdate();
    }

    public virtual EntityDto GetDto()
    {
        return new EntityDto
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
    
    public static BaseModel Create(EntityDto dto)
    {
        return new BaseModel();
    }
}