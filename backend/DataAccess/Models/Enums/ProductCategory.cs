using System.ComponentModel;

namespace DataAccess.Models.Enums;

public enum ProductCategory
{
    [Description("Нет категории")]
    Empty,
    [Description("Игрушки")]
    Toys,
    [Description("Одежда")]
    Clothing,
    [Description("Мужская одежда")]
    ClothingMale,
    [Description("Женская одежда")]
    ClothingFemale,
    [Description("Детская одежда")]
    ClothingKids,
    [Description("Еда")]
    Food,
    [Description("Хобби")]
    Hobby,
    [Description("Новый год")]
    NewYear,
    [Description("Здоровье")]
    Health,
    [Description("Женское")]
    Female,
    [Description("Мужское")]
    Male,
    [Description("Детское")]
    Kids,
    [Description("Обувь")]
    Shoes,
    [Description("Электроника")]
    Electronics
}