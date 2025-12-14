using DataAccess.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories;

internal class RefreshTokenRepository(AppContext context) : IRefreshTokenRepository
{
    public async Task<RefreshToken?> GetByIdAsync(int tokenId, CancellationToken cancellationToken)
    {
        return await context.RefreshTokens.FirstOrDefaultAsync(t => t.Id == tokenId, cancellationToken);
    }
    public async Task<RefreshToken?> GetByTokenAsync(string token, CancellationToken cancellationToken)
    {
        return await context.RefreshTokens.FirstOrDefaultAsync(t => t.Token == token, cancellationToken);
    }

    public async Task CreateAsync(RefreshToken token, CancellationToken cancellationToken)
    {
        await context.RefreshTokens.AddAsync(token, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(RefreshToken token, string newToken, CancellationToken cancellationToken)
    {
        token.Update(newToken);
        context.RefreshTokens.Update(token);
        await context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(RefreshToken token, CancellationToken cancellationToken)
    {
        context.RefreshTokens.Remove(token);
        await context.SaveChangesAsync(cancellationToken);
    }
}