using Shared.DataTransferObjects.Request.CartDto;
using Shared.DataTransferObjects.Response.CartDto;

namespace DataAccess.Models;

public class Cart : BaseModel, IBaseModel<Cart, CartLinkedDto, CartCreateDto, CartUpdateDto>
{
    public ICollection<Product> Products { get; set; } = new List<Product>();
    
    public int UserId { get; set; }
    public User User { get; set; }
    
    public void Update(CartUpdateDto dto)
    {
        if (dto.IsAdding)
        {
            Products.Add(dto.Product);
        }
        else
        {
            Products.Remove(dto.Product);
        }
    }
    
    public CartDto GetUnlinkedDto()
    {
        return new()
        {
            Products = Products.Select(x => x.GetUnlinkedDto()).ToList(),
            Total = Products.Select(x => x.Price).Sum(),
            User = User.GetUnlinkedDto()
        };
    }

    public CartLinkedDto GetDto()
    {
        return new()
        {
            Products = Products.Select(x => x.GetDto()).ToList(),
            Total = Products.Select(x => x.Price).Sum(),
            User = User.GetDto()
        };
    }

    public static Cart Create(CartCreateDto dto)
    {
        return new Cart()
        {
            Products = new List<Product>()
        };
    }
}

