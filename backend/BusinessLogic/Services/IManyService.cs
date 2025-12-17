namespace BusinessLogic.Services;

public interface IManyService<T, TDto, TSearchDto>
{
    Task<IEnumerable<TDto>> GetFilteredAsync(TSearchDto searchDto, Func<T, bool>? filter = null, CancellationToken cancellationToken = default);
}