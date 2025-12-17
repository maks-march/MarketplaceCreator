using Shared.DataTransferObjects;
using Shared.DataTransferObjects.Response;

namespace DataAccess.Models;

public class User : BaseModel, IBaseModel<User, UserLinkedDto, UserCreateDto, UserUpdateDto>
{
    public string Username { get; set; }
    public string Email { get; set; }
    public string Name { get; set; }
    public string Surname { get; set; }
    public string Patronymic { get; set; } = string.Empty;
    public string PasswordHash { get; set; }
    
    public bool IsAdmin { get; set; } = false;
    
    public ICollection<Brand> Brands { get; set; } = new List<Brand>();
    
    public int RefreshTokenId { get; set; }
    public RefreshToken RefreshToken { get; set; }
    
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
    
    
    public UserDto GetUnlinkedDto()
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
        dto.CopyFrom(GetUnlinkedDto());
        
        dto.Email = Email;
        dto.PasswordHash = PasswordHash;
        dto.RefreshTokenId = RefreshTokenId;
        return dto;
    }

    public override UserLinkedDto GetDto()
    {
        var dto = new UserLinkedDto();
        dto.CopyFrom(GetUnlinkedDto());
        
        dto.Brands = Brands.Select(b => new BrandLinkedDto
            {
                Id = b.Id,
                Created = b.Created,
                Updated = b.Updated,
                Name = b.Name,
                Users = b.Users
                    .Select(u => u.GetUnlinkedDto())
                    .ToList(),
                Products = b.Products
                    .Select(p => p.GetUnlinkedDto())
                    .ToList()
            })
            .ToList();
        return dto;
    }
}