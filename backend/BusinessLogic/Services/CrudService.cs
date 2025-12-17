using System.Security.Authentication;
using DataAccess.Models;
using DataAccess.Repositories;
using Shared.Exceptions;

namespace BusinessLogic.Services;

public class CrudService<T, TDto, TCreateDto, TUpdateDto>(
        ICrudRepository<T, TUpdateDto> repository
    ) : 
    ICrudService<TDto, TCreateDto, TUpdateDto> 
    where T : IBaseModel<T, TDto, TCreateDto, TUpdateDto>
{
    public async Task<TDto> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var item = await repository.GetByIdAsync(id, cancellationToken);
        await CheckItem(item);
        return item!.GetDto();
    }


    public async Task CreateAsync(TCreateDto createDto, User user, CancellationToken cancellationToken = default)
    {
        var item = T.Create(createDto);
        item = await FillFromUser(item, user, cancellationToken);
        await repository.CreateAsync(item, cancellationToken);
    }


    public async Task UpdateByIdAsync(int id, TUpdateDto updateDto, int userId, CancellationToken cancellationToken = default)
    {        
        var item = await repository.GetByIdAsync(id, cancellationToken);
        await CheckItem(item, userId);
        await repository.UpdateAsync(item!, updateDto, cancellationToken);
    }

    public async Task DeleteByIdAsync(int id, int userId, CancellationToken cancellationToken = default)
    {
        var item = await repository.GetByIdAsync(id, cancellationToken);
        await CheckItem(item);
        await repository.DeleteAsync(item!, cancellationToken);
    }
    
    protected async virtual Task<bool> CheckItem(T? item, int userId = -1, params string[] valuesCheck)
    {
        if (userId == 0)
            throw new AuthenticationException("Данный пользователь не может редактировать этот продукт");
        return await Task.FromResult(true);
    }
    
    protected async virtual Task<T> FillFromUser(T item, User user, CancellationToken cancellationToken)
    {
        return item;
    }
}