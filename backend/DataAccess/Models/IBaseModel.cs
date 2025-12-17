namespace DataAccess.Models;

public interface IBaseModel<T, TDto, TCreateDto, TUpdateDto>
{
    void Update(TUpdateDto dto);
    TDto GetDto();
    static abstract T Create(TCreateDto dto);
}