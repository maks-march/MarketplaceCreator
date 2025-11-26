using Shared.DataTransferObjects;
using Shared.DataTransferObjects.Response;

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
    
    public ICollection<Brand> Brands { get; set; } = new List<Brand>();
    
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
    
    
    public UserDto GetDto()
    {
        return new UserDto
        {
            Id = Id,
            Created = Created,
            Updated = Updated,
            Username = Username,
            Name = Name,
            Surname = Surname,
            Patronymic = Patronymic,
            IsAdmin = IsAdmin
        };
    }
    
    public UserSecureDto GetSecuredDto()
    {
        var dto = new UserSecureDto();
        dto.CopyFrom(GetDto());
        
        dto.Email = Email;
        dto.PasswordHash = PasswordHash;
        return dto;
    }

    public UserLinkedDto GetLinkedDto()
    {
        var dto = new UserLinkedDto();
        dto.CopyFrom(GetDto());
        
        dto.Brands = Brands.Select(b => new BrandLinkedDto
            {
                Id = b.Id,
                Created = b.Created,
                Updated = b.Updated,
                Name = b.Name,
                Users = b.Users
                    .Select(u => u.GetDto())
                    .ToList(),
                Products = b.Products
                    .Select(p => p.GetDto())
                    .ToList()
            })
            .ToList();
        return dto;
    }
}