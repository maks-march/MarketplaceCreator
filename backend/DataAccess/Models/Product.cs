using System.ComponentModel.DataAnnotations;

namespace DataAccess.Models;

public class Product
{
    public int Id { get; set; }
    [Required]
    public int BrandId { get; set; }
    [Required]
    public string Title { get; set; }
    public string Description { get; set; }
    public DateTime Created { get; set; }
    public DateTime Updated { get; set; }
}

