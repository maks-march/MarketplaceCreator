using System.ComponentModel.DataAnnotations;
using Shared.DataTransferObjects;
using Shared.DataTransferObjects.Response;

namespace DataAccess.Models;

public class News : 
    BaseModel, IBaseModel<News, NewsLinkedDto, NewsCreateDto, NewsUpdateDto>
{
    [Required]
    public string Title { get; set; }
    
    [Required]
    public string Description { get; set; }
    
    public string[] ImageLinks { get; set; }
    
    [Required]
    public int BrandId { get; set; }
    
    public Brand Brand { get; set; }
    
    public static News Create(NewsCreateDto dto)
    {
        if (dto == null || dto.Title == null)
            throw new ArgumentNullException(nameof(dto));
        var news = new News()
        {
            Title = dto.Title,
            Description = dto.Description,
            BrandId = dto.BrandId
        };
        return news;
    }
    
    public void Update(NewsUpdateDto dto)
    {
        Update((BaseDto)dto);
        Title = dto.Title ?? Title;
        Description = dto.Description ?? Description;
    }
    
    public NewsDto GetUnlinkedDto()
    {
        return new NewsDto
        {
            Id = Id,
            Created = Created,
            Updated = Updated,
            Title = Title,
            Description = Description
        };
    }
    
    public override NewsLinkedDto GetDto()
    {
        var dto = new NewsLinkedDto();
        dto.CopyFrom(GetUnlinkedDto());
        dto.BrandId = BrandId;
        dto.Brand = Brand.GetDto();
        return dto;
    }
}