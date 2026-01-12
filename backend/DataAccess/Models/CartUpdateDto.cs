using DataAccess.Models;

namespace Shared.DataTransferObjects.Request.CartDto;

public class CartUpdateDto
{
    public bool IsAdding { get; set; }
    
    public Product Product { get; set; }
}