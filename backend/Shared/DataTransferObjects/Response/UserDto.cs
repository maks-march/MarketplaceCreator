namespace Shared.DataTransferObjects.Response;

public class UserDto: EntityDto
{
    public string Username { get; set; }
    
    public string Name { get; set; }
    
    public string Surname { get; set; }
    
    public string Patronymic { get; set; }
    
    public bool IsAdmin { get; set; } = false;
    
    public void CopyFrom(UserDto other)
    {
        Id = other.Id;
        Created = other.Created;
        Updated = other.Updated;
        Username = other.Username;
        Name = other.Name;
        Surname = other.Surname;
        Patronymic = other.Patronymic;
        IsAdmin = other.IsAdmin;
    }
}

public class UserLinkedDto : UserDto
{
    public ICollection<BrandLinkedDto> Brands { get; set; } = new List<BrandLinkedDto>();
}

public class UserSecureDto : UserDto
{
    public int RefreshTokenId { get; set; }
    public string PasswordHash { get; set; }
    
    public string Email { get; set; }
}