using DataAccess.Models;

namespace DataAccess.Repositories.RefreshtokenRepository;

public interface IRefreshTokenRepository
{
    Task<RefreshToken?> GetByUserIdAsync(int userId, CancellationToken cancellationToken);
    Task<RefreshToken?> GetByIdAsync(int tokenId, CancellationToken cancellationToken);
    Task CreateAsync(RefreshToken token, CancellationToken cancellationToken);
    Task UpdateAsync(RefreshToken token, string newToken, CancellationToken cancellationToken);
    Task DeleteAsync(RefreshToken token, CancellationToken cancellationToken);
}