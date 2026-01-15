using System.ComponentModel;
using DataAccess.Models.Enums;

namespace DataAccess;

public static class EnumConverter
{
    public static T ConvertToEnum<T>(string description) where T : struct, Enum
    {
        return Convert<T>(description);
    }
    
    public static string ConvertToString<T>(T value) where T : struct, Enum
    {
        return value.GetDescription();
    }
    
    public static bool TryConvertToEnum<T>(string description, out T result) where T : struct, Enum
    {
        try
        {
            result = Convert<T>(description);
            return true;
        }
        catch
        {
            result = default;
            return false;
        }
    }
    
    private static T Convert<T>(string description)
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
        throw new ArgumentException($"{description} не валидная категория");
    }
}