namespace DataAccess.Models;

public class CartUpdateDto
{
    public bool IsAdding { get; set; }
    
    public Product Product { get; set; }
}