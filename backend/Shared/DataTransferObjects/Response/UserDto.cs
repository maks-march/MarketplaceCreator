namespace Shared.DataTransferObjects.Response;

public class UserDto
{
    public int Id { get; set; }
    
    public DateTime Created { get; set; }
    
    public DateTime Updated { get; set; }
    
    public string Username { get; set; }
    
    public string Name { get; set; }
    
    public string Surname { get; set; }
    
    public string Patronymic { get; set; }
    
    public bool IsAdmin { get; set; } = false;
}

public class UserLinkedDto : UserDto
{
    public ICollection<BrandDto> Brands { get; set; } = new List<BrandDto>();
}

public class UserSecureDto : UserDto
{
    public string PasswordHash { get; set; }
    
    public string Email { get; set; }
}