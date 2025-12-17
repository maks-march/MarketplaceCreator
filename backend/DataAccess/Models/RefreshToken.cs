using DataAccess.Migrations;
using Microsoft.AspNetCore.Http.HttpResults;
using Shared.DataTransferObjects;

namespace DataAccess.Models;

public class RefreshToken : BaseModel
{
    public required string Token { get; set; }
    
    public DateTime Expires { get; set; }
    
    public User User { get; set; }

    public void Update(string token)
    {
        TrackUpdate();
        Token = token;
        Expires = Updated.AddMinutes(20);
    }

    public static RefreshToken Create(string token)
    {
        return new RefreshToken()
        {
            Token = token,
            Expires = DateTime.UtcNow.AddMinutes(20),
        };
    }
}