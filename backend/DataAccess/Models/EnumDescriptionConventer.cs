using System.ComponentModel;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace DataAccess.Models;

public class EnumDescriptionConverter<T> : ValueConverter<T, string>
    where T : struct, Enum
{
    public EnumDescriptionConverter() : base(
        v => v.GetDescription(), // Enum → String (в БД)
        v => ConvertToEnum(v),   // String → Enum (из БД)
        new ConverterMappingHints(size: 100)) // Макс длина строки
    {
    }
    
    private static T ConvertToEnum(string description)
    {
        foreach (var field in typeof(T).GetFields())
        {
            if (Attribute.GetCustomAttribute(field, typeof(DescriptionAttribute))
                is DescriptionAttribute attribute)
            {
                if (attribute.Description == description)
                    return (T)field.GetValue(null);
            }
        }
        
        // Если не нашли по Description, пробуем по имени
        if (Enum.TryParse<T>(description, out var result))
            return result;
            
        return default;
    }
}