using Shared.DataTransferObjects;

namespace DataAccess.Models;

public class User : BaseModel
{
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Surname { get; set; } = string.Empty;
    public string Patronymic { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    
    public bool IsAdmin { get; set; } = false;
    
    public ICollection<UserBrand> UserBrand { get; set; } = new List<UserBrand>();
    
    public static User Create(UserCreateDto dto)
    {
        if (dto == null || dto.Name == null || dto.Email == null || dto.Password == null || dto.Surname == null)
            throw new ArgumentNullException(nameof(dto));
        var user = new User()
        {
            Username = dto.Username,
            Email = dto.Email,
            Name = dto.Name,
            Surname = dto.Surname,
            Patronymic = dto.Patronymic,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
        };
        return user;
    }

    public void Update(UserUpdateDto dto)
    {
        Update((BaseDto)dto);
        Username = dto.Username ?? Username;
        Email = dto.Email ??  Email;
        Name = dto.Name ?? Name;
        Surname = dto.Surname ??  Surname;
        Patronymic = dto.Patronymic ?? Patronymic;
    }
}