namespace DataAccess.Models;

public class User
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Surname { get; set; } = string.Empty;
    public string Patronymic { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    
    public bool IsAdmin { get; set; } = false;
    
    public ICollection<UserBrand> UserBrand { get; set; } = new List<UserBrand>();
}