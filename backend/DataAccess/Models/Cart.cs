namespace DataAccess.Models;

public class Cart : BaseModel, IBaseModel<Cart, CartLinkedDto, CartCreateDto, CartUpdateDto>
{
    public ICollection<Product> Brands { get; set; } = new List<Product>();
    
    public decimal Price { get; set; }
    
    public Brand Brand { get; set; }
}