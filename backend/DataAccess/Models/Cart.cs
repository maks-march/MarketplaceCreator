using Shared.DataTransferObjects.Request.CartDto;
using Shared.DataTransferObjects.Response;
using Shared.Exceptions;

namespace DataAccess.Models;

public class Cart : BaseModel, IBaseModel<Cart, CartLinkedDto, CartCreateDto, CartUpdateDto>
{
    public ICollection<CartItem> Items { get; set; } = new List<CartItem>();
    
    public User User { get; set; }
    
    public void Update(CartUpdateDto dto)
    {
        TrackUpdate();
        var item = Items.FirstOrDefault(i => i.Product == dto.Product);
        
        if (dto.IsAdding)
        {
            if (item != null)
            {
                item.Amount++;
            }
            else
            {
                item = new CartItem()
                {
                    Product = dto.Product,
                    Amount = 1,
                    CartId = this.Id,
                    ProductId = dto.Product.Id,
                    Cart = this,
                    Created = DateTime.UtcNow
                };
                Items.Add(item);
            }
        }
        else
        {
            if (item == null)
            {
                throw new NotFoundException("Данный элемент не добавлен в корзину");
            }
            
            item.Amount--;
            if (item.Amount == 0)
                Items.Remove(item);
        }
        item.Update(new());
    }
    
    public CartDto GetUnlinkedDto()
    {
        return new()
        {
            Id = Id,
            Created = Created,
            Updated = Updated,
            Items = Items.Select(x => x.Product.GetUnlinkedDto()).ToList(),
            Total = Items.Select(x => x.Price).Sum(),
            User = User.GetUnlinkedDto()
        };
    }

    public CartLinkedDto GetDto()
    {
        return new()
        {
            Id = Id,
            Created = Created,
            Updated = Updated,
            Items = Items.Select(x => x.Product.GetDto()).ToList(),
            Total = Items.Select(x => x.Price).Sum(),
            User = User.GetDto()
        };
    }

    public static Cart Create(CartCreateDto dto)
    {
        return new Cart()
        {
            Items = new List<CartItem>()
        };
    }
}

public class CartItem : BaseModel
{
    public int CartId { get; set; }
    public Cart Cart { get; set; }
    
    public int ProductId { get; set; }
    
    public Product Product { get; set; }
    
    public int Amount { get; set; }
    
    public decimal Price { get { return Product.Price * Amount; } }
}

