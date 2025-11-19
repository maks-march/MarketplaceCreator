using Shared.DataTransferObjects;

namespace DataAccess.Models;

public static class ProductExtensions
{
    public static Product Create(ProductCreateDTO productDto)
    {
        if (productDto == null || productDto.Title == null)
            throw new ArgumentNullException(nameof(productDto));

        var product = new Product()
        {
            Title = productDto.Title
        };
        
        if (productDto.Description != null)
            product.Description = productDto.Description;

        return product;
    }

    public static Product Update(this Product product, ProductUpdateDTO productDto)
    {
        if (productDto == null)
            throw new ArgumentNullException(nameof(productDto));
            
        if (productDto.Title != null)
            product.Title = productDto.Title;
            
        if (productDto.Description != null)
            product.Description = productDto.Description;
        
        return product;
    }
}