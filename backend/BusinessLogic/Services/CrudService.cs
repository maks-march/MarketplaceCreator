using System.Security.Authentication;
using DataAccess.Models;
using DataAccess.Repositories;
using Microsoft.AspNetCore.Http;

namespace BusinessLogic.Services;

public class CrudService<T, TDto, TCreateDto, TUpdateDto>(
        ICrudRepository<T, TUpdateDto> repository
    ) : 
    ICrudService<TDto, TCreateDto, TUpdateDto> 
    where T : IBaseModel<T, TDto, TCreateDto, TUpdateDto>
{
    public virtual async Task<TDto> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var item = await repository.GetByIdAsync(id, cancellationToken);
        await CheckItem(item);
        return item!.GetDto();
    }


    public virtual async Task CreateAsync(TCreateDto createDto, User user, CancellationToken cancellationToken = default)
    {
        var item = T.Create(createDto);
        item = await FillFromUser(item, user, cancellationToken);
        await repository.CreateAsync(item, cancellationToken);
    }


    public virtual async Task UpdateByIdAsync(int id, TUpdateDto updateDto, int userId, CancellationToken cancellationToken = default)
    {        
        var item = await repository.GetByIdAsync(id, cancellationToken);
        await CheckItem(item, userId);
        await repository.UpdateAsync(item!, updateDto, cancellationToken);
    }

    public virtual async Task DeleteByIdAsync(int id, int userId, CancellationToken cancellationToken = default)
    {
        var item = await repository.GetByIdAsync(id, cancellationToken);
        await CheckItem(item);
        await repository.DeleteAsync(item!, cancellationToken);
    }
    
    protected virtual async Task<bool> CheckItem(T? item, int userId = -1, params string[] valuesCheck)
    {
        if (userId == 0)
            throw new AuthenticationException("Данный пользователь не может редактировать этот продукт");
        return await Task.FromResult(true);
    }
    
    protected virtual async Task<T> FillFromUser(T item, User user, CancellationToken cancellationToken)
    {
        return item;
    }
    
    protected virtual async Task<string[]> SaveImagesAsync(IFormFile[] images, int userId)
    {
        var imageUrls = new List<string>();
        foreach (var image in images)
        {
            string imageUrl = "";
            if (image != null)
            {
                imageUrl = await SaveImageAsync(image, userId);
            }
            imageUrls.Add(imageUrl);
        }

        return imageUrls.ToArray();
    }
    
    private async Task<string> SaveImageAsync(IFormFile file, int userId, string path = "uploads")
    {
        var fileExtension = Path.GetExtension(file.FileName);
        var fileName = $"{Guid.NewGuid()}_{userId}{fileExtension}";
    
        var uploadsPath = Path.Combine("/staticfiles", path);
    
        // ЕСЛИ НЕТ ПАПКИ - СОЗДАЕМ
        if (!Directory.Exists(uploadsPath))
            Directory.CreateDirectory(uploadsPath);
    
        var fullPath = Path.Combine(uploadsPath, fileName);
    
        // СОХРАНЯЕМ НА ДИСК
        using (var stream = new FileStream(fullPath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }
    
        // ВОЗВРАЩАЕМ ОТНОСИТЕЛЬНЫЙ ПУТЬ
        return $"/uploads/{fileName}";
    }
}