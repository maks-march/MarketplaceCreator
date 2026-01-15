using System.ComponentModel;

namespace DataAccess.Models.Enums;

public enum ColorScheme
{
    [Description("Нет цветовой схемы")]
    Empty,
    [Description("Белый")]
    White,
    [Description("Черный")]
    Black,
    [Description("Коричневый")]
    Brown,
    [Description("Серый")]
    Grey,
    [Description("Зеленый")]
    Green,
    [Description("Красный")]
    Red,
    [Description("Синий")]
    Blue,
    [Description("Желтый")]
    Yellow
}