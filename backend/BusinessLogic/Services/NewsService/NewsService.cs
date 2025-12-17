using System.Security.Authentication;
using DataAccess.Models;
using DataAccess.Repositories.NewsRepository;
using Shared.DataTransferObjects;
using Shared.DataTransferObjects.Response;
using Shared.Exceptions;

namespace BusinessLogic.Services.NewsService;

public class NewsService(INewsRepository newsRepository):
    CrudService<News, NewsLinkedDto, NewsCreateDto, NewsUpdateDto>(newsRepository),
    INewsService
{
    protected async override Task<bool> CheckItem(News? item, int userId = -1, params string[] valuesCheck)
    {
        base.CheckItem(item, userId, valuesCheck);
        if (item is null)
        {
            throw new NotFoundException($"Бренда с id {item.BrandId} не найдено");
        }
        if (userId != -1 && item!.Brand.Users.All(u => u.Id != userId))
            throw new AuthenticationException("Данный пользователь не может редактировать этот продукт");
        return await Task.FromResult(true);
    }

    protected async override Task<News> FillFromUser(News item, User user, CancellationToken cancellationToken)
    {
        var brand = user.Brands.FirstOrDefault(b => b.Id == item.BrandId);
        if (brand is null)
            throw new NotFoundException($"Бренда с id {item.BrandId} не найдено");
        item.Brand = brand;
        return await base.FillFromUser(item, user, cancellationToken);
    }

    public async Task<IEnumerable<NewsLinkedDto>> GetFilteredAsync(NewsSearchDto searchDto, Func<News, bool>? filter = null, CancellationToken cancellationToken = default)
    {
        var products = await newsRepository.GetAllAsync(cancellationToken);
        if (!string.IsNullOrEmpty(searchDto.Query))
            products = products.Where(
                p => p.Title.Contains(searchDto.Query) || p.Description.Contains(searchDto.Query)
            );
        return products
            .Where(p => filter is null || filter(p)).Skip((searchDto.Page - 1) * searchDto.PageSize)
            .Take(searchDto.PageSize)
            .Select(p => p.GetDto())
            .ToList();
    }
}