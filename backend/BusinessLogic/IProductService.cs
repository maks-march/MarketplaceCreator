namespace BusinessLogic;

public interface IProductService
{
    Task CreateAsync(string title, string description = "", CancellationToken cancellationToken = default);
    
    Task<string> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    
    Task UpdateByIdAsync(int id, string title, CancellationToken cancellationToken = default);
    Task DeleteByIdAsync(int id, CancellationToken cancellationToken = default);
}